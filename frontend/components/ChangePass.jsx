// src/components/ChangePass.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = "http://localhost:3000/api/v1";

export const ChangePass = () => {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [estado, setEstado] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("recoveryUserID");
    if (!id) {
      setError(
        "No hay una solicitud de recuperación activa. Vuelve a 'Olvidé mi contraseña'."
      );
    } else {
      setUserId(id);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEstado("");

    if (!userId) return;

    if (!password || !password2) {
      setError("Debes completar ambos campos.");
      return;
    }

    if (password !== password2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: userId, newPassword: password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Error al cambiar la contraseña.");
      }

      setEstado("Contraseña actualizada. Ahora puedes iniciar sesión.");
      localStorage.removeItem("recoveryUserID");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al conectar con el servidor.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Nuevo contraseña</h2>
        <p style={{ fontSize: "14px", marginBottom: "16px" }}>
          Elige una nueva contraseña para tu cuenta.
        </p>

        {error && (
          <p className="form-error" style={{ marginBottom: "10px" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nueva contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Repite la contraseña</label>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </div>

          {estado && (
            <p
              style={{
                fontSize: "13px",
                color: "#0f0",
                marginTop: "8px",
                marginBottom: "8px",
              }}
            >
              {estado}
            </p>
          )}

          <button type="submit" className="btn-login">
            Guardar contraseña
          </button>
        </form>

        <button
          className="btn-secondary"
          style={{ marginTop: "16px" }}
          onClick={() => navigate("/login")}
        >
          Volver al login
        </button>
      </div>
    </div>
  );
};
