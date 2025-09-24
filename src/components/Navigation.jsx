import React, { useState } from "react";
import { MenuItem } from "./MenuItem";
import styles from "./../styles/navigation/navigation.module.css";

export function Barra({ children }) {
    const [isContraida, setIsContraida] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(null);

    const toggleBarra = () => {
        setIsContraida(!isContraida);
        // Cerrar todos los menús al contraer la barra
        if (!isContraida) {
            setMenuAbierto(null);
        }
    };

    const toggleMenu = (titulo) => {
        if (menuAbierto === titulo) {
            setMenuAbierto(null);
        } else {
            setMenuAbierto(titulo);
        }
    };

    return (
        <div className={styles.body}>
            {/* Barra lateral que se contrae/expande */}
            <div className={`${styles.barra} ${isContraida ? styles.contraida : ''}`}>
                {/* Botón de contraer/expandir */}
                <div 
                    className={styles.ocultar} 
                    onClick={toggleBarra}
                    title={isContraida ? "Expandir barra" : "Contraer barra"}
                >
                    {isContraida ? "→" : "←"}
                </div>

                {/* SECCIÓN SUPERIOR */}
                <div className={styles["barra-superior"]}>
                    <h1>🌊 OceanCond</h1>
                </div>

                {/* SECCIÓN MEDIA */}
                <div className={styles["barra-media"]}>
                    <div className={styles["menu-container"]}>
                        <MenuItem
                            icono="business-outline"
                            titulo="Condominios"
                            vector={["Gestionar", "Información"]}
                            link={["/gestionar", "/informacion"]}
                            isOpen={menuAbierto === "Condominios"}
                            onToggle={() => toggleMenu("Condominios")}
                            isBarraContraida={isContraida}
                        />
                        <MenuItem
                            icono="cash-outline"
                            titulo="Ventas"
                            vector={["Dashboard", "Reportes"]}
                            link={["/ventas", "/reportes"]}
                            isOpen={menuAbierto === "Ventas"}
                            onToggle={() => toggleMenu("Ventas")}
                            isBarraContraida={isContraida}
                        />
                        <MenuItem
                            icono="people-outline"
                            titulo="Residentes"
                            vector={["Lista", "Nuevo"]}
                            link={["/residentes", "/nuevo-residente"]}
                            isOpen={menuAbierto === "Residentes"}
                            onToggle={() => toggleMenu("Residentes")}
                            isBarraContraida={isContraida}
                        />
                        <MenuItem
                            icono="calendar-outline"
                            titulo="Reservas"
                            vector={["Calendario", "Solicitudes"]}
                            link={["/calendario", "/solicitudes"]}
                            isOpen={menuAbierto === "Reservas"}
                            onToggle={() => toggleMenu("Reservas")}
                            isBarraContraida={isContraida}
                        />
                    </div>
                </div>

                {/* SECCIÓN INFERIOR */}
                <div className={styles["barra-inferior"]}>
                    <div className={styles.datos}>
                        <span>👤 Jhonatan</span>
                        <br />
                        <span>📧 JhonatanLeonel@gmail.com</span>
                    </div>
                </div>
            </div>

            {/* Contenido principal que se ajusta automáticamente */}
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}