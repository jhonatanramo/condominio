import { useState } from "react";
import api from "./../api";

export function Crear_Unidad() {
  const [formData, setFormData] = useState({
    nro_modulo: "",
    nro_piso: "",
    nro_habitacion: "",
    valor_mensual: "",
    capacidad: "",
    estado: "disponible"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/crear-unidad/", formData);

      console.log("Respuesta:", response.data);
      alert("✅ Unidad creada exitosamente");

      setFormData({
        nro_modulo: "",
        nro_piso: "",
        nro_habitacion: "",
        valor_mensual: "",
        capacidad: "",
        estado: "disponible"
      });
    } catch (error) {
      console.error("❌ Error:", error.response?.data || error.message);
      alert("❌ Error: " + (error.response?.data?.error || "No se pudo crear la unidad"));
    }
  };

  return (
    <div className="unidad">
      <center>
        <form onSubmit={handleSubmit}>
          <label>Nro módulo</label>
          <input
            type="number"
            name="nro_modulo"
            value={formData.nro_modulo}
            onChange={handleChange}
          />
          <br />

          <label>Nro piso</label>
          <input
            type="number"
            name="nro_piso"
            value={formData.nro_piso}
            onChange={handleChange}
          />
          <br />

          <label>Nro habitación</label>
          <input
            type="number"
            name="nro_habitacion"
            value={formData.nro_habitacion}
            onChange={handleChange}
          />
          <br />

          <label>$us mensual</label>
          <input
            type="number"
            step="0.01"
            name="valor_mensual"
            value={formData.valor_mensual}
            onChange={handleChange}
          />
          <br />

          <label>Capacidad</label>
          <input
            type="number"
            name="capacidad"
            value={formData.capacidad}
            onChange={handleChange}
          />
          <br />

          <label>Estado</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="disponible">Disponible</option>
            <option value="ocupado">Ocupado</option>
          </select>
          <br />

          <button type="submit">Crear</button>
        </form>
      </center>
    </div>
  );
}
