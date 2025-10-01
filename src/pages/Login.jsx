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
      const res = await api.post("/login/", {
        username: email,
        password,
      });
  
      // Manejar respuesta con JWT
      if (res.data.access) {
        // Guardar tokens JWT
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);
        localStorage.setItem("user_data", JSON.stringify(res.data.user));
        
        navigate("/index");
      } 
      // Manejar respuesta con mensaje simple
      else if (res.data.message === "Login exitoso") {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("username", email);
        localStorage.setItem("user_data", JSON.stringify(res.data.user));
        navigate("/index");
      }
      else {
        setError(res.data.error || "Respuesta inesperada del servidor");
      }
      
    } catch (error) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Error de conexión con el servidor");
      }
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
            <label htmlFor="email">Cedula de Identidad</label>
            <input
              id="email"
              type="text"
              placeholder="C.I."
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