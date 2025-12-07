import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

// Tus APIs originales
const conversacionApi = {
  crearConversacion: () => Promise.resolve({ idConversacion: 1, guardada: false }),
  agregarMensaje: () => Promise.resolve(),
  guardarConversacion: (id, guardada) => Promise.resolve({ idConversacion: id, guardada }),
  finalizarConversacion: () => Promise.resolve()
};

// URL de tu backend Flask
const FLASK_API_URL = 'http://localhost:5000';

function Translator() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const handsRef = useRef(null);
  const cameraRef = useRef(null);
  
  const [detectedSign, setDetectedSign] = useState('');
  const [lastAddedSign, setLastAddedSign] = useState('');
  const [lastSignTime, setLastSignTime] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [status, setStatus] = useState('Listo para comenzar');
  const [isDetecting, setIsDetecting] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [sequenceProgress, setSequenceProgress] = useState(0);
  const [detectedText, setDetectedText] = useState('');
  const [config, setConfig] = useState(null);
  const [allProbabilities, setAllProbabilities] = useState({});
  
  // Estado para conversación
  const [conversacionActual, setConversacionActual] = useState(null);
  const [guardandoConversacion, setGuardandoConversacion] = useState(false);
  const idUsuario = 1;
  
  const SIGN_COOLDOWN = 2000;
  const sequenceRef = useRef([]);

  // Cargar configuración del modelo al montar
  useEffect(() => {
    fetch(`${FLASK_API_URL}/config`)
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        console.log('✅ Configuración cargada:', data);
      })
      .catch(err => {
        console.error('❌ Error cargando configuración:', err);
        setStatus('❌ No se pudo conectar al servidor');
      });
  }, []);

  // Funciones para procesar landmarks
  const extractLandmarks = (handLandmarks) => {
    const landmarks = [];
    for (const landmark of handLandmarks) {
      landmarks.push(landmark.x, landmark.y, landmark.z);
    }
    return landmarks;
  };

  const normalizeLandmarks = (landmarks) => {
    const reshaped = [];
    for (let i = 0; i < landmarks.length; i += 3) {
      reshaped.push([landmarks[i], landmarks[i+1], landmarks[i+2]]);
    }
    
    const wrist = reshaped[0];
    const normalized = reshaped.map(point => [
      point[0] - wrist[0],
      point[1] - wrist[1],
      point[2] - wrist[2]
    ]);
    
    return normalized.flat();
  };

  // Función para hacer predicción
  const predictSign = async (sequence) => {
    try {
      const response = await fetch(`${FLASK_API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sequence })
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error en predicción:', error);
      return null;
    }
  };

  // Callback de MediaPipe
  const onResults = useCallback(async (results) => {
    if (!config || !isDetecting) return;

    const currentTime = Date.now();
    
    if (results.multiHandLandmarks && results.multiHandLandmarks[0]) {
      setHandDetected(true);
      
      // Extraer y normalizar landmarks
      const rawLandmarks = extractLandmarks(results.multiHandLandmarks[0]);
      const normalized = normalizeLandmarks(rawLandmarks);
      
      // Agregar a secuencia
      sequenceRef.current.push(normalized);
      
      // Mantener solo los últimos N frames según config
      if (sequenceRef.current.length > config.frames_per_sample) {
        sequenceRef.current.shift();
      }
      
      const progress = sequenceRef.current.length;
      setSequenceProgress(progress);
      setStatus(`🔄 Acumulando frames: ${progress}/${config.frames_per_sample}`);
      
      // Predecir cuando tengamos suficientes frames
      if (sequenceRef.current.length === config.frames_per_sample) {
        const result = await predictSign(sequenceRef.current);
        
        if (result) {
          const newSign = result.prediction;
          const newConfidence = result.confidence;
          
          setConfidence(newConfidence);
          setAllProbabilities(result.probabilities || {});
          
          if (newSign && newConfidence > 0.6) {
            setDetectedSign(newSign);
            
            const isDifferentSign = newSign !== lastAddedSign;
            const hasTimeElapsed = (currentTime - lastSignTime) > SIGN_COOLDOWN;
            
            if (isDifferentSign || (newSign === lastAddedSign && hasTimeElapsed)) {
              // Agregar seña al texto detectado
              setDetectedText(prev => prev ? `${prev} ${newSign}` : newSign);
              
              // Guardar en BD si hay conversación activa
              if (conversacionActual) {
                conversacionApi.agregarMensaje(conversacionActual.idConversacion, {
                  tipoMensaje: 'seña_detectada',
                  señaDetectada: newSign,
                  confianzaDeteccion: newConfidence
                }).catch(err => console.error('Error guardando mensaje:', err));
              }
              
              setLastAddedSign(newSign);
              setLastSignTime(currentTime);
              setStatus(`✅ Seña detectada: ${newSign}`);
            }
          }
        }
      }
    } else {
      setHandDetected(false);
      sequenceRef.current = [];
      setSequenceProgress(0);
      setStatus('👋 Muestra tu mano a la cámara');
    }
  }, [config, isDetecting, lastAddedSign, lastSignTime, conversacionActual]);

  // Inicializar MediaPipe Hands
  const initializeMediaPipe = useCallback(async () => {
    if (!webcamRef.current?.video) return;

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5
    });

    hands.onResults(onResults);
    handsRef.current = hands;

    const camera = new Camera(webcamRef.current.video, {
      onFrame: async () => {
        if (handsRef.current && webcamRef.current?.video) {
          await handsRef.current.send({ image: webcamRef.current.video });
        }
      },
      width: 1280,
      height: 720
    });

    cameraRef.current = camera;
    await camera.start();
    
    console.log('✅ MediaPipe inicializado');
  }, [onResults]);

  const startDetection = useCallback(async () => {
    if (!config) {
      setStatus('⚠️ Esperando configuración del servidor...');
      return;
    }

    // Crear conversación en BD al iniciar detección
    if (!conversacionActual) {
      try {
        const nuevaConversacion = await conversacionApi.crearConversacion(
          idUsuario,
          `Conversación ${new Date().toLocaleString('es-ES')}`
        );
        setConversacionActual(nuevaConversacion);
        console.log('✅ Conversación creada:', nuevaConversacion);
      } catch (error) {
        console.error('Error creando conversación:', error);
      }
    }

    setIsDetecting(true);
    setStatus('🔄 Detectando señas...');
    
    // Inicializar MediaPipe si no está inicializado
    if (!cameraRef.current) {
      await initializeMediaPipe();
    }
  }, [config, conversacionActual, initializeMediaPipe]);

  const stopDetection = useCallback(() => {
    setIsDetecting(false);
    setStatus('⏸️ Detección pausada');
    sequenceRef.current = [];
    setSequenceProgress(0);
  }, []);

  const guardarConversacion = async () => {
    if (!conversacionActual) {
      alert('⚠️ No hay conversación activa para guardar');
      return;
    }

    setGuardandoConversacion(true);
    try {
      const nuevoEstado = !conversacionActual.guardada;
      
      const conversacionGuardada = await conversacionApi.guardarConversacion(
        conversacionActual.idConversacion,
        nuevoEstado
      );
      
      setConversacionActual(conversacionGuardada);
      alert(nuevoEstado ? '✅ Conversación guardada' : '📌 Conversación removida');
      
    } catch (error) {
      console.error('❌ Error completo:', error);
      alert(`❌ Error: ${error.response?.data?.message || 'Error al guardar'}`);
    } finally {
      setGuardandoConversacion(false);
    }
  };

  const limpiarTexto = () => {
    setDetectedText('');
    setLastAddedSign('');
    setLastSignTime(0);
    sequenceRef.current = [];
  };

  const finalizarConversacion = async () => {
    if (conversacionActual) {
      try {
        await conversacionApi.finalizarConversacion(conversacionActual.idConversacion);
        console.log('✅ Conversación finalizada');
      } catch (error) {
        console.error('Error finalizando conversación:', error);
      }
    }
    
    stopDetection();
    setDetectedText('');
    setLastAddedSign('');
    setLastSignTime(0);
    setConversacionActual(null);
  };

  useEffect(() => {
    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, []);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>
            🤟 Traductor de Señas
          </h1>
          <p style={{
            fontSize: '18px',
            opacity: 0.9
          }}>
            Reconocimiento en tiempo real con IA
          </p>
        </div>

        {/* Main Card */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          {/* Webcam */}
          <div style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
            
            {/* Status Overlay */}
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              right: '16px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>{status}</span>
              {handDetected && (
                <span style={{
                  background: '#10b981',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  ✋ Mano detectada
                </span>
              )}
            </div>

            {/* Detection Progress */}
            {isDetecting && config && (
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                right: '16px',
                background: 'rgba(0,0,0,0.7)',
                borderRadius: '12px',
                padding: '8px',
                color: 'white',
                fontSize: '12px'
              }}>
                <div style={{
                  marginBottom: '4px',
                  fontSize: '11px',
                  opacity: 0.8
                }}>
                  Progreso: {sequenceProgress}/{config.frames_per_sample} frames
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.2)',
                  height: '6px',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: '#10b981',
                    height: '100%',
                    width: `${(sequenceProgress / config.frames_per_sample) * 100}%`,
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <button
              onClick={isDetecting ? stopDetection : startDetection}
              style={{
                flex: 1,
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: isDetecting 
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              {isDetecting ? '⏸️ Pausar Detección' : '▶️ Iniciar Detección'}
            </button>

            {detectedText && (
              <button
                onClick={limpiarTexto}
                style={{
                  padding: '16px 24px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: '#6b7280',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              >
                🗑️ Limpiar
              </button>
            )}
          </div>

          {/* Detected Text Area */}
          <div style={{
            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '20px',
            minHeight: '120px',
            border: '2px solid #d1d5db'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#374151'
              }}>
                📝 Texto Detectado
              </h3>
              
              <button
                onClick={guardarConversacion}
                disabled={guardandoConversacion || !conversacionActual || !detectedText}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: conversacionActual && detectedText ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  background: conversacionActual?.guardada
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  opacity: (!conversacionActual || !detectedText) ? 0.5 : 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                {guardandoConversacion 
                  ? '⏳ Guardando...' 
                  : conversacionActual?.guardada 
                    ? '✅ Guardada' 
                    : '💾 Guardar'}
              </button>
            </div>
            
            <div style={{
              fontSize: '24px',
              color: '#1f2937',
              fontWeight: '500',
              minHeight: '60px',
              lineHeight: '1.6',
              wordWrap: 'break-word'
            }}>
              {detectedText || (
                <span style={{ 
                  color: '#9ca3af',
                  fontSize: '18px',
                  fontStyle: 'italic'
                }}>
                  Aquí aparecerá el texto traducido de tus señas...
                </span>
              )}
            </div>

            {detectedSign && (
              <div style={{
                marginTop: '12px',
                padding: '8px 12px',
                background: 'white',
                borderRadius: '8px',
                display: 'inline-block',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Última seña: <strong style={{ color: '#374151' }}>{detectedSign}</strong>
                {confidence > 0 && (
                  <span style={{ marginLeft: '8px' }}>
                    ({(confidence * 100).toFixed(0)}% confianza)
                  </span>
                )}
              </div>
            )}

            {/* Probabilidades de todas las clases */}
            {Object.keys(allProbabilities).length > 0 && (
              <div style={{
                marginTop: '12px',
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap'
              }}>
                {Object.entries(allProbabilities).map(([label, prob]) => (
                  <div key={label} style={{
                    background: 'white',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <strong>{label}:</strong> {(prob * 100).toFixed(1)}%
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            background: '#f9fafb',
            borderRadius: '12px',
            fontSize: '14px',
            color: '#6b7280',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: config ? '#10b981' : '#ef4444',
                display: 'inline-block'
              }}></span>
              {config ? 'Conectado al servidor' : 'Desconectado'}
            </div>
            
            {conversacionActual && (
              <div style={{ fontSize: '12px' }}>
                ID Conversación: {conversacionActual.idConversacion}
              </div>
            )}

            {conversacionActual && (
              <button
                onClick={finalizarConversacion}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  border: '1px solid #dc2626',
                  borderRadius: '6px',
                  background: 'white',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Finalizar Conversación
              </button>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          color: 'white',
          fontSize: '14px',
          opacity: 0.9
        }}>
          💡 Presiona "Iniciar Detección" y muestra tus señas a la cámara
        </div>
      </div>
    </div>
  );
}

export default Translator;