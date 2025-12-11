import React, { useState } from "react";
import "./SignUP.css";

const API_URL = "http://localhost:3000/api/v1";

const getCurrentUserId = () => {
  try {
    const raw = localStorage.getItem("usuarioFalcon");
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user._id || null;
  } catch {
    return null;
  }
};

const CrearPost = () => {
  const [type, setType] = useState("text");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [errors, setErrors] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

  const resetFileState = () => {
    setFile(null);
    setFilePreview("");
  };

  const validate = () => {
    const newErrors = [];
    const userId = getCurrentUserId();

    if (!userId) {
      newErrors.push("No se pudo identificar al usuario. Inicia sesión de nuevo para publicar.");
    }

    if (type === "text" && !description.trim()) {
      newErrors.push("El contenido escrito es obligatorio para publicaciones de solo texto.");
    }

    if ((type === "image" || type === "video") && !filePreview) {
      newErrors.push("Debes seleccionar un archivo para imágenes o videos.");
    }

    if (description.length > 500) {
      newErrors.push("La descripción no puede superar los 500 caracteres.");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    const newErrors = [];

    setSuccessMsg("");
    resetFileState();

    if (!selected) return;

    if (type === "image" && !selected.type.startsWith("image/")) {
      newErrors.push("Debes seleccionar un archivo de imagen.");
    }

    if (type === "video" && !selected.type.startsWith("video/")) {
      newErrors.push("Debes seleccionar un archivo de video.");
    }

    const maxImageSizeMB = 5;
    const maxVideoSizeMB = 30;

    if (type === "image" && selected.size > maxImageSizeMB * 1024 * 1024) {
      newErrors.push(`La imagen no puede superar los ${maxImageSizeMB} MB.`);
    }

    if (type === "video" && selected.size > maxVideoSizeMB * 1024 * 1024) {
      newErrors.push(`El video no puede superar los ${maxVideoSizeMB} MB.`);
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFile(selected);
      setFilePreview(reader.result);
    };
    reader.readAsDataURL(selected);

    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrors([]);

    if (!validate()) return;

    const userId = getCurrentUserId();
    if (!userId) return;

    const payload = {
      userID: userId,
      content: filePreview ? [filePreview] : [],
      description: description.trim() || undefined,
    };

    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("POST /posts status:", res.status);

      let data;
      try {
        data = await res.json();
      } catch {
        const txt = await res.text();
        data = { raw: txt };
      }

      if (!res.ok) {
        throw new Error(
          data.message || data.error || data.raw || "Error al crear la publicación."
        );
      }

      setDescription("");
      resetFileState();
      setType("text");
      setErrors([]);
      setSuccessMsg("Tu publicación se creó correctamente.");
    } catch (err) {
      console.error(err);
      setErrors([err.message]);
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

        <h1 className="signup-title">Crear publicación</h1>
        <p className="signup-subtitle">
          Comparte texto, imágenes o videos con tu comunidad Falcon Connect.
        </p>

        {errors.length > 0 && (
          <div className="form-errors" style={{ color: "#b00020", fontSize: "13px" }}>
            {errors.map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </div>
        )}

        {successMsg && (
          <p style={{ color: "#1b8c3b", fontSize: "13px", marginTop: "4px" }}>
            {successMsg}
          </p>
        )}

        <form className="signup-form" onSubmit={handleSubmit}>
          <label>Tipo de publicación</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              resetFileState();
              setErrors([]);
              setSuccessMsg("");
            }}
          >
            <option value="text">Solo texto</option>
            <option value="image">Texto + Imagen</option>
            <option value="video">Texto + Video</option>
          </select>

          <label style={{ marginTop: "6px" }}>Texto / descripción</label>
          <textarea
            style={{
              width: "100%",
              minHeight: "80px",
              padding: "10px 12px",
              borderRadius: "16px",
              border: "1px solid #ddd",
              fontSize: "14px",
              outline: "none",
              resize: "vertical",
            }}
            placeholder="¿Qué estás pensando?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <small style={{ alignSelf: "flex-end", color: "#777", fontSize: "11px" }}>
            {description.length}/500
          </small>

          {(type === "image" || type === "video") && (
            <>
              <label style={{ marginTop: "6px" }}>
                {type === "image" ? "Selecciona una imagen" : "Selecciona un video"}
              </label>

              <input
                type="file"
                accept={type === "image" ? "image/*" : "video/*"}
                onChange={handleFileChange}
              />

              {filePreview && (
                <div style={{ marginTop: "8px", display: "flex", justifyContent: "center" }}>
                  {type === "image" ? (
                    <img
                      src={filePreview}
                      alt="preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "220px",
                        borderRadius: "16px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <video
                      controls
                      style={{
                        maxWidth: "100%",
                        maxHeight: "260px",
                        borderRadius: "16px",
                      }}
                    >
                      <source src={filePreview} />
                    </video>
                  )}
                </div>
              )}
            </>
          )}

          <button type="submit" className="signup-button" style={{ marginTop: "14px" }}>
            Publicar
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearPost;
