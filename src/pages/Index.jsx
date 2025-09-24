import React, { useEffect, useState } from "react";
import axios from "axios";
import { Barra } from './../components/Navigation';

export function Index() {
  const [paises, setPaises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔍 Probando conectividad con la API...");
        
        // Luego intentar con la API de países
        const response = await axios.get("https://condominio-jht3.onrender.com/api/paises/", {
          timeout: 15000 // Aumentar timeout
        });

        console.log("✅ Datos recibidos:", response.data);
        setPaises(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
        
      } catch (error) {
        console.error("❌ Error detallado:", error);
        
        if (error.code === 'ECONNABORTED') {
          setError("La API no responde. Puede estar caída o sobrecargada.");
        } else if (error.response) {
          setError(`Error ${error.response.status}: ${error.response.statusText}`);
        } else if (error.request) {
          setError("No se pudo conectar al servidor. Verifica tu conexión a internet.");
        } else {
          setError(`Error: ${error.message}`);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para reintentar
  const retryConnection = () => {
    setError(null);
    setLoading(true);
    setPaises([]);
  };

  if (loading) return (
    <div>
      <Barra>
        <div>Cargando países...</div>
        <div style={{background: '#f0f0f0', padding: '10px', marginTop: '10px'}}>
          <p><strong>Conectando a:</strong> condominio-jht3.onrender.com</p>
          <p><strong>Timeout:</strong> 15 segundos</p>
        </div>
      </Barra>
    </div>
  );
  
  if (error) return (
    <div>
      <Barra>
        <div style={{color: 'red', padding: '20px'}}>
          <h3>Error de conexión</h3>
          <p>{error}</p>
          <div style={{marginTop: '20px'}}>
            <button onClick={retryConnection} style={{padding: '10px 20px'}}>
              Reintentar conexión
            </button>
          </div>
          <div style={{marginTop: '20px', background: '#f5f5f5', padding: '10px'}}>
            <h4>Posibles soluciones:</h4>
            <ul>
              <li>Verifica que la URL sea correcta</li>
              <li>Comprueba tu conexión a internet</li>
              <li>Intenta más tarde</li>
            </ul>
          </div>
        </div>
      </Barra>
    </div>
  );

  return (
    <div>
      <Barra>
        <h2>Lista de Países ({paises.length})</h2>
        {paises.length === 0 ? (
          <p>No hay países disponibles</p>
        ) : (
          <ul>
            {paises.map(pais => (
              <li key={pais.id}>
                <strong>{pais.nombre}</strong> - Código: {pais.codigo}
              </li>
            ))}
          </ul>
        )}
      </Barra>
    </div>
  );
}