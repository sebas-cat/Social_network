// src/components/ForgotPass.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = "http://localhost:3000/api/v1";

export const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEstado("");

    try {
      const res = await fetch(`${API_URL}/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Error en el servidor.");
      }

      // Esperamos que el backend pueda devolver userID si el correo existe
      if (data.userID) {
        // Guardamos el ID para el siguiente paso
        localStorage.setItem("recoveryUserID", data.userID);
        navigate("/change-password");
        return;
      }

      // Si no viene userID, solo mostramos mensaje genérico
      setEstado(
        data.message ||
          "Si el correo existe, se enviarán instrucciones para recuperar la contraseña."
      );
      setEmail("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al conectar con el servidor.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Recuperar contraseña</h2>
        <p style={{ fontSize: "14px", marginBottom: "16px" }}>
          Ingresa tu correo institucional. Si está registrado, podrás cambiar tu
          contraseña.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="tu_usuario@ulacit.ed.cr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}
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
            Continuar
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
