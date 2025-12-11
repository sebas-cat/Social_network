import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = "http://localhost:3000/api/v1";

// ---------------------------------------
// Helpers para obtener usuario actual
// ---------------------------------------
const getCurrentUserId = () => {
  try {
    const raw = localStorage.getItem("usuarioFalcon");
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user._id || null;
  } catch {
    return null;
  }
};

const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem("usuarioFalcon");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

// ---------------------------------------
// Tarjeta de publicación
// ---------------------------------------
const PostCard = ({
  post,
  likes,
  comments,
  onLike,
  onAddComment,
  hasUserLiked,
  currentUser,
}) => {
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");

  const getDisplayName = () => {
    const u = post.userID;

    if (!u) return "Usuario";

    if (typeof u === "string") {
      if (currentUser && currentUser._id === u) {
        return (
          currentUser.username ||
          currentUser.name ||
          currentUser.email ||
          "Tú"
        );
      }
      return "Usuario";
    }

    return u.username || u.name || u.email || "Usuario";
  };

  const displayName = getDisplayName();

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const text = commentText.trim();

    if (!text) {
      setCommentError("El comentario no puede estar vacío.");
      return;
    }

    if (text.length > 250) {
      setCommentError("Máximo 250 caracteres.");
      return;
    }

    setCommentError("");
    onAddComment(post._id, text);
    setCommentText("");
  };

  const renderMedia = () => {
    if (!post.content || post.content.length === 0) return null;

    return post.content.map((item, idx) => {
      const url = (item || "").trim();

      if (url.startsWith("data:image")) {
        return (
          <img key={idx} src={url} alt="Contenido" className="post-image" />
        );
      }

      if (url.startsWith("data:video")) {
        return (
          <video key={idx} controls className="post-video">
            <source src={url} />
          </video>
        );
      }

      if (/\.(jpg|jpeg|png|gif|webp)$/i.test(url)) {
        return (
          <img key={idx} src={url} alt="Contenido" className="post-image" />
        );
      }

      if (/\.(mp4|webm|ogg)$/i.test(url)) {
        return (
          <video key={idx} controls className="post-video">
            <source src={url} />
          </video>
        );
      }

      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        return (
          <iframe
            key={idx}
            className="post-video"
            src={url}
            title={`video-${idx}`}
            allowFullScreen
          />
        );
      }

      return (
        <a key={idx} href={url} target="_blank" rel="noreferrer">
          Ver contenido
        </a>
      );
    });
  };

  return (
    <article className="post-card">
      <header className="post-header">
        <h4>{displayName}</h4>
        <span className="post-date">
          {post.date ? new Date(post.date).toLocaleString() : ""}
        </span>
      </header>

      {post.description && (
        <p className="post-description">{post.description}</p>
      )}

      <div className="post-media">{renderMedia()}</div>

      <div className="post-actions">
        <button
          className={`btn-like ${hasUserLiked ? "liked" : ""}`}
          onClick={() => onLike(post._id)}
          disabled={hasUserLiked}
        >
          {hasUserLiked ? "Te gusta" : "Me gusta"} ({likes.length})
        </button>
        <span className="comment-count">Comentarios: {comments.length}</span>
      </div>

      <div className="comments-section">
        {comments.length > 0 ? (
          <ul className="comment-list">
            {comments.map((c) => {
              const u = c.userID;
              let name = "Usuario";

              if (u && typeof u === "object") {
                name = u.username || u.name || u.email || "Usuario";
              } else if (typeof u === "string") {
                if (currentUser && currentUser._id === u) {
                  name =
                    currentUser.username ||
                    currentUser.name ||
                    currentUser.email ||
                    "Tú";
                } else {
                  name = "Usuario";
                }
              }

              return (
                <li key={c._id}>
                  <strong>{name}:</strong> {c.text}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="no-comments">Sé el primero en comentar</p>
        )}

        <form onSubmit={handleCommentSubmit} className="comment-form">
          {commentError && <p className="form-error">{commentError}</p>}
          <input
            type="text"
            placeholder="Escribe un comentario..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit">Comentar</button>
        </form>
      </div>
    </article>
  );
};

// ---------------------------------------
// MainPage – Feed y usuarios sugeridos
// ---------------------------------------
export const MainPage = () => {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]); // 👈 amigos aceptados
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState("");

  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const currentUserId = getCurrentUserId();

  const fetchAll = async () => {
    setLoading(true);
    setGlobalError("");

    try {
      const [postsRes, likesRes, commentsRes] = await Promise.all([
        fetch(`${API_URL}/posts`),
        fetch(`${API_URL}/likes`),
        fetch(`${API_URL}/comments`),
      ]);

      const [postsData, likesData, commentsData] = await Promise.all([
        postsRes.json(),
        likesRes.json(),
        commentsRes.json(),
      ]);

      setPosts(postsData);
      setLikes(likesData);
      setComments(commentsData);
    } catch (err) {
      console.error(err);
      setGlobalError("Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      if (!res.ok) throw new Error("Error cargando usuarios");

      const data = await res.json();
      const filtered = data.filter((u) => u._id !== getCurrentUserId());
      setUsers(filtered.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFriends = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/friends/user/${userId}`);
      if (!res.ok) throw new Error("Error cargando amigos");

      const data = await res.json();
      setFriends(data); // docs Friend con requesterID y targetID
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAll();
    fetchUsers();
    if (currentUserId) {
      fetchFriends(currentUserId);
    }
  }, [currentUserId]);

  const handleLike = async (postId) => {
    const userId = getCurrentUserId();
    if (!userId) return;

    const alreadyLiked = likes.some(
      (l) => l.postID === postId && l.userID === userId
    );
    if (alreadyLiked) return;

    const payload = { postID: postId, userID: userId };

    try {
      const res = await fetch(`${API_URL}/likes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const saved = await res.json();
      setLikes((prev) => [...prev, saved]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId, text) => {
    const userId = getCurrentUserId();
    if (!userId) return;

    const payload = { postID: postId, userID: userId, text };

    try {
      const res = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const saved = await res.json();
      setComments((prev) => [...prev, saved]);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------------------
  // Filtrar posts: solo tus posts + los de amigos
  // ---------------------------
  let visiblePosts = posts;

  if (currentUserId && friends.length > 0) {
    // obtener el ID del OTRO usuario en cada relación de amistad
    const friendUserIds = friends.map((f) => {
      const reqId = String(f.requesterID._id || f.requesterID);
      const tgtId = String(f.targetID._id || f.targetID);
      return reqId === String(currentUserId) ? tgtId : reqId;
    });

    visiblePosts = posts.filter((post) => {
      const u = post.userID;
      const postUserId =
        u && typeof u === "object" ? String(u._id) : String(u);

      return (
        postUserId === String(currentUserId) ||
        friendUserIds.includes(postUserId)
      );
    });
  }

  return (
    <>
      {/* HEADER */}
      <header>
        <img
          className="foto"
          src="https://lh3.googleusercontent.com/pw/AP1GczNk1oSPgEFbJsiPqzeF2XxPEBLuEf-tBlryp729WH8Xnu1gXNN3xjsXonYaQbFOaTlbdyr5qAbDNtLkmclM01fWWQa7lh7MGWp1uUH7ydG7QcnZ0pA=w2400"
          alt="ULACIT"
        />
      </header>

      {/* LAYOUT */}
      <div className="main-container">
        {/* PANEL IZQUIERDO */}
        <div className="div-op">
          <ul>
            {/* PERFIL */}
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/perfil");
                }}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="Perfil"
                />{" "}
                Perfil
              </a>
            </li>

            {/* Buscar */}
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/buscar");
                }}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/54/54481.png"
                  alt="Buscar"
                />{" "}
                Buscar
              </a>
            </li>

            {/* Notificaciones */}
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/notificaciones");
                }}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1827/1827272.png"
                  alt="Notificaciones"
                />{" "}
                Notificaciones
              </a>
            </li>

            {/* Mensajes */}
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/mensajes");
                }}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2462/2462719.png"
                  alt="Mensajes"
                />{" "}
                Mensajes
              </a>
            </li>

            {/* Calendario */}
            <li>
              <a href="#">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/747/747310.png"
                  alt="Calendario"
                />{" "}
                Calendario
              </a>
            </li>

            {/* Citas */}
            <li>
              <a href="#">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/545/545682.png"
                  alt="Citas"
                />{" "}
                Citas
              </a>
            </li>

            {/* Ajustes */}
            <li>
              <a href="#">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2099/2099058.png"
                  alt="Ajustes"
                />{" "}
                Ajustes
              </a>
            </li>
          </ul>
        </div>

        {/* FEED CENTRAL */}
        <section className="feed">
          <h3 className="post-title">Nuevos Posts</h3>

          {globalError && <p className="global-error">{globalError}</p>}

          {loading ? (
            <p>Cargando publicaciones...</p>
          ) : visiblePosts.length === 0 ? (
            <p>No hay publicaciones todavía.</p>
          ) : (
            visiblePosts
              .slice()
              .reverse()
              .map((post) => {
                const postLikes = likes.filter((l) => l.postID === post._id);
                const postComments = comments.filter(
                  (c) => c.postID === post._id
                );
                const userId = getCurrentUserId();
                const hasUserLiked = postLikes.some(
                  (l) => l.userID === userId
                );

                return (
                  <PostCard
                    key={post._id}
                    post={post}
                    likes={postLikes}
                    comments={postComments}
                    onLike={handleLike}
                    onAddComment={handleAddComment}
                    hasUserLiked={hasUserLiked}
                    currentUser={currentUser}
                  />
                );
              })
          )}
        </section>

        {/* PANEL DERECHO – RECOMENDADOS */}
        <div className="div-user">
          <h3>Recomendados</h3>

          {users.length === 0 ? (
            <p style={{ fontSize: "13px", color: "#666" }}>
              No hay usuarios disponibles.
            </p>
          ) : (
            <ul className="user-list">
              {users.map((u) => (
                <li key={u._id}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    alt="user"
                  />
                  {u.username || u.name || u.email || "--"}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* BOTÓN FLOTANTE CENTRADO ABAJO */}
      <button
        className="btn-crear-post-float"
        onClick={() => navigate("/crear-post")}
      >
        +
      </button>
    </>
  );
};
