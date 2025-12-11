// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProyectoLogin } from "./components/ProyectoLogin.jsx";
import { MainPage } from "./components/mainpage.jsx";
import SignUpPage from "./components/SignUpPage.jsx";
import CrearPost from "./components/CrearPost.jsx";
import PerfilU from "./components/PerfilU.jsx";   // 👈 IMPORTA EL PERFIL
import Mensajes from "./components/Mensajes.jsx";
import Noti from "./components/Noti.jsx";
import {ForgotPass} from "./components/ForgotPass.jsx"
import { ChangePass } from "./components/ChangePass.jsx";
import { BuscarUsuarios } from "./components/BuscarUsuario.jsx";
import PerfilPublico from "./components/PerfilPublico.jsx";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProyectoLogin />} />
        <Route path="/login" element={<ProyectoLogin />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/crear-post" element={<CrearPost />} />
        <Route path="/perfil" element={<PerfilU />} /> {/* 👈 NUEVA RUTA */}
        <Route path="/mensajes" element={<Mensajes />} />
        <Route path="/notificaciones" element={<Noti />} />   {/* 👈 NUEVA */}\
        <Route path="/forgot-pass" element={<ForgotPass />} />
        <Route path="/change-password" element={<ChangePass />} />
        <Route path="/buscar" element={<BuscarUsuarios />} />
          <Route path="/perfil/:id" element={<PerfilPublico />} />

      </Routes>
    </Router>
  );
};

export default App;
