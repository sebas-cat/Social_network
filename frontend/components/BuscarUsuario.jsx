// src/components/BuscarUsuarios.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BuscarUsuario.css";

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

export const BuscarUsuarios = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [usuarios, setUsuarios] = useState([]);
  const [amigos, setAmigos] = useState([]); // relaciones Friend
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("");
  const [error, setError] = useState("");

  // Cargar usuarios + amigos del usuario actual
  useEffect(() => {
    if (!currentUser) return;

    const load = async () => {
      try {
        const [uRes, fRes] = await Promise.all([
          fetch(`${API_URL}/users`),
          fetch(`${API_URL}/friends/user/${currentUser._id}`),
        ]);

        const [uData, fData] = await Promise.all([uRes.json(), fRes.json()]);

        setUsuarios(
          uData.filter((u) => String(u._id) !== String(currentUser._id))
        );

        setAmigos(Array.isArray(fData) ? fData : []);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la lista de usuarios.");
      }
    };

    load();
  }, [currentUser]);

  // Ver si u._id ya es amigo del usuario actual
  const esAmigo = (userId) => {
    if (!Array.isArray(amigos) || !currentUser) return false;

    const myId = String(currentUser._id);

    return amigos.some((rel) => {
      const req = rel.requesterID?._id || rel.requesterID;
      const tgt = rel.targetID?._id || rel.targetID;

      const otherId = String(req) === myId ? String(tgt) : String(req);
      return otherId === String(userId);
    });
  };

  // Enviar solicitud de amistad (de momento status = accepted)
  const handleAgregarAmigo = async (target) => {
    if (!currentUser) return;

    try {
      setError("");
      setEstado("");

      const payload = {
        requesterID: currentUser._id,
        targetID: target._id,
        status: "accepted",
      };

      const res = await fetch(`${API_URL}/friends`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Error al enviar solicitud.");
      }

      setAmigos((prev) => [...prev, data]);
      setEstado(
        `Ahora eres amigo de ${target.username || target.name || target.email}.`
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al enviar solicitud.");
    }
  };

  const filtrados = usuarios.filter((u) => {
    if (!busqueda.trim()) return true;
    const q = busqueda.toLowerCase();
    return (
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="search-layout">
      <div className="search-panel">
        <header className="search-header">
          <h2 className="search-title">Buscar</h2>
        </header>

        <div className="search-bar-wrapper">
          <input
            className="search-input"
            type="text"
            placeholder="Search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {error && <p className="search-error">{error}</p>}
        {estado && <p className="search-status">{estado}</p>}

        <div className="search-section-label">Reciente</div>

        <ul className="search-list">
          {filtrados.length === 0 && (
            <li className="search-empty">No se encontraron usuarios.</li>
          )}

          {filtrados.map((u) => (
            <li key={u._id} className="search-item">
              <div className="search-user">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="avatar"
                  className="search-avatar"
                />
                <div className="search-user-text">
                  <span className="search-username">
                    {u.username || u.name || u.email}
                  </span>
                  <span className="search-name">{u.name || u.email}</span>
                </div>
              </div>

              <div className="search-actions">
                <button
                  className="search-btn secondary"
                  onClick={() => navigate(`/perfil/${u._id}`)}
                >
                  Ver perfil
                </button>

                <button
                  className={`search-btn primary ${
                    esAmigo(u._id) ? "disabled" : ""
                  }`}
                  disabled={esAmigo(u._id)}
                  onClick={() => handleAgregarAmigo(u)}
                >
                  {esAmigo(u._id) ? "Amigos" : "Agregar"}
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="search-footer">
          <button
            className="search-btn back"
            onClick={() => navigate("/main")}
          >
            Volver al feed
          </button>
        </div>
      </div>
    </div>
  );
};
