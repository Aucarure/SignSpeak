import React, { useRef, useEffect, useState, useCallback } from 'react';

// Mock de Webcam para demo
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

// URL de tu backend
const API_URL = 'http://localhost:5000';

function Translator() {
  const webcamRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  const [detectedSign, setDetectedSign] = useState('');
  const [lastAddedSign, setLastAddedSign] = useState('');
  const [lastSignTime, setLastSignTime] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [status, setStatus] = useState('Listo para comenzar');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedText, setDetectedText] = useState('');
  const [config, setConfig] = useState(null);
  const [allProbabilities, setAllProbabilities] = useState({});
  const [debugLog, setDebugLog] = useState([]);
  const [serverOnline, setServerOnline] = useState(false);
  
  const SIGN_COOLDOWN = 2000;
  const sequenceRef = useRef([]);

  const addLog = (message) => {
    console.log(message);
    setDebugLog(prev => [...prev.slice(-5), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Cargar configuración al montar
  useEffect(() => {
    addLog('🔄 Conectando al servidor...');
    fetch(`${API_URL}/config`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setConfig(data);
        setServerOnline(true);
        addLog(`✅ Servidor conectado. Clases: ${data.class_names.join(', ')}`);
        addLog(`📊 Frames requeridos: ${data.frames_per_sample}`);
      })
      .catch(err => {
        setServerOnline(false);
        addLog(`❌ Error: ${err.message}`);
        setStatus('❌ Servidor desconectado. Inicia el backend en puerto 5000');
      });
  }, []);

  // Simular detección de mano (reemplazar con MediaPipe real)
  const simulateHandDetection = useCallback(() => {
    if (!isDetecting || !config) return;

    // Generar landmarks aleatorios normalizados (simulación)
    const fakeLandmarks = Array(63).fill(0).map(() => Math.random() * 0.1 - 0.05);
    
    sequenceRef.current.push(fakeLandmarks);
    
    if (sequenceRef.current.length > config.frames_per_sample) {
      sequenceRef.current.shift();
    }

    const progress = sequenceRef.current.length;
    setStatus(`🔄 Capturando frames: ${progress}/${config.frames_per_sample}`);

    // Cuando tengamos suficientes frames, hacer predicción
    if (sequenceRef.current.length === config.frames_per_sample) {
      predictSign(sequenceRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(simulateHandDetection);
  }, [isDetecting, config]);

  const predictSign = async (sequence) => {
    try {
      addLog(`📤 Enviando secuencia (${sequence.length} frames)...`);
      
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sequence })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `HTTP ${response.status}`);
      }
      
      const result = await response.json();
      addLog(`📥 Predicción: ${result.prediction} (${(result.confidence * 100).toFixed(1)}%)`);
      
      const newSign = result.prediction;
      const newConfidence = result.confidence;
      
      setDetectedSign(newSign);
      setConfidence(newConfidence);
      setAllProbabilities(result.probabilities || {});
      
      if (newConfidence > 0.6) {
        const currentTime = Date.now();
        const isDifferent = newSign !== lastAddedSign;
        const hasTimeElapsed = (currentTime - lastSignTime) > SIGN_COOLDOWN;
        
        if (isDifferent || hasTimeElapsed) {
          const newText = detectedText ? `${detectedText} ${newSign}` : newSign;
          addLog(`✅ Seña agregada: "${newSign}" → "${newText}"`);
          setDetectedText(newText);
          setLastAddedSign(newSign);
          setLastSignTime(currentTime);
          setStatus(`✅ Seña detectada: ${newSign}`);
        } else {
          addLog(`⏸️ Seña ignorada (cooldown)`);
        }
      } else {
        addLog(`⚠️ Confianza baja (${(newConfidence * 100).toFixed(1)}%)`);
        setStatus(`⚠️ Confianza baja: ${(newConfidence * 100).toFixed(1)}%`);
      }
      
    } catch (error) {
      addLog(`❌ Error: ${error.message}`);
      setStatus(`❌ Error en predicción`);
      console.error('Error completo:', error);
    }
  };

  const startDetection = () => {
    if (!config) {
      addLog('⚠️ Esperando configuración del servidor');
      return;
    }
    
    addLog('▶️ Iniciando detección');
    setIsDetecting(true);
    setStatus('🔄 Detectando señas...');
    sequenceRef.current = [];
  };

  const stopDetection = () => {
    addLog('⏸️ Detección pausada');
    setIsDetecting(false);
    setStatus('⏸️ Detección pausada');
    sequenceRef.current = [];
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const limpiarTexto = () => {
    addLog('🗑️ Texto limpiado');
    setDetectedText('');
    setLastAddedSign('');
    setLastSignTime(0);
    sequenceRef.current = [];
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
        
        {/* Header */}
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

        {/* Debug Panel */}
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
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            🐛 Debug Log:
          </div>
          {debugLog.length === 0 ? (
            <div style={{ opacity: 0.5 }}>Esperando eventos...</div>
          ) : (
            debugLog.map((log, i) => <div key={i}>{log}</div>)
          )}
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
              fontSize: '14px'
            }}>
              {status}
            </div>

            {/* Progress Bar */}
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
                  Progreso: {sequenceRef.current.length}/{config.frames_per_sample} frames
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
                    width: `${(sequenceRef.current.length / config.frames_per_sample) * 100}%`,
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button
              onClick={isDetecting ? stopDetection : startDetection}
              disabled={!serverOnline}
              style={{
                flex: 1,
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '12px',
                cursor: serverOnline ? 'pointer' : 'not-allowed',
                background: isDetecting 
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                opacity: serverOnline ? 1 : 0.5
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

          {/* Detected Text */}
          <div style={{
            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '20px',
            minHeight: '120px',
            border: '2px solid #d1d5db'
          }}>
            <h3 style={{
              margin: 0,
              marginBottom: '12px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#374151'
            }}>
              📝 Texto Detectado
            </h3>
            
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

            {/* Probabilidades */}
            {Object.keys(allProbabilities).length > 0 && (
              <div style={{
                marginTop: '12px',
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap'
              }}>
                {Object.entries(allProbabilities)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
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

          {/* Server Status */}
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
                background: serverOnline ? '#10b981' : '#ef4444',
                display: 'inline-block'
              }}></span>
              {serverOnline ? '✅ Servidor conectado' : '❌ Servidor desconectado'}
            </div>
            
            {config && (
              <div style={{ fontSize: '12px' }}>
                Clases: {config.class_names.join(', ')}
              </div>
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
          💡 Nota: Esta es una versión de prueba con detección simulada.
          <br />
          Integra MediaPipe Hands para detección real de manos.
        </div>
      </div>
    </div>
  );
}

export default Translator;