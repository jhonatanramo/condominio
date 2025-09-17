import React from "react";
import css from"./css/login/login.module.css";

export function Login() {
  return (
    <div className={css.contenedor}>
      <div className={css.new}>
        <h1>Login</h1>
        <form>
          <fieldset>
            <legend>Correo Electrónico</legend>
            <input type="email" placeholder="Correo Electrónico" />
          </fieldset>
          <fieldset>
            <legend>Contraseña</legend>
            <input type="password" placeholder="Contraseña" />
          </fieldset>
          <button type="submit">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
}
