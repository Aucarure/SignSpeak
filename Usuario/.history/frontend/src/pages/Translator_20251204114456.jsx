import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

// Simulación de las APIs (mantener las importaciones reales en tu código)
const api = {
  connect: () => Promise.resolve(),
  sendFrame: () => {},
  disconnect: () => {}
};

const conversacionApi = {
  crearConversacion: () => Promise.resolve({ idConversacion: 1, guardada: false }),
  agregarMensaje: () => Promise.resolve(),
  guardarConversacion: (id, guardada) => Promise.resolve({ idConversacion: id, guardada }),
  finalizarConversacion: () => Promise.resolve()
};

function Translator() {
  const webcamRef = useRef(null);
  const intervalRef = useRef(null);
  
  const [detectedSign, setDetectedSign] = useState('');
  const [lastAddedSign, setLastAddedSign] = useState('');
  const [lastSignTime, setLastSignTime] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [status, setStatus] = useState('Listo para comenzar');
  const [isConnected, setIsConnected] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [sequenceProgress, setSequenceProgress] = useState(0);
  const [detectedText, setDetectedText] = useState('');
  
  // Estado para conversación
  const [conversacionActual, setConversacionActual] = useState(null);
  const [guardandoConversacion, setGuardandoConversacion] = useState(false);
  const idUsuario = 1;
  
  const SIGN_COOLDOWN = 2000;

  const connectToServer = useCallback(async () => {
    try {
      await api.connect(
        (data) => {
          if (data.error) {
            setStatus(`Error: ${data.error}`);
            return;
          }

          const newSign = data.prediction || '';
          const newConfidence = data.confidence || 0;
          const currentTime = Date.now();
          
          setConfidence(newConfidence);
          setHandDetected(data.hand_detected || false);
          setSequenceProgress(data.sequence_progress || 0);
          
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
          } else if (data.hand_detected) {
            setStatus(`🔄 Acumulando frames: ${data.sequence_progress}/30`);
          } else {
            setStatus('👋 Muestra tu mano a la cámara');
          }
        },
        (error) => {
          setStatus('❌ Error de conexión');
          setIsConnected(false);
          console.error('Error:', error);
        }
      );
      setIsConnected(true);
      setStatus('✅ Conectado al servidor');
    } catch (error) {
      setStatus('❌ No se pudo conectar al servidor');
      console.error(error);
    }
  }, [lastAddedSign, lastSignTime, conversacionActual]);

  const startDetection = useCallback(async () => {
    if (!isConnected) {
      await connectToServer();
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

    intervalRef.current = setInterval(() => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          api.sendFrame(imageSrc);
        }
      }
    }, 100);
  }, [isConnected, conversacionActual, connectToServer]);

  const stopDetection = useCallback(() => {
    setIsDetecting(false);
    setStatus('⏸️ Detección pausada');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const guardarConversacion = async () => {
    if (!conversacionActual) {
      alert('⚠️ No hay conversación activa para guardar');
      return;
    }

    console.log('📝 Intentando guardar conversación:', {
      id: conversacionActual.idConversacion,
      estado_actual: conversacionActual.guardada
    });

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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      api.disconnect();
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
      background: '#ffffff',
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
          color: '#1f2937'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#6b7280'
          }}>
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
            {isDetecting && (
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
                  Progreso: {sequenceProgress}/30 frames
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
                    width: `${(sequenceProgress / 30) * 100}%`,
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
            color: '#6b7280'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: isConnected ? '#10b981' : '#ef4444',
                display: 'inline-block'
              }}></span>
              {isConnected ? 'Conectado' : 'Desconectado'}
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