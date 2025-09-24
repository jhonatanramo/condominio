import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import css from "./css/login/login.module.css";

export function Login() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const res = await api.post("/api/token/", {
        username: email,
        password,
      });

      // Guardar tokens en localStorage
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      navigate("/index"); // Redirige al Index
    } catch {
      setError("Usuario o contraseña incorrecta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={css.contenedor}>
      <div className={css.loginCard}>
        <div className={css.loginHeader}>
          <div className={css.logo}>🌊</div>
          <h1>OceanCond</h1>
          <p>Sistema de Gestión de Condominios</p>
        </div>
        
        {error && <div className={css.errorMessage}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={css.loginForm}>
          <div className={css.inputGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="usuario@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <ion-icon name="mail-outline" className={css.inputIcon}></ion-icon>
          </div>
          
          <div className={css.inputGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <ion-icon name="lock-closed-outline" className={css.inputIcon}></ion-icon>
          </div>
          
          <button 
            type="submit" 
            className={css.loginButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ion-icon name="refresh-outline" className={css.loadingIcon}></ion-icon>
                Iniciando sesión...
              </>
            ) : (
              <>
                <ion-icon name="log-in-outline"></ion-icon>
                Iniciar Sesión
              </>
            )}
          </button>
        </form>
        
        <div className={css.loginFooter}>
          <p>¿Problemas para acceder? <a href="/help">Contactar soporte</a></p>
        </div>
      </div>
    </div>
  );
}