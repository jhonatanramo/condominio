import { useState, useEffect, useCallback } from "react";
import { Barra } from "../../components/Navigation";
import api from "./../../api"; 
import Mos from './../css/componentes/tarjeta.module.css';

export function Unidad() {
    const [loading, setLoading] = useState(false);
    const [unidades, setUnidades] = useState([]);
    const [moduloSeleccionado, setModuloSeleccionado] = useState(null);
    const [unidadesModulo, setUnidadesModulo] = useState([]);
    const [showPopover, setShowPopover] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const resp = await api.get("data/unidades/");
            setUnidades(Array.isArray(resp.data) ? resp.data : []);
        } catch (error) {
            console.error("Error al obtener las unidades:", error);
            alert("Error al obtener las unidades");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Agrupar unidades por módulo
    const unidadesPorModulo = unidades.reduce((acc, unidad) => {
        const modulo = unidad.nro_modulo || "Sin módulo";
        if (!acc[modulo]) acc[modulo] = [];
        acc[modulo].push(unidad);
        return acc;
    }, {});

    const abrirPopover = (modulo) => {
        setModuloSeleccionado(modulo);
        setUnidadesModulo(unidadesPorModulo[modulo] || []);
        setShowPopover(true);
    };

    const cerrarPopover = () => {
        setShowPopover(false);
        setModuloSeleccionado(null);
        setUnidadesModulo([]);
    };

    // Calcular estadísticas por módulo
    const getEstadisticasModulo = (unidades) => {
        const total = unidades.length;
        const disponibles = unidades.filter(u => u.estado === "disponible").length;
        const ocupadas = total - disponibles;
        const porcentajeDisponibles = total > 0 ? (disponibles / total) * 100 : 0;
        
        return { total, disponibles, ocupadas, porcentajeDisponibles };
    };

    return (
        <Barra>
            <div className={Mos.contenedor_modulo}>
                <h1 className={Mos.titulo}>Gestión de Módulos</h1>

                {loading ? (
                    <p className={Mos.loading}>Cargando módulos...</p>
                ) : (
                    <div className={Mos.contenedor}>
                        {Object.entries(unidadesPorModulo).map(([modulo, listaUnidades]) => {
                            const stats = getEstadisticasModulo(listaUnidades);
                            
                            return (
                                <div key={modulo} className={Mos.modulo}>
                                    <div className={Mos.modulo_header}>
                                        <h2>Módulo {modulo}</h2>
                                        <span className={Mos.badge}>{stats.total} unidades</span>
                                    </div>
                                    
                                    <div className={Mos.stats}>
                                        <div className={Mos.stat}>
                                            <span className={`${Mos.stat_circle} ${Mos.disponible}`}></span>
                                            <span>{stats.disponibles} disponibles</span>
                                        </div>
                                        <div className={Mos.stat}>
                                            <span className={`${Mos.stat_circle} ${Mos.ocupado}`}></span>
                                            <span>{stats.ocupadas} ocupadas</span>
                                        </div>
                                    </div>

                                    <div className={Mos.progress_container}>
                                        <progress 
                                            value={stats.porcentajeDisponibles} 
                                            max="100"
                                        >
                                            {stats.porcentajeDisponibles}%
                                        </progress>
                                        <span className={Mos.progress_text}>
                                            {stats.porcentajeDisponibles.toFixed(0)}% disponibles
                                        </span>
                                    </div>

                                    <button
                                        className={Mos.boton}
                                        onClick={() => abrirPopover(modulo)}
                                    >
                                    Ver Unidades
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Popover/Modal para mostrar unidades */}
                {showPopover && (
                    <div className={Mos.popover_overlay} onClick={cerrarPopover}>
                        <div className={Mos.popover_content} onClick={(e) => e.stopPropagation()}>
                            <div className={Mos.popover_header}>
                                <h2>Unidades del Módulo {moduloSeleccionado}</h2>
                                <button className={Mos.close_button} onClick={cerrarPopover}>
                                    ✕
                                </button>
                            </div>
                            
                            <div className={Mos.popover_body}>
                                <div className={Mos.unidades_grid}>
                                    {unidadesModulo.map((unidad) => (
                                        <div key={unidad.id} className={Mos.unidad_card}>
                                            <div className={Mos.unidad_header}>
                                                <h3>MOD-{unidad.nro_modulo}-{unidad.nro_piso}-{unidad.nro_habitacion}</h3>
                                                <div className={`${Mos.status_badge} ${
                                                    unidad.estado === "disponible" ? Mos.status_available : Mos.status_occupied
                                                }`}>
                                                    {unidad.estado === "disponible" ? "Disponible" : "Ocupado"}
                                                </div>
                                            </div>
                                            
                                            <div className={Mos.unidad_info}>
                                                <div className={Mos.price}>$us {unidad.valor_mensual || "0.00"}</div>
                                                <div className={Mos.details}>
                                                    <p>📍 Piso {unidad.nro_piso || "N/A"}</p>
                                                    <p>👤 {unidad.propietario 
                                                        ? `${unidad.propietario.nombre} ${unidad.propietario.apellido_paterno || ''}`
                                                        : "Sin propietario"}
                                                    </p>
                                                    <p>📄 {unidad.nro_contrato || "Sin contrato"}</p>
                                                </div>
                                            </div>
                                            <button className={Mos.detail_button}>
                                                //aqui
                                            </button>
                                            
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Barra>
    );
}