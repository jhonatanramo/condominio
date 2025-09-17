import React from "react";
import { Link } from "react-router-dom";
import styles from "./../styles/navigation/navigation.module.css"


export function MenuItem({ link, icono, titulo, vector }) {
  return (
    <div className={styles.menu}>
      <div className={styles.titulo}>
        <ion-icon name={icono}></ion-icon>
        <span>{titulo}</span>
      </div>
      <ul className="sub-menu">
        {vector.map((elemento, index) => (
          <li key={index}>
            <Link to={link[index]}>
              {elemento}
            </Link>
          </li>
        ))}
      </ul>
  
    </div>
  );
}