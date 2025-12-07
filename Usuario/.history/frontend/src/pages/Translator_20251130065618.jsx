import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import api from '../services/api';  // ✅ CORREGIDO: importación unificada
import conversacionApi from '../services/conversacionApi';
import './Translator.css';

function Translator() {
  const webcamRef = useRef(null);
  const chatEndRef = useRef(null);
  
  const [detectedSign, setDetectedSign] = useState('');
  const [lastAddedSign, setLastAddedSign] = useState('');
  const [lastSignTime, setLastSignTime] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [status, setStatus] = useState('Listo para comenzar');
  const [isConnected, setIsConnected] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [sequenceProgress, setSequenceProgress] = useState(0);
  const [chatMode, setChatMode] = useState(null);
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState('');
  const intervalRef = useRef(null);
  
  // Estado para conversación
  const [conversacionActual, setConversacionActual] = useState(null);
  const [guardandoConversacion, setGuardandoConversacion] = useState(false);
  const idUsuario = 1; // Por ahora hardcodeado
  
  const SIGN_COOLDOWN = 2000;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
              addMessageToChat(newSign, 'sign', newConfidence);
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
  }, [lastAddedSign, lastSignTime]);

  const startDetection = useCallback(() => {
    if (!isConnected) {
      alert('⚠️ Primero conecta al servidor');
      return;
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
  }, [isConnected]);

  const stopDetection = useCallback(() => {
    setIsDetecting(false);
    setStatus('⏸️ Detección pausada');
    setLastAddedSign('');
    setLastSignTime(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  // Agregar mensaje y guardar en BD si hay conversación activa
  const addMessageToChat = async (content, type, confianza = null) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      content,
      type,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);

    // Si hay conversación activa, guardar en BD
    if (conversacionActual && type === 'sign') {
      try {
        await conversacionApi.agregarMensaje(conversacionActual.idConversacion, {
          tipoMensaje: 'seña_detectada',
          señaDetectada: content,
          confianzaDeteccion: confianza
        });
        console.log('✅ Mensaje guardado en BD');
      } catch (error) {
        console.error('Error guardando mensaje en BD:', error);
      }
    }
  };

  const handleSendText = async () => {
    if (textInput.trim()) {
      addMessageToChat(textInput, 'text');
      
      // Guardar texto en BD si hay conversación activa
      if (conversacionActual) {
        try {
          await conversacionApi.agregarMensaje(conversacionActual.idConversacion, {
            tipoMensaje: 'texto',
            contenidoTexto: textInput
          });
        } catch (error) {
          console.error('Error guardando texto en BD:', error);
        }
      }
      
      setTextInput('');
    }
  };

  const handleVoiceToSign = () => {
    const signEmojis = ['👋', '✋', '👍', '🙏', '🤝', '👏'];
    const randomSign = signEmojis[Math.floor(Math.random() * signEmojis.length)];
    addMessageToChat(randomSign, 'voice');
  };

  // Crear conversación al abrir video chat
  const openVideoChat = async () => {
    setChatMode('video');
    setMessages([]);
    setLastAddedSign('');
    setLastSignTime(0);

    // Crear conversación en BD
    try {
      const nuevaConversacion = await conversacionApi.crearConversacion(
        idUsuario,
        `Conversación ${new Date().toLocaleString('es-ES')}`
      );
      setConversacionActual(nuevaConversacion);
      console.log('✅ Conversación creada:', nuevaConversacion);
    } catch (error) {
      console.error('Error creando conversación:', error);
      alert('No se pudo crear la conversación en la BD');
    }

    if (!isConnected) {
      connectToServer();
    }
    if (!isDetecting) {
      startDetection();
    }
  };

  const openVoiceChat = async () => {
    setChatMode('voice');
    setMessages([]);
    setLastAddedSign('');
    setLastSignTime(0);

    // Crear conversación para voz
    try {
      const nuevaConversacion = await conversacionApi.crearConversacion(
        idUsuario,
        `Voz a Señas - ${new Date().toLocaleString('es-ES')}`
      );
      setConversacionActual(nuevaConversacion);
    } catch (error) {
      console.error('Error creando conversación:', error);
    }
  };

  // Función para guardar conversación
const guardarConversacion = async () => {
  if (!conversacionActual) {
    alert('⚠️ No hay conversación activa para guardar');
    return;
  }

  setGuardandoConversacion(true);
  try {
    // Toggle: si ya está guardada, la desgardamos; si no, la guardamos
    const nuevoEstado = !conversacionActual.guardada;
    
    const conversacionGuardada = await conversacionApi.guardarConversacion(
      conversacionActual.idConversacion,
      nuevoEstado // ✅ Pasar el parámetro guardada
    );
    
    setConversacionActual(conversacionGuardada);
    
    // Mensaje dinámico
    if (nuevoEstado) {
      alert('✅ Conversación guardada exitosamente');
    } else {
      alert('📌 Conversación removida de guardados');
    }
    
    console.log('Estado actualizado:', conversacionGuardada);
  } catch (error) {
    console.error('Error guardando conversación:', error);
    alert('❌ Error al guardar la conversación');
  } finally {
    setGuardandoConversacion(false);
  }
};

  // Finalizar conversación al cerrar
  const closeChat = async () => {
    // Finalizar conversación en BD
    if (conversacionActual) {
      try {
        await conversacionApi.finalizarConversacion(conversacionActual.idConversacion);
        console.log('✅ Conversación finalizada');
      } catch (error) {
        console.error('Error finalizando conversación:', error);
      }
    }

    setChatMode(null);
    stopDetection();
    setMessages([]);
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
    <div className="translator-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Traductor</h1>
          <p className="page-subtitle">Traduce señas en tiempo real</p>
        </div>
        <div className="header-badge">
          <span className="level-badge">✨ Nivel 3</span>
          <button className="notification-btn">
            🔔
            <span className="notification-dot"></span>
          </button>
        </div>
      </div>

      <div className="translator-container">
        <h2 className="section-title">Traductor en Vivo</h2>
        <p className="section-description">
          Traduce señas a texto o texto a señas en tiempo real
        </p>

        {!chatMode && (
          <>
            <div className="webcam-card">
              <div className="webcam-wrapper">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="webcam-feed"
                />
                <div className="webcam-overlay">
                  <button className="camera-switch-btn">
                    📷
                  </button>
                </div>
              </div>
            </div>

            <div className="controls-section">
              <div className="input-card">
                <p className="input-label">O escribe para traducir a señas</p>
                <textarea
                  className="text-input"
                  placeholder="Escribe aquí lo que quieres traducir a señas..."
                  rows="3"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
              </div>

              <button className="show-signs-btn" onClick={handleSendText}>
                ▶ Mostrar Señas
              </button>
            </div>

            <div className="options-grid">
              <button className="option-card" onClick={openVideoChat}>
                <span className="option-icon">🎥</span>
                <span className="option-text">Video Chat</span>
              </button>
              <button className="option-card" onClick={openVoiceChat}>
                <span className="option-icon">🎤</span>
                <span className="option-text">Voz a Señas</span>
              </button>
            </div>
          </>
        )}

        {chatMode && (
          <div className="chat-interface">
            <div className="chat-header">
              <div className="chat-header-info">
                <span className="chat-icon">{chatMode === 'video' ? '🎥' : '🎤'}</span>
                <div>
                  <h3>{chatMode === 'video' ? 'Video Chat' : 'Voz a Señas'}</h3>
                  <p className="chat-status">{status}</p>
                  {conversacionActual && (
                    <p className="chat-id">ID: {conversacionActual.idConversacion}</p>
                  )}
                </div>
              </div>
              <div className="chat-header-actions">
                <button 
                  className={`save-chat-btn ${conversacionActual?.guardada ? 'saved' : ''}`}
                  onClick={guardarConversacion}
                  disabled={guardandoConversacion || !conversacionActual}
                  title="Guardar conversación"
                >
                  {guardandoConversacion ? '⏳' : conversacionActual?.guardada ? '✅' : '💾'}
                  {guardandoConversacion ? ' Guardando...' : conversacionActual?.guardada ? ' Guardada' : ' Guardar'}
                </button>
                <button className="close-chat-btn" onClick={closeChat}>
                  ✕
                </button>
              </div>
            </div>

            <div className="chat-layout">
              {chatMode === 'video' && (
                <div className="chat-video-preview">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="chat-webcam"
                  />
                  {handDetected && (
                    <div className="chat-hand-indicator">
                      ✋ Detectando
                    </div>
                  )}
                </div>
              )}

              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div className="chat-empty">
                    <span className="chat-empty-icon">💬</span>
                    <p>
                      {chatMode === 'video' 
                        ? 'Haz una seña para comenzar la conversación'
                        : 'Habla para convertir tu voz en señas'}
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div key={msg.id} className={`chat-message ${msg.type}`}>
                        <div className="message-content">
                          {msg.type === 'sign' && <span className="message-icon">🤟</span>}
                          {msg.type === 'voice' && <span className="message-emoji">{msg.content}</span>}
                          {msg.type === 'text' && <span className="message-text">{msg.content}</span>}
                          {msg.type === 'sign' && <span className="message-sign">{msg.content.toUpperCase()}</span>}
                        </div>
                        <span className="message-time">{msg.timestamp}</span>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </>
                )}
              </div>

              <div className="chat-input-area">
                {chatMode === 'video' && (
                  <div className="chat-controls">
                    <button 
                      className={`chat-control-btn ${isDetecting ? 'active' : ''}`}
                      onClick={isDetecting ? stopDetection : startDetection}
                    >
                      {isDetecting ? '⏸️ Pausar' : '▶️ Detectar'}
                    </button>
                    <div className="detection-info">
                      <span>Progreso: {sequenceProgress}/30</span>
                      {detectedSign && (
                        <span className="last-sign">Última: {detectedSign}</span>
                      )}
                    </div>
                  </div>
                )}

                {chatMode === 'voice' && (
                  <div className="voice-controls">
                    <button className="voice-btn" onClick={handleVoiceToSign}>
                      🎤 Mantén presionado para hablar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!chatMode && (
          <button
            onClick={connectToServer}
            disabled={isConnected}
            className={`floating-connect-btn ${isConnected ? 'connected' : ''}`}
          >
            {isConnected ? '✅ Conectado' : '🔌 Conectar Servidor'}
          </button>
        )}

        <button className="help-button">
          ❓
        </button>
      </div>
    </div>
  );
}

export default Translator;