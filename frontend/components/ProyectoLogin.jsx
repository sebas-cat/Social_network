// src/components/ProyectoLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export const ProyectoLogin = () => {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!correo.trim() || !password.trim()) {
      setError("Por favor ingrese correo y contraseña.");
      return;
    }

    const correoNormalizado = correo.trim().toLowerCase();

    try {
      const response = await fetch("http://localhost:3000/api/v1/users");
      if (!response.ok) {
        setError("No se pudieron obtener los usuarios.");
        return;
      }

      const users = await response.json();
      console.log("Usuarios desde backend:", users);

      const user = users.find((u) => {
        if (!u.email) return false;
        return u.email.toLowerCase() === correoNormalizado;
      });

      if (!user) {
        setError("Correo no registrado");
        return;
      }

      if (user.password !== password) {
        setError("Contraseña incorrecta");
        return;
      }

      localStorage.setItem("usuarioFalcon", JSON.stringify(user));
      navigate("/main");
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    }
  };

  const handleGoToSignUp = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  return (
    <div className="container">
      {/* LOGO ULACIT A LA IZQUIERDA */}
      <a
        className="img-wrapper"
        href="https://www.ulacit.ac.cr"
        target="_blank"
        rel="noreferrer"
      >
        <img
          className="img"
          src="https://lh3.googleusercontent.com/pw/AP1GczNRaOQFfwJXclm3np7wh60V_Qlo_O9b1pd5yGnJlOsabW7yPqp5UePF71_Bzv6OxHd3eUNEV_T4Ug7Y07lYupZDHooqWoL903Brn5L5Mt5jfbI15Do=w2400"
          alt="ULACIT"
        />
      </a>

      {/* TARJETA DE LOGIN A LA DERECHA */}
      <div className="div_login">
        <h1 className="login-title">Bienvenido a Falcon Connect</h1>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <a
            className="login-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/forgot-password");
            }}
          >
            Olvidé mi contraseña
          </a>

          <a
            className="login-link"
            href="#"
            onClick={handleGoToSignUp}
          >
            Crear cuenta
          </a>

          <button type="submit" className="button">
            LOGIN
          </button>

          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};
