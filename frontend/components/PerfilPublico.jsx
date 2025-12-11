// src/components/PerfilPublico.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./PerfilU.css";

const API_URL = "http://localhost:3000/api/v1";

const PerfilPublico = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [friendCount, setFriendCount] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        setCargando(true);
        setError("");

        const [uRes, fRes] = await Promise.all([
          fetch(`${API_URL}/users/${id}`),
          fetch(`${API_URL}/friends/user/${id}`),
        ]);

        const [uData, fData] = await Promise.all([uRes.json(), fRes.json()]);

        if (!uRes.ok) {
          throw new Error(uData.message || "No se pudo cargar el usuario.");
        }

        // contar amigos de ese usuario
        const amigosUnicos = new Set();
        fData
          .filter((f) => f.status === "accepted")
          .forEach((f) => {
            const r = f.requesterID;
            const t = f.targetID;
            const requesterId = r && typeof r === "object" ? r._id : r;
            const targetId = t && typeof t === "object" ? t._id : t;

            if (String(requesterId) === String(id)) {
              amigosUnicos.add(String(targetId));
            } else {
              amigosUnicos.add(String(requesterId));
            }
          });

        setFriendCount(amigosUnicos.size);
        setUser(uData);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al cargar el perfil.");
      } finally {
        setCargando(false);
      }
    };

    if (id) loadUser();
  }, [id]);

  if (cargando) {
    return (
      <div className="perfil-layout">
        <main className="main-content">
          <div className="container">
            <p>Cargando perfil...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="perfil-layout">
        <main className="main-content">
          <div className="container">
            <p style={{ color: "salmon" }}>{error || "Usuario no encontrado"}</p>
            <button className="btn-secondary" onClick={() => navigate("/main")}>
              Volver al feed
            </button>
          </div>
        </main>
      </div>
    );
  }

  const nombre = user.username || user.name || user.email || "Usuario Falcon";
  const carrera = user.degree || "Estudiante ULACIT";
  const email = user.email || "correo@ejemplo.com";
  const birthdate = user.birthdate || "—";
  const studentId = user._id || "—";

  return (
    <div className="perfil-layout">
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
                <i className="fas fa-home" /> Inicio
              </button>
            </li>
            <li>
              <button className="menu-link-button active">
                <i className="fas fa-user" /> Perfil público
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <div className="container">
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
                <strong>0</strong> Publicaciones
              </span>
              <span>
                <strong>{friendCount}</strong> Amigos
              </span>
            </div>

            <div className="profile-actions">
  <button
    className="btn-primary"
    onClick={() => navigate("/mensajes")}
  >
    Enviar mensaje
  </button>

  <button
    className="btn-secondary"
    onClick={() => navigate("/main")}
  >
    <i className="fas fa-arrow-left" /> Volver al feed
  </button>
</div>
          </section>

          <section className="student-info card-base">
            <h2>Información Pública</h2>
            <div className="info-details">
              <div className="info-item">
                <span className="info-label">ID Estudiantil</span>
                <span className="info-value">{studentId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Correo</span>
                <span className="info-value">{email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Fecha de Nacimiento</span>
                <span className="info-value">{birthdate}</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PerfilPublico;
