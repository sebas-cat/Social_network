// src/components/Noti.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Noti.css";

const API_URL = "http://localhost:3000/api/v1";

const getUser = () => {
  try {
    const raw = localStorage.getItem("usuarioFalcon");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const Noti = () => {
  const navigate = useNavigate();
  const user = getUser();

  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?._id) return;

    const loadNotis = async () => {
      setCargando(true);
      setError("");
      try {
        const res = await fetch(
          `${API_URL}/notifications?userId=${encodeURIComponent(user._id)}`
        );
        if (!res.ok) throw new Error("Error cargando notificaciones");
        const data = await res.json();
        setNotificaciones(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las notificaciones.");
      } finally {
        setCargando(false);
      }
    };

    loadNotis();
  }, [user?._id]);

  const marcarLeida = async (id) => {
    try {
      const res = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Error marcando como leída");

      const updated = await res.json();

      setNotificaciones((prev) =>
        prev.map((n) => (n._id === id ? updated : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="noti-layout">
      <div className="noti-panel">
        <header className="noti-header">
          <h2 className="noti-title">Notificaciones</h2>
          <p className="noti-subtitle">
            Likes, comentarios y mensajes recientes
          </p>
        </header>

        {error && <p className="noti-error">{error}</p>}

        {cargando ? (
          <p className="noti-empty">Cargando notificaciones...</p>
        ) : notificaciones.length === 0 ? (
          <p className="noti-empty">
            No tienes notificaciones por ahora 
          </p>
        ) : (
          <ul className="noti-list">
            {notificaciones.map((n) => (
              <li
                key={n._id}
                className={`noti-item ${n.status ? "" : "noti-unread"}`}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt=""
                  className="noti-avatar"
                />
                <div className="noti-main">
                  <span className="noti-text">{n.text}</span>
                  <span className="noti-time">
                    {n.date ? new Date(n.date).toLocaleString() : ""}
                  </span>
                </div>
                {!n.status && (
                  <button
                    className="noti-dot"
                    onClick={() => marcarLeida(n._id)}
                    title="Marcar como leída"
                  >
                    •
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="noti-footer">
          <button
            className="btn-volver"
            onClick={() => navigate("/main")}
          >
            Volver al feed
          </button>
        </div>
      </div>
    </div>
  );
};

export default Noti;
