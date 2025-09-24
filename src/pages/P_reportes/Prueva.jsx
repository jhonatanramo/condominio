import React, { useEffect, useState } from "react";
import axios from "axios";
import { Barra } from "../../components/Navigation";
export function Prueva() {
  const [paises, setPaises] = useState([]);

  useEffect(() => {
    axios.get("https://condominio-jht3.onrender.com/api/paises/")
      .then(response => {
        setPaises(response.data);
      })
      .catch(error => {
        console.error("Error al recibir:", error);
      });
  }, []);

  return (
    <div>
      <Barra>
      <h2>Lista de Países</h2>
      <ul>
        {paises.map(pais => (
          <li key={pais.id}>
            {pais.nombre} - Código: {pais.codigo}
          </li>
        ))}
      </ul>
      </Barra>
    </div>
  );
}