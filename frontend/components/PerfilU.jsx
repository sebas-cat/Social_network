// src/components/PerfilU.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PerfilU.css";

const API_URL = "http://localhost:3000/api/v1";

const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem("usuarioFalcon");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const PerfilU = () => {
  const navigate = useNavigate();
  const user = getCurrentUser(); // 👈 lo usamos solo para mostrar datos

  const [misPosts, setMisPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState("");

  const [friendsCount, setFriendsCount] = useState(0);

  useEffect(() => {
    // Leemos el usuario dentro del efecto también
    const u = getCurrentUser();

    if (!u || !u._id) {
      setLoadingPosts(false);
      return;
    }

    const cargarDatos = async () => {
      setLoadingPosts(true);
      setPostsError("");

      try {
        // 1) Traer todos los posts
        const resPosts = await fetch(`${API_URL}/posts`);
        if (!resPosts.ok) throw new Error("Error al obtener posts");
        const dataPosts = await resPosts.json();

        // 2) Filtrar los del usuario
        const soloMios = dataPosts.filter((p) => {
          const owner = p.userID;
          const postUserId =
            owner && typeof owner === "object" ? String(owner._id) : String(owner);
          return postUserId === String(u._id);
        });

        setMisPosts(soloMios);

        // 3) Contar amigos desde /friends/user/:userID
        try {
          const resFriends = await fetch(`${API_URL}/friends/user/${u._id}`);
          if (resFriends.ok) {
            const dataFriends = await resFriends.json();
            setFriendsCount(dataFriends.length || 0);
          } else {
            setFriendsCount(0);
          }
        } catch (e) {
          console.warn("Error cargando amigos en PerfilU:", e);
          setFriendsCount(0);
        }
      } catch (err) {
        console.error("Error cargando publicaciones en PerfilU:", err);
        setPostsError("No se pudieron cargar tus publicaciones.");
      } finally {
        setLoadingPosts(false);
      }
    };

    cargarDatos();
  }, []); // 👈 sin dependencias, se ejecuta una sola vez

  if (!user) {
    return (
      <div className="perfil-layout">
        <p style={{ color: "white", padding: 20 }}>
          No se encontró información de usuario. Inicia sesión de nuevo.
        </p>
      </div>
    );
  }

  const nombre =
    user.username || user.name || user.email || "Usuario Falcon";
  const carrera = user.degree || "Estudiante ULACIT";
  const email = user.email || "correo@ejemplo.com";
  const birthdate = user.birthdate || "—";
  const studentId = user._id || "—";

  return (
    <div className="perfil-layout">
      {/* BARRA LATERAL IZQUIERDA */}
      <aside className="sidebar">
        <div className="menu-header">
          <h3>Menú</h3>
        </div>
        <nav>
          <ul className="menu-list">
            <li>
              <button
                className="menu-link-button"
                onClick={() => navigate("/main")}
              >
                Inicio
              </button>
            </li>
            <li>
              <button className="menu-link-button active">Perfil</button>
            </li>
            <li>
              <button className="menu-link-button">Horario</button>
            </li>
            <li>
              <button
                className="menu-link-button"
                onClick={() => navigate("/mensajes")}
              >
                Mensajes
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        <div className="container">
          {/* CARD DE PERFIL */}
          <section className="profile-card card-base">
            <div className="profile-avatar-container">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt={`Foto de perfil de ${nombre}`}
              />
            </div>

            <hgroup>
              <h1 className="profile-name">{nombre}</h1>
              <p className="profile-degree">{carrera}</p>
            </hgroup>

            <div className="profile-stats">
              <span>
                <strong>{misPosts.length}</strong> Publicaciones
              </span>
              <span>
                <strong>{friendsCount}</strong> Amigos
              </span>
            </div>

            <div className="profile-actions">
              <button className="btn-primary" disabled>
                Seguir
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate("/main")}
              >
                Volver al feed
              </button>
            </div>
          </section>

          {/* INFO PERSONAL */}
          <section className="student-info card-base">
            <h2>Información Personal</h2>
            <div className="info-details">
              <div className="info-item">
                <span className="info-label">Fecha de Nacimiento</span>
                <span className="info-value">{birthdate}</span>
              </div>
              <div className="info-item">
                <span className="info-label">ID Estudiantil</span>
                <span className="info-value">{studentId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Correo Electrónico</span>
                <span className="info-value">{email}</span>
              </div>
            </div>
          </section>

          {/* PUBLICACIONES DEL USUARIO */}
          <section className="user-posts">
            <h2>Publicaciones</h2>

            {postsError && (
              <p style={{ color: "#ffcccc", fontSize: "13px" }}>{postsError}</p>
            )}

            {loadingPosts ? (
              <div className="no-posts-box card-base">
                <p className="no-posts-message">Cargando tus publicaciones…</p>
              </div>
            ) : misPosts.length === 0 ? (
              <div className="no-posts-box card-base">
                <p className="no-posts-message">
                  Todavía no has publicado nada. Crea tu primera publicación
                  desde el feed.
                </p>
              </div>
            ) : (
              <div className="user-posts-list">
                {misPosts
                  .slice()
                  .reverse()
                  .map((p) => (
                    <article key={p._id} className="user-post-card card-base">
  <h4 className="user-post-title">
    {p.description || "(Sin descripción)"}
  </h4>

  <p className="user-post-date">
    {p.date ? new Date(p.date).toLocaleString() : "Sin fecha"}
  </p>

  {/* Multimedia del post */}
  {p.content && p.content.length > 0 && (
    <div className="post-media">
      {p.content.map((item, idx) => {
        const url = (item || "").trim();

        // IMAGENES BASE64
        if (url.startsWith("data:image")) {
          return (
            <img
              key={idx}
              src={url}
              alt="Contenido multimedia"
              className="post-image"
            />
          );
        }

        // VIDEOS BASE64
        if (url.startsWith("data:video")) {
          return (
            <video key={idx} controls className="post-video">
              <source src={url} />
            </video>
          );
        }

        // IMÁGENES URL
        if (/\.(jpg|jpeg|png|gif|webp)$/i.test(url)) {
          return (
            <img
              key={idx}
              src={url}
              alt="Contenido multimedia"
              className="post-image"
            />
          );
        }

        // VIDEOS URL
        if (/\.(mp4|webm|ogg)$/i.test(url)) {
          return (
            <video key={idx} controls className="post-video">
              <source src={url} />
            </video>
          );
        }

        // YOUTUBE
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

        // LINK DESCONOCIDO
        return (
          <a key={idx} href={url} target="_blank" rel="noreferrer">
            Ver contenido
          </a>
        );
      })}
    </div>
  )}
</article>

                  ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default PerfilU;
