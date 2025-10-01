import React from "react";
import Mos from './../css/componentes/tarjeta.module.css';

export function UnidadCard({ unidad }) {
  return (
    <div className={Mos.unidad_card}>
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
        Ver detalles
      </button>
    </div>
  );
}
