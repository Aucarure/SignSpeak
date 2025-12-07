import React, { useRef, useEffect, useState, useCallback } from 'react';

const FLASK_API_URL = 'http://localhost:5000';

// APIs de conversación
const conversacionApi = {
  crearConversacion: (userId, nombre) => {
    console.log('📝 Creando conversación:', { userId, nombre });
    return Promise.resolve({ idConversacion: Date.now(), guardada: false });
  },
  agregarMensaje: (idConv, mensaje) => {
    console.log('💬 Agregando mensaje:', { idConv, mensaje });
    return Promise.resolve();
  },
  guardarConversacion: (id, guardada) => {
    console.log('💾 Guardando conversación:', { id, guardada });
    return Promise.resolve({ idConversacion: id, guardada });
  },
  finalizarConversacion: (id) => {
    console.log('🔚 Finalizando conversación:', id);
    return Promise.resolve();
  }
};

function Translator() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handsRef = useRef(null);
  const animationFrameRef = useRef(null);
  const sequenceRef = useRef([]);
  
  const [detectedSign, setDetectedSign] = useState('');
  const [lastAddedSign, setLastAddedSign] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [status, setStatus] = useState('Listo para comenzar');
  const [isDetecting, setIsDetecting] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [sequenceProgress, setSequenceProgress] = useState(0);
  const [detectedText, setDetectedText] = useState('');
  const [config, setConfig] = useState(null);
  const [allProbabilities, setAllProbabilities] = useState({});
  const [debugLog, setDebugLog] = useState([]);
  const [mediapipeLoaded, setMediapipeLoaded] = useState(false);
  
  const [conversacionActual, setConversacionActual] = useState(null);
  const [guardandoConversacion, setGuardandoConversacion] = useState(false);
  const idUsuario = 1;

  const addLog = (message) => {
    console.log(message);
    setDebugLog(prev => [...prev.slice(-8), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Cargar MediaPipe
  useEffect(() => {
    const loadMediaPipe = async () => {
      try {
        addLog('📦 Cargando MediaPipe...');
        
        // Cargar scripts de MediaPipe
        const script1 = document.createElement('script');
        script1.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
        document.head.appendChild(script1);
        
        await new Promise((resolve) => {
          script1.onload = resolve;
        });
        
        const script2 = document.createElement('script');
        script2.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js';
        document.head.appendChild(script2);
        
        await new Promise((resolve) => {
          script2.onload = resolve;
        });
        
        addLog('✅ MediaPipe cargado');
        
        // Inicializar Hands
        const hands = new window.Hands({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          }
        });
        
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.5
        });
        
        handsRef.current = hands;
        setMediapipeLoaded(true);
        addLog('✅ Hands inicializado');
        
      } catch (error) {
        addLog(`❌ Error cargando MediaPipe: ${error.message}`);
      }
    };
    
    loadMediaPipe();
  }, []);

  // Cargar configuración del servidor
  useEffect(() => {
    addLog('🔄 Conectando al servidor Flask...');
    fetch(`${FLASK_API_URL}/config`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setConfig(data);
        addLog(`✅ Config: ${data.frames_per_sample} frames, clases: ${data.class_names.join(', ')}`);
      })
      .catch(err => {
        addLog(`❌ Error conectando: ${err.message}`);
        setStatus('❌ No se pudo conectar al servidor Flask en puerto 5000');
      });
  }, []);

  // Inicializar cámara
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          addLog('✅ Cámara iniciada');
        }
      } catch (error) {
        addLog(`❌ Error accediendo a cámara: ${error.message}`);
      }
    };
    
    startCamera();
    
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Extraer landmarks (IGUAL que train_simple.py)
  const extractLandmarks = (handLandmarks) => {
    const landmarks = [];
    for (const landmark of handLandmarks) {
      landmarks.push(landmark.x, landmark.y, landmark.z);
    }
    return landmarks;
  };

  // Normalizar landmarks (IGUAL que train_simple.py)
  const normalizeLandmarks = (landmarks) => {
    const reshaped = [];
    for (let i = 0; i < landmarks.length; i += 3) {
      reshaped.push([landmarks[i], landmarks[i + 1], landmarks[i + 2]]);
    }
    
    const wrist = reshaped[0];
    const normalized = reshaped.map(point => [
      point[0] - wrist[0],
      point[1] - wrist[1],
      point[2] - wrist[2]
    ]);
    
    return normalized.flat();
  };

  // Función de predicción
  const predictSign = async (sequence) => {
    try {
      addLog(`📤 Enviando ${sequence.length} frames...`);
      
      const response = await fetch(`${FLASK_API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sequence }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `HTTP ${response.status}`);
      }
      
      const result = await response.json();
      addLog(`📥 Predicción: ${result.prediction} (${(result.confidence * 100).toFixed(1)}%)`);
      return result;
      
    } catch (error) {
      addLog(`❌ Error: ${error.message}`);
      return null;
    }
  };

  // Detección en tiempo real
  const detectHands = useCallback(async () => {
    if (!isDetecting || !handsRef.current || !videoRef.current || !canvasRef.current || !config) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Dibujar video
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      ctx.restore();

      // Procesar con MediaPipe
      await handsRef.current.send({ image: video });
    }

    animationFrameRef.current = requestAnimationFrame(detectHands);
  }, [isDetecting, config]);

  // Configurar callback de MediaPipe
  useEffect(() => {
    if (!handsRef.current || !config) return;

    handsRef.current.onResults((results) => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Dibujar landmarks
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        setHandDetected(true);
        
        const landmarks = results.multiHandLandmarks[0];
        
        // Dibujar puntos
        for (const landmark of landmarks) {
          const x = landmark.x * canvas.width;
          const y = landmark.y * canvas.height;
          
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = '#00FF00';
          ctx.fill();
        }

        // Dibujar conexiones
        const connections = [
          [0,1],[1,2],[2,3],[3,4],  // Pulgar
          [0,5],[5,6],[6,7],[7,8],  // Índice
          [0,9],[9,10],[10,11],[11,12],  // Medio
          [0,13],[13,14],[14,15],[15,16],  // Anular
          [0,17],[17,18],[18,19],[19,20],  // Meñique
          [5,9],[9,13],[13,17]  // Palma
        ];

        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        
        for (const [start, end] of connections) {
          const startPoint = landmarks[start];
          const endPoint = landmarks[end];
          
          ctx.beginPath();
          ctx.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height);
          ctx.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height);
          ctx.stroke();
        }

        // Extraer y procesar landmarks
        const landmarksArray = extractLandmarks(landmarks);
        const normalizedLandmarks = normalizeLandmarks(landmarksArray);
        
        sequenceRef.current.push(normalizedLandmarks);
        
        if (sequenceRef.current.length > config.frames_per_sample) {
          sequenceRef.current.shift();
        }

        const progress = sequenceRef.current.length;
        setSequenceProgress(progress);

        // Predecir cuando tengamos suficientes frames
        if (sequenceRef.current.length === config.frames_per_sample) {
          predictSign([...sequenceRef.current]).then(result => {
            if (result) {
              const newSign = result.prediction;
              const newConfidence = result.confidence;
              
              setDetectedSign(newSign);
              setConfidence(newConfidence);
              setAllProbabilities(result.probabilities || {});
              
              if (newConfidence > 0.6 && newSign !== lastAddedSign) {
                const newText = detectedText ? `${detectedText} ${newSign}` : newSign;
                addLog(`✅ AGREGANDO: "${newSign}"`);
                setDetectedText(newText);
                
                if (conversacionActual) {
                  conversacionApi.agregarMensaje(conversacionActual.idConversacion, {
                    tipoMensaje: 'seña_detectada',
                    señaDetectada: newSign,
                    confianzaDeteccion: newConfidence
                  });
                }
                
                setLastAddedSign(newSign);
                setStatus(`✅ Seña detectada: ${newSign}`);
              }
            }
          });
          
          sequenceRef.current = [];
        }

      } else {
        setHandDetected(false);
      }
    });
  }, [config, lastAddedSign, detectedText, conversacionActual]);

  const startDetection = useCallback(async () => {
    if (!config || !mediapipeLoaded) {
      setStatus('⚠️ Esperando inicialización...');
      return;
    }

    addLog('▶️ Iniciando detección...');

    if (!conversacionActual) {
      try {
        const nuevaConversacion = await conversacionApi.crearConversacion(
          idUsuario,
          `Conversación ${new Date().toLocaleString('es-ES')}`
        );
        setConversacionActual(nuevaConversacion);
        addLog(`✅ Conversación creada: ID ${nuevaConversacion.idConversacion}`);
      } catch (error) {
        addLog(`❌ Error creando conversación: ${error.message}`);
      }
    }

    setIsDetecting(true);
    setStatus('🔄 Detectando señas...');
    sequenceRef.current = [];
  }, [config, mediapipeLoaded, conversacionActual]);

  const stopDetection = useCallback(() => {
    addLog('⏸️ Detección pausada');
    setIsDetecting(false);
    setStatus('⏸️ Detección pausada');
    sequenceRef.current = [];
    setSequenceProgress(0);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
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
      alert(`❌ Error: ${error.message}`);
    } finally {
      setGuardandoConversacion(false);
    }
  };

  const limpiarTexto = () => {
    addLog('🗑️ Limpiando texto');
    setDetectedText('');
    setLastAddedSign('');
    sequenceRef.current = [];
    setDetectedSign('');
    setConfidence(0);
    setAllProbabilities({});
  };

  const finalizarConversacion = async () => {
    if (conversacionActual) {
      try {
        await conversacionApi.finalizarConversacion(conversacionActual.idConversacion);
        addLog('✅ Conversación finalizada');
      } catch (error) {
        addLog(`❌ Error finalizando: ${error.message}`);
      }
    }
    
    stopDetection();
    setDetectedText('');
    setLastAddedSign('');
    setConversacionActual(null);
  };

  useEffect(() => {
    if (isDetecting) {
      detectHands();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDetecting, detectHands]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          color: 'white'
        }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '10px' }}>
            🤟 Traductor de Señas
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.9 }}>
            Reconocimiento en tiempo real con MediaPipe + IA
          </p>
        </div>

        {/* Debug Log */}
        <div style={{
          background: 'rgba(0,0,0,0.8)',
          color: '#00ff00',
          padding: '15px',
          borderRadius: '12px',
          marginBottom: '20px',
          fontFamily: 'monospace',
          fontSize: '12px',
          maxHeight: '150px',
          overflowY: 'auto'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>🐛 Debug Log:</div>
          {debugLog.length === 0 ? (
            <div style={{ opacity: 0.5 }}>Esperando eventos...</div>
          ) : (
            debugLog.map((log, i) => <div key={i}>{log}</div>)
          )}
        </div>

        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          
          {/* Video y Canvas */}
          <div style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            background: '#000'
          }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                transform: 'scaleX(-1)'
              }}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
              }}
            />
            
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
              {handDetected && isDetecting && (
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
                <div style={{ marginBottom: '4px', fontSize: '11px', opacity: 0.8 }}>
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

          {/* Botones de Control */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button
              onClick={isDetecting ? stopDetection : startDetection}
              disabled={!config || !mediapipeLoaded}
              style={{
                flex: 1,
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '12px',
                cursor: (config && mediapipeLoaded) ? 'pointer' : 'not-allowed',
                background: isDetecting 
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                opacity: (config && mediapipeLoaded) ? 1 : 0.5
              }}
            >
              {isDetecting ? '⏸️ Pausar' : '▶️ Iniciar Detección'}
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

          {/* Área de Texto Detectado */}
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
                  cursor: (conversacionActual && detectedText) ? 'pointer' : 'not-allowed',
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
                  Aquí aparecerá el texto traducido...
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

            {Object.keys(allProbabilities).length > 0 && (
              <div style={{
                marginTop: '12px',
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap'
              }}>
                {Object.entries(allProbabilities)
                  .sort(([,a], [,b]) => b - a)
                  .map(([label, prob]) => (
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

          {/* Footer */}
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
                background: (config && mediapipeLoaded) ? '#10b981' : '#ef4444',
                display: 'inline-block'
              }}></span>
              {config && mediapipeLoaded ? 'Sistema listo' : 'Inicializando...'}
            </div>
            
            {conversacionActual && (
              <>
                <div style={{ fontSize: '12px' }}>
                  ID: {conversacionActual.idConversacion}
                </div>
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
                  Finalizar
                </button>
              </>
            )}
          </div>
        </div>

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