import { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const CamaraPlacas = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [analizando, setAnalizando] = useState(false);
  const [resultado, setResultado] = useState(null);

  // 1. Inicializar la cámara
  const iniciarCamara = async () => {
    try {
      // Verificar compatibilidad del navegador :cite[4]:cite[7]
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Tu navegador no soporta el acceso a la cámara');
        return;
      }

      // Solicitar permisos y configurar :cite[4]
      const constraints = {
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          facingMode: 'environment' // Para la cámara trasera en móviles
        } 
      };
      
      const streamObtenido = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(streamObtenido);
      
      if (videoRef.current) {
        videoRef.current.srcObject = streamObtenido;
      }
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      alert('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  };

  // 2. Capturar y enviar frame para análisis
  const capturarYAnalizar = async () => {
    if (!videoRef.current) return;
    
    setAnalizando(true);
    setResultado(null);

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const contexto = canvas.getContext('2d');
    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // Convertir a Blob para enviar
      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('imagen', blob, 'placa.jpg');

        // Enviar a tu endpoint de Django
        const respuesta = await axios.post('http://localhost:8000/api/analizar-placa/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        setResultado(respuesta.data);
        setAnalizando(false);
        
        // 3. Detener la cámara después del análisis exitoso
        if (respuesta.data.exito) {
          detenerCamara();
        }
      }, 'image/jpeg', 0.8);
      
    } catch (error) {
      console.error('Error en el análisis:', error);
      setAnalizando(false);
      alert('Error al analizar la placa');
    }
  };

  // 3. Detener la cámara
  const detenerCamara = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Iniciar cámara automáticamente al cargar el componente
  useEffect(() => {
    iniciarCamara();
    
    // Limpieza al desmontar el componente
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Lector de Placas Vehiculares</h2>
      
      {/* Video de la cámara en vivo */}
      <div style={{ margin: '20px 0' }}>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline
          style={{ 
            width: '100%', 
            maxWidth: '600px', 
            border: '2px solid #333',
            borderRadius: '8px'
          }}
        />
      </div>

      {/* Controles */}
      <div style={{ margin: '20px 0' }}>
        {!stream ? (
          <button onClick={iniciarCamara} style={botonStyles}>
            Activar Cámara
          </button>
        ) : (
          <>
            <button onClick={capturarYAnalizar} disabled={analizando} style={botonStyles}>
              {analizando ? 'Analizando...' : 'Capturar y Analizar Placa'}
            </button>
            <button onClick={detenerCamara} style={botonStylesSecundario}>
              Detener Cámara
            </button>
          </>
        )}
      </div>

      {/* Resultados */}
      {analizando && <p>🔍 Analizando placa...</p>}
      {resultado && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: resultado.exito ? '#e8f5e8' : '#ffe8e8',
          borderRadius: '8px'
        }}>
          {resultado.exito ? (
            <div>
              <h3>✅ Análisis Completado</h3>
              <p><strong>Placa detectada:</strong> {resultado.placa}</p>
              <p><strong>Confianza:</strong> {resultado.confianza}%</p>
              <p>La cámara se ha detenido automáticamente.</p>
            </div>
          ) : (
            <div>
              <h3>❌ Error en Análisis</h3>
              <p>{resultado.error}</p>
              <button onClick={capturarYAnalizar} style={botonStyles}>
                Reintentar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Estilos básicos para los botones
const botonStyles = {
  padding: '10px 20px',
  margin: '0 10px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const botonStylesSecundario = {
  ...botonStyles,
  backgroundColor: '#6c757d'
};

export default CamaraPlacas;