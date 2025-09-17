import React, { useState } from "react";
import { MenuItem } from "./MenuItem";
import styles from "./../styles/navigation/navigation.module.css";

export function Barra({ children }) {
  // estado para mostrar/ocultar
  const [visible, setVisible] = useState(true);

  return (
    <div className={styles.body}>
      {/* Botón que alterna el estado */}
      <div className={styles.ocultar} onClick={() => setVisible(!visible)}>
        {visible ? "ocultar" : "mostrar"}
      </div>

      {/* Barra lateral con clase dinámica */}
      <div
        className={visible ? styles.barra : styles.oculatar}
      >
        <h1>holas</h1>
        <div className="new">
          <MenuItem
            icono="arrow-redo-circle-outline"
            titulo="condominios"
            vector={["gestionar ", "about"]}
            link={["/home", "/about"]}
          />
          <MenuItem
            icono="arrow-redo-circle-outline"
            titulo="Ventas"
            vector={["home", "about"]}
            link={["/home", "/about"]}
          />
        </div>
        <div className={styles.datos}>
          <span>Jhonatan</span>
          <br />
          <span>JhonatanLeonel@gmail.com</span>
        </div>
      </div>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
