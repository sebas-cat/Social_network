import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import "./SignUP.css"; // 👈 mismo nivel que el componente

const MONGO_URL = "http://localhost:3000/api/v1";

const CAREERS = [
  { code: "30067", name: "Ingeniería Informática" },
  { code: "40051", name: "Biomédica" },
  { code: "30076", name: "Derecho" },
  { code: "30029", name: "Administración de Negocios" },
];

const SignUpPage = () => {
  const [formValues, setFormValues] = useState({
    name: "",
    username: "",
    email: "",
    career: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value ?? "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      username,
      email,
      career,
      password,
      confirmPassword,
    } = formValues;

    if (!name || !username || !email || !career || !password || !confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos.",
      });
      return;
    }

    if (!email.includes("@")) {
      Swal.fire({
        icon: "error",
        title: "Correo inválido",
        text: "El correo debe contener '@'.",
      });
      return;
    }

    if (password.length < 8) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña muy corta",
        text: "La contraseña debe tener al menos 8 caracteres.",
      });
      return;
    }

    const regex = /^[A-Za-z0-9]+$/;
    if (!regex.test(password)) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña inválida",
        text: "La contraseña solo puede contener letras y números.",
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Contraseñas diferentes",
        text: "La contraseña y la confirmación no coinciden.",
      });
      return;
    }

    let role = "User";

    if (email.endsWith("@ulacit.ed.cr")) {
      role = "Student";
    } else if (email.endsWith("@ulacit.ac.cr")) {
      role = "Admin";
    } else {
      Swal.fire({
        icon: "error",
        title: "Correo no permitido",
        text: "Solo se aceptan correos institucionales ULACIT.",
      });
      return;
    }

    try {
      const payload = {
        name,
        username,
        email,
        career,
        password,
        role,
      };

      await axios.post(`${MONGO_URL}/users`, payload);

      Swal.fire({
        icon: "success",
        title: "Cuenta creada",
        text: `Tu cuenta fue creada como ${role}.`,
      });

      setFormValues({
        name: "",
        username: "",
        email: "",
        career: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error creando usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text:
          error.response?.data?.message ||
          "Ocurrió un error al intentar crear la cuenta.",
      });
    }
  };

  return (
    <div className="signup-body">
      <div className="signup-card">
        <img
          className="signup-logo"
          src="https://lh3.googleusercontent.com/pw/AP1GczNRaOQFfwJXclm3np7wh60V_Qlo_O9b1pd5yGnJlOsabW7yPqp5UePF71_Bzv6OxHd3eUNEV_T4Ug7Y07lYupZDHooqWoL903Brn5L5Mt5jfbI15Do=w2400"
          alt="ULACIT"
        />

        <h1 className="signup-title">Crear Cuenta</h1>
        <p className="signup-subtitle">
          Únete a Falcon Connect y empieza a compartir con tu comunidad
        </p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nombre completo"
            value={formValues.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="username"
            placeholder="Nombre de usuario"
            value={formValues.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formValues.email}
            onChange={handleChange}
            required
          />

          <select
            name="career"
            value={formValues.career}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona tu carrera</option>
            {CAREERS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>

          <input
            type="password"
            name="password"
            placeholder="Contraseña (mínimo 8 caracteres)"
            minLength="8"
            pattern="[A-Za-z0-9]+"
            value={formValues.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            minLength="8"
            pattern="[A-Za-z0-9]+"
            value={formValues.confirmPassword}
            onChange={handleChange}
            required
          />

          <button className="signup-button" type="submit">
            Registrarse
          </button>
        </form>

        <p className="signup-small-text">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="signup-link">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
