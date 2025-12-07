import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import api from '../../services/api';
import './SignDetector.css';

function SignDetector() {
  const webcamRef = useRef(null);
  const [detectedSign, setDetectedSign] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [status, setStatus] = useState('Inicializando...');
  const [isConnected, setIsConnected] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [sequenceProgress, setSequenceProgress] = useState(0);
  const intervalRef = useRef(null);

  // Conectar al servidor
  const connectToServer = useCallback(async () => {
    try {
      await api.connect(
        // onMessage
        (data) => {
          console.log('📥 Datos recibidos:', data);
          
          if (data.error) {
            setStatus(`Error: ${data.error}`);
            return;
          }

          setDetectedSign(data.prediction || '');
          setConfidence(data.confidence || 0);
          setHandDetected(data.hand_detected || false);
          setSequenceProgress(data.sequence_progress || 0);
          
          // Actualizar estado
          if (data.hand_detected) {
            if (data.prediction) {
              setStatus(`✅ Detectado: ${data.prediction}`);
            } else {
              setStatus(`👋 Acumulando frames: ${data.sequence_progress}/${data.sequence_total}`);
            }
          } else {
            setStatus('⚠️ Muestra tu mano a la cámara');
          }
        },
        // onError
        (error) => {
          setStatus('❌ Error de conexión');
          setIsConnected(false);
          console.error('Error:', error);
        }
      );
      setIsConnected(true);
      setStatus('✅ Conectado - Presiona "Iniciar Detección"');
    } catch (error) {
      setStatus('❌ No se pudo conectar. ¿Backend corriendo?');
      console.error(error);
    }
  }, []);

  // Iniciar detección
  const startDetection = useCallback(() => {
    if (!isConnected) {
      alert('⚠️ Primero conecta al servidor');
      return;
    }

    setIsDetecting(true);
    setStatus('🔄 Iniciando detección...');

    // Enviar frames cada 100ms (10 FPS)
    intervalRef.current = setInterval(() => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          api.sendFrame(imageSrc);
        }
      }
    }, 100);
  }, [isConnected]);

  // Detener detección
  const stopDetection = useCallback(() => {
    setIsDetecting(false);
    setStatus('⏸️ Detenido');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      api.disconnect();
    };
  }, []);

  // Configuración de la webcam
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: 'user'
  };

  return (
    <div className="sign-detector">
      <h1>🤟 SignSpeak - Detección de Lenguaje de Señas</h1>
      
      <div className="controls">
        <button 
          onClick={connectToServer} 
          disabled={isConnected}
          className="btn btn-primary"
        >
          {isConnected ? '✅ Conectado' : '🔌 Conectar'}
        </button>
        
        <button 
          onClick={isDetecting ? stopDetection : startDetection}
          disabled={!isConnected}
          className={`btn ${isDetecting ? 'btn-danger' : 'btn-success'}`}
        >
          {isDetecting ? '⏸️ Detener' : '▶️ Iniciar Detección'}
        </button>
      </div>

      <div className="webcam-container">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="webcam"
        />
        
        {/* Indicador de mano detectada */}
        <div className={`hand-indicator ${handDetected ? 'active' : ''}`}>
          {handDetected ? '✋ Mano detectada' : '👋 Muestra tu mano'}
        </div>
      </div>

      <div className="results">
        <div className="status">
          Estado: <span className="status-text">{status}</span>
        </div>
        
        <div className="prediction">
          <h2>Seña Detectada:</h2>
          <div className={`sign-result ${detectedSign ? 'detected' : ''}`}>
            {detectedSign ? detectedSign.toUpperCase() : '---'}
          </div>
        </div>

        <div className="confidence">
          <h3>Confianza:</h3>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${confidence * 100}%`,
                backgroundColor: confidence > 0.7 ? '#4caf50' : confidence > 0.4 ? '#ff9800' : '#f44336'
              }}
            />
          </div>
          <span>{(confidence * 100).toFixed(1)}%</span>
        </div>

        <div className="info-box">
          <h4>ℹ️ Instrucciones:</h4>
          <ul>
            <li>✅ Señas: hola, gracias, ayuda, si, no, por_favor</li>
            <li>⏱️ Mantén la seña por 3 segundos</li>
            <li>💡 Buena iluminación es importante</li>
            <li>📊 Progreso: {sequenceProgress}/30 frames</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SignDetector;