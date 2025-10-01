import React, { useState, useEffect } from "react";
import { MenuItem } from "./MenuItem";
import api from "./../api"; 
import styles from "./../styles/navigation/navigation.module.css";

export function Barra({ children }) {
    const [isContraida, setIsContraida] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(null);
    const [usuario, setUsuario] = useState(null);

    const toggleBarra = () => {
        setIsContraida(!isContraida);
        if (!isContraida) {
            setMenuAbierto(null);
        }
    };

    const toggleMenu = (titulo) => {
        setMenuAbierto(menuAbierto === titulo ? null : titulo);
    };

    // 🔹 Obtener usuario de sesión en Django
    useEffect(() => {
        api.get("/datos/personales/", { withCredentials: true })
            .then(res => setUsuario(res.data.usuario))
            .catch(err => console.error("Error al obtener usuario:", err.response?.data || err.message));
    }, []);

    return (
        <div className={styles.body}>
            <div className={`${styles.barra} ${isContraida ? styles.contraida : ''}`}>
                <div className={styles.ocultar} onClick={toggleBarra}>
                    {isContraida ? "→" : "←"}
                </div>

                <div className={styles["barra-superior"]}>
                    <h1>🌊 OceanCond</h1>
                </div>

                <div className={styles["barra-media"]}>
                    <div className={styles["menu-container"]}>
                        <MenuItem icono="business-outline" titulo="Condominios" vector={["Gestionar", "Unidad","Agenda","Dashboard"]} link={["/crud_usuario", "/Unidades","/Agendas","/Dashboard"]} isOpen={menuAbierto === "Condominios"} onToggle={() => toggleMenu("Condominios")} isBarraContraida={isContraida} />
                        <MenuItem icono="document-outline" titulo="Guardia" vector={["Ingreso", "Visista"]} link={["/Ingreso", "/Visista"]} isOpen={menuAbierto === "Documentos"} onToggle={() => toggleMenu("Documentos")} isBarraContraida={isContraida} />
                        <MenuItem icono="document-outline" titulo="Usuario" vector={["reserva", "Visista","pagos"]} link={["/reserva", "/Visista","pagos"]} isOpen={menuAbierto === "ve1"} onToggle={() => toggleMenu("ve1")} isBarraContraida={isContraida} />
                    </div>
                </div>

                <div className={styles["barra-inferior"]}>
                    <div className={styles.datos}>
                        {usuario ? (
                            <>
                                <span>👤 {usuario.nombre} {usuario.apellido_1} {usuario.apellido_2}</span>
                                <br />
                                <span>📧 {usuario.ci || "Correo no disponible"}</span>
                            </>
                        ) : (
                            <span>Cargando usuario...</span>
                        )}
                    </div>
                </div>
            </div>

            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
