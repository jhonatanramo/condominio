import React from "react";
import { useNavigate } from "react-router-dom";

export default function Pantalla404({ mensaje = "Página no encontrada", mostrarBusqueda = true }) {
  const navigate = useNavigate();

  const volverInicio = () => {
    navigate("/login");
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
      background: "var(--color-bg-main)",
      padding: "var(--spacing-md)",
      boxSizing: "border-box"
    }}>
      <div style={{
        background: "var(--color-bg-barra)",
        padding: "var(--spacing-lg)",
        borderRadius: "var(--radius-large)",
        boxShadow: "var(--shadow-light)",
        textAlign: "center",
        maxWidth: "600px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--spacing-md)"
      }}>
        <h1 style={{ fontSize: "6vw", fontWeight: "bold", color: "var(--color-accent-light)", margin: 0 }}>404</h1>
        <h2 style={{ fontSize: "4vw", margin: "var(--spacing-sm) 0" }}>{mensaje}</h2>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "2vw", textAlign: "center" }}>
          La página que buscas no existe o fue movida.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)", width: "100%" }}>
          <button onClick={volverInicio} style={{
            background: "var(--color-accent)",
            color: "var(--color-text-main)",
            padding: "var(--spacing-sm)",
            borderRadius: "var(--radius-medium)",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            width: "100%",
            boxShadow: "var(--shadow-btn)"
          }}>
            Ir al inicio
          </button>

          <button onClick={() => window.history.back()} style={{
            background: "var(--color-btn-bg)",
            color: "var(--color-text-main)",
            padding: "var(--spacing-sm)",
            borderRadius: "var(--radius-medium)",
            border: "none",
            cursor: "pointer",
            width: "100%",
            boxShadow: "var(--shadow-btn)"
          }}>
            Volver
          </button>

          {mostrarBusqueda && (
            <div style={{ display: "flex", flexDirection: "row", gap: "var(--spacing-sm)", width: "100%", flexWrap: "wrap" }}>
              
             
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
