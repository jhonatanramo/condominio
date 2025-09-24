import React from "react";
import { Link } from "react-router-dom";
import styles from "./../styles/navigation/navigation.module.css"

export function MenuItem({ link, icono, titulo, vector, isOpen, onToggle, isBarraContraida }) {
    return (
        <div className={styles.menu}>
            <div className={styles.titulo} onClick={onToggle}>
                <div className={styles["icono-container"]}>
                    <ion-icon name={icono}></ion-icon>
                    <span className={styles.texto}>{titulo}</span>
                </div>
                {!isBarraContraida && (
                    <ion-icon 
                        name="chevron-forward-outline" 
                        className={`${styles.arrow} ${isOpen ? styles.open : ''}`}
                    ></ion-icon>
                )}
            </div>
            
            {!isBarraContraida && (
                <div className={`${styles.submenu} ${isOpen ? styles.open : ''}`}>
                    <ul>
                        {vector.map((elemento, index) => (
                            <li key={index}>
                                <Link to={link[index]} onClick={(e) => e.stopPropagation()}>
                                    {elemento}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}