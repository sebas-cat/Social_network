// src/components/Mensajes.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Mensajes.css";

const API_URL = "http://localhost:3000/api/v1";

const getUser = () => {
  try {
    const raw = localStorage.getItem("usuarioFalcon");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const Mensajes = () => {
  const navigate = useNavigate();
  const user = getUser();

  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState("");
  const [cargandoChat, setCargandoChat] = useState(false);

  // 1) Cargar usuarios (posibles chats)
  useEffect(() => {
    if (!user) return;

    const loadUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/users`);
        const data = await res.json();
        setUsuarios(data.filter((u) => u._id !== user._id));
      } catch (err) {
        console.error("Error cargando usuarios", err);
      }
    };

    loadUsers();
  }, [user]);

  // 2) Cargar conversación SOLO del usuario seleccionado
  useEffect(() => {
    if (!user || !seleccionado) {
      setMensajes([]);
      return;
    }

    const controller = new AbortController();

    const loadChat = async () => {
      setCargandoChat(true);
      try {
        const res = await fetch(
          `${API_URL}/messages/conversation/${user._id}/${seleccionado._id}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Error cargando conversación");
        const data = await res.json();
        setMensajes(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error en conversación", err);
        }
      } finally {
        setCargandoChat(false);
      }
    };

    loadChat();

    // Limpieza al cambiar de chat / desmontar
    return () => controller.abort();
  }, [user?._id, seleccionado?._id]);

  const enviar = async () => {
    if (!texto.trim() || !user || !seleccionado) return;

    const msg = {
      senderID: user._id,
      receiverID: seleccionado._id,
      text: texto.trim(),
    };

    try {
      const res = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });
      if (!res.ok) throw new Error("Error al enviar mensaje");
      const saved = await res.json();
      // Se agrega solo a esta conversación
      setMensajes((prev) => [...prev, saved]);
      setTexto("");
    } catch (err) {
      console.error("Error enviando mensaje", err);
    }
  };

  // Filtro de búsqueda tipo Insta
  const usuariosFiltrados = usuarios.filter((u) => {
    const name = (u.username || u.name || u.email || "").toLowerCase();
    return name.includes(busqueda.toLowerCase());
  });

  return (
    <div className="mensajes-layout">
      <div className="mensajes-panel">
        <header className="mensajes-header">
          <div>
            <h2 className="mensajes-title">Chats</h2>
            <p className="mensajes-subtitle">Mensajes directos</p>
          </div>
        </header>

        {/* BUSCADOR */}
        <div className="mensajes-search">
          <input
            type="text"
            placeholder="Buscar"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* LISTA DE USUARIOS / CHATS */}
        <div className="usuarios-container">
          <ul className="usuarios-list">
            {usuariosFiltrados.map((u) => (
              <li
                key={u._id}
                className={`usuario-item ${
                  seleccionado && seleccionado._id === u._id ? "activo" : ""
                }`}
                onClick={() => setSeleccionado(u)}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt=""
                  className="usuario-avatar"
                />
                <div className="usuario-main">
                  <span className="usuario-nombre">
                    {u.username || u.name || u.email}
                  </span>
                  <span className="usuario-preview">
                    {seleccionado && seleccionado._id === u._id
                      ? "Viendo la conversación"
                      : "Toca para empezar a chatear"}
                  </span>
                </div>
                <span className="usuario-time">•</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CHAT ACTUAL */}
        {seleccionado && (
          <div className="chat-container">
            <div className="chat-header-line">
              Conversación con{" "}
              <strong>
                {seleccionado.username ||
                  seleccionado.name ||
                  seleccionado.email}
              </strong>
            </div>

            <div className="chat-messages">
              {cargandoChat ? (
                <p className="chat-empty">Cargando conversación...</p>
              ) : mensajes.length === 0 ? (
                <p className="chat-empty">
                  No hay mensajes todavía. Escribe el primero 👇
                </p>
              ) : (
                mensajes.map((m) => (
                  <div
                    key={m._id}
                    className={`chat-message ${
                      m.senderID === user._id ? "me" : "other"
                    }`}
                  >
                    <div className="chat-message-text">{m.text}</div>
                  </div>
                ))
              )}
            </div>

            {/* INPUT MENSAJE */}
            <div className="chat-input-row">
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") enviar();
                }}
              />
              <button onClick={enviar}>Enviar</button>
            </div>
          </div>
        )}

        <div className="mensajes-footer">
          <button className="btn-volver" onClick={() => navigate("/main")}>
            Volver al feed
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mensajes;
