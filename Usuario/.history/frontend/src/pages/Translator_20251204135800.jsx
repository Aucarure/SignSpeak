import React, { useRef, useEffect, useState, useCallback } from 'react';

// Mock de Webcam para demo (reemplazar con react-webcam real)
const Webcam = React.forwardRef(({ videoConstraints, style }, ref) => {
  const videoRef = useRef(null);
  
  useEffect(() => {
    if (ref) {
      ref.current = { video: videoRef.current };
    }
    
    navigator.mediaDevices.getUserMedia({ 
      video: videoConstraints 
    }).then(stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }).catch(err => console.error('Error accediendo a cámara:', err));
  }, []);
  
  return <video ref={videoRef} autoPlay playsInline muted style={style} />;
});

// APIs de conversación (tus funciones originales)
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

const FLASK_API_URL = 'http://localhost:5000';

function Translator() {
  const webcamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const sequenceRef = useRef([]);
  
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
  const [debugLog, setDebugLog] = useState([]);
  
  // Estado para conversación
  const [conversacionActual, setConversacionActual] = useState(null);
  const [guardandoConversacion, setGuardandoConversacion] = useState(false);
  const idUsuario = 1;

  const addLog = (message) => {
    console.log(message);
    setDebugLog(prev => [...prev.slice(-5), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Cargar configuración
  useEffect(() => {
    addLog('🔄 Conectando al servidor...');
    fetch(`${FLASK_API_URL}/config`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setConfig(data);
        addLog(`✅ Config cargada: ${data.frames_per_sample} frames, clases: ${data.class_names.join(', ')}`);
      })
      .catch(err => {
        addLog(`❌ Error conectando: ${err.message}`);
        setStatus('❌ No se pudo conectar al servidor Flask. ¿Está corriendo en puerto 5000?');
      });
  }, []);

  // Función para hacer predicción CON REINTENTOS
  const predictSign = async (sequence, retries = 3) => {
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        addLog(`📤 Intento ${attempt}: Enviando secuencia (${sequence.length} frames)...`);
        console.log("📦 Enviando datos al servidor:");
        console.log("   Número de frames:", sequence.length);
        console.log("   Primer frame, primeros 6 valores:", sequence[0].slice(0, 6));
        console.log("   Último frame, primeros 6 valores:", sequence[sequence.length-1].slice(0, 6));
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout
        
        const response = await fetch(`${FLASK_API_URL}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sequence }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || `HTTP ${response.status}`);
        }
        
        const result = await response.json();
        addLog(`📥 Predicción recibida: ${result.prediction} (${(result.confidence * 100).toFixed(1)}%)`);
        return result;
        
      } catch (error) {
        if (error.name === 'AbortError') {
          addLog(`⏱️ Timeout en intento ${attempt}`);
        } else {
          addLog(`❌ Error intento ${attempt}: ${error.message}`);
        }
        
        if (attempt === retries) {
          addLog(`❌ Falló después de ${retries} intentos`);
          setStatus(`❌ Error en predicción`);
          return null;
        }
        
        // Esperar antes de reintentar
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    return null;
  };

  // Simulación de detección de manos CORREGIDA
  const simulateHandDetection = useCallback(async () => {
  if (!isDetecting || !config) return;

  setHandDetected(true);
  
  // 🔴 DEBUG: Alternar manualmente con una variable global
  window.contadorSeñas = window.contadorSeñas || 0;
  window.contadorSeñas++;
  const isHolaPattern = window.contadorSeñas % 4 < 2; // 2 frames hola, 2 frames gracias

  const fakeLandmarks = Array(63).fill(0);

  // Base: posición de la muñeca (índices 0-2)
  const wristX = 0.5;
  const wristY = 0.5;
  const wristZ = 0;

  fakeLandmarks[0] = wristX;
  fakeLandmarks[1] = wristY;
  fakeLandmarks[2] = wristZ;

  if (isHolaPattern) {
    // 🔵 PATRÓN "HOLA" MUY DIFERENCIADO
    console.log("🟢🟢🟢 GENERANDO PATRÓN HOLA (ABIERTO)");
    
    // Mano COMPLETAMENTE ABIERTA
    for (let i = 3; i < 63; i += 3) {
      const fingerIndex = Math.floor((i-3)/3);
      const fingerType = Math.floor(fingerIndex / 3); // 0-4 para cada dedo
      const jointIndex = fingerIndex % 3; // 0: base, 1: medio, 2: punta
      
      let offsetX = 0;
      let offsetY = 0;
      
      // Diferentes dedos en diferentes posiciones
      switch(fingerType) {
        case 0: // Pulgar
          offsetX = -0.15;
          offsetY = jointIndex * -0.05;
          break;
        case 1: // Índice
          offsetX = -0.05;
          offsetY = -0.2 - (jointIndex * 0.08);
          break;
        case 2: // Medio
          offsetX = 0;
          offsetY = -0.25 - (jointIndex * 0.08);
          break;
        case 3: // Anular
          offsetX = 0.05;
          offsetY = -0.2 - (jointIndex * 0.08);
          break;
        case 4: // Meñique
          offsetX = 0.1;
          offsetY = -0.15 - (jointIndex * 0.06);
          break;
      }
      
      fakeLandmarks[i] = wristX + offsetX;
      fakeLandmarks[i+1] = wristY + offsetY;
      fakeLandmarks[i+2] = wristZ + (Math.random() * 0.01);
    }
  } else {
    // 🟡 PATRÓN "GRACIAS" MUY DIFERENCIADO
    console.log("🔴🔴🔴 GENERANDO PATRÓN GRACIAS (CERRADO)");
    
    // Mano COMPLETAMENTE CERRADA (puño)
    for (let i = 3; i < 63; i += 3) {
      const fingerIndex = Math.floor((i-3)/3);
      const fingerType = Math.floor(fingerIndex / 3);
      const jointIndex = fingerIndex % 3;
      
      let offsetX = 0;
      let offsetY = 0;
      
      // Todos los dedos CERCA de la muñeca
      switch(fingerType) {
        case 0: // Pulgar
          offsetX = -0.03;
          offsetY = -0.02 - (jointIndex * 0.01);
          break;
        case 1: // Índice
          offsetX = -0.01;
          offsetY = -0.05 - (jointIndex * 0.02);
          break;
        case 2: // Medio
          offsetX = 0;
          offsetY = -0.06 - (jointIndex * 0.02);
          break;
        case 3: // Anular
          offsetX = 0.01;
          offsetY = -0.05 - (jointIndex * 0.02);
          break;
        case 4: // Meñique
          offsetX = 0.03;
          offsetY = -0.03 - (jointIndex * 0.01);
          break;
      }
      
      fakeLandmarks[i] = wristX + offsetX;
      fakeLandmarks[i+1] = wristY + offsetY;
      fakeLandmarks[i+2] = wristZ + (Math.random() * 0.005);
    }
  }
  
  // 🔍 DEBUG: Imprimir algunos valores
  if (sequenceRef.current.length === 0) {
    console.log("📊 Primer frame generado:");
    console.log("   Muñeca (0-2):", fakeLandmarks.slice(0, 3));
    console.log("   Pulgar (3-5):", fakeLandmarks.slice(3, 6));
    console.log("   Índice (6-8):", fakeLandmarks.slice(6, 9));
  }
  
  sequenceRef.current.push(fakeLandmarks);
    
    if (sequenceRef.current.length > config.frames_per_sample) {
      sequenceRef.current.shift();
    }

    const progress = sequenceRef.current.length;
    setSequenceProgress(progress);

    if (progress < config.frames_per_sample) {
      setStatus(`🔄 Acumulando frames: ${progress}/${config.frames_per_sample}`);
    }

    // Predecir cuando tengamos suficientes frames
    if (sequenceRef.current.length === config.frames_per_sample) {
      addLog(`🎯 Secuencia completa, prediciendo...`);
      
      const result = await predictSign([...sequenceRef.current]); // Copia de la secuencia
      
      if (result) {
        const newSign = result.prediction;
        const newConfidence = result.confidence;
        
        setDetectedSign(newSign);
        setConfidence(newConfidence);
        setAllProbabilities(result.probabilities || {});
        
        // 🔴 CORRECCIÓN: Bajar temporalmente el umbral para debugging (0.3 en lugar de 0.6)
        if (newConfidence > 0.3) {
          // Solo agregar si es DIFERENTE a la última seña agregada
          if (newSign !== lastAddedSign) {
            const newText = detectedText ? `${detectedText} ${newSign}` : newSign;
            addLog(`✅ AGREGANDO: "${newSign}" → "${newText}"`);
            setDetectedText(newText);
            
            // Guardar en BD si hay conversación activa
            if (conversacionActual) {
              conversacionApi.agregarMensaje(conversacionActual.idConversacion, {
                tipoMensaje: 'seña_detectada',
                señaDetectada: newSign,
                confianzaDeteccion: newConfidence
              }).catch(err => console.error('Error guardando mensaje:', err));
            }
            
            setLastAddedSign(newSign);
            setLastSignTime(Date.now());
            setStatus(`✅ Seña detectada: ${newSign}`);
          } else {
            addLog(`⏸️ Seña ignorada (misma que anterior: "${newSign}")`);
            setStatus(`🔄 Seña actual: ${newSign} (ya agregada)`);
          }
        } else {
          addLog(`⚠️ Confianza baja (${(newConfidence * 100).toFixed(1)}%)`);
          setStatus(`⚠️ Confianza baja`);
        }
      }
      
      // Limpiar secuencia después de predecir
      sequenceRef.current = [];
    }

    animationFrameRef.current = requestAnimationFrame(simulateHandDetection);
  }, [isDetecting, config, lastAddedSign, lastSignTime, conversacionActual, detectedText]);

  const startDetection = useCallback(async () => {
    if (!config) {
      setStatus('⚠️ Esperando configuración del servidor...');
      return;
    }

    addLog('▶️ Iniciando detección...');

    // Crear conversación en BD al iniciar detección
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
  }, [config, conversacionActual]);

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
      console.error('❌ Error completo:', error);
      alert(`❌ Error: ${error.response?.data?.message || 'Error al guardar'}`);
    } finally {
      setGuardandoConversacion(false);
    }
  };

  const limpiarTexto = () => {
    addLog('🗑️ Limpiando texto');
    setDetectedText('');
    setLastAddedSign(''); // Importante: resetear para permitir nueva detección
    setLastSignTime(0);
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
    setLastSignTime(0);
    setConversacionActual(null);
  };

  useEffect(() => {
    if (isDetecting) {
      simulateHandDetection();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDetecting, simulateHandDetection]);

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
            Reconocimiento en tiempo real con IA
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
          
          {/* Webcam */}
          <div style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            background: '#000'
          }}>
            <Webcam
              ref={webcamRef}
              videoConstraints={videoConstraints}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
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
              disabled={!config}
              style={{
                flex: 1,
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '12px',
                cursor: config ? 'pointer' : 'not-allowed',
                background: isDetecting 
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                opacity: config ? 1 : 0.5
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

          {/* Área de Texto Detectado CON BOTÓN GUARDAR */}
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
              
              {/* BOTÓN GUARDAR */}
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

          {/* Footer con Info de Conversación */}
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