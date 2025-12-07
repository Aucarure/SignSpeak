import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import api from '../services/api';
import conversacionApi from '../services/conversacionApi';
import './Translator.css';

function Translator() {
  const webcamRef = useRef(null);
  const chatEndRef = useRef(null);
  const intervalRef = useRef(null);
  
  // Estados de detección
  const [detectedSign, setDetectedSign] = useState('');
  const [lastAddedSign, setLastAddedSign] = useState('');
  const [lastSignTime, setLastSignTime] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [status, setStatus] = useState('Listo para comenzar');
  const [isConnected, setIsConnected] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [sequenceProgress, setSequenceProgress] = useState(0);
  
  // Estados de chat
  const [chatMode, setChatMode] = useState(null); // 'video', 'voice', o null
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState('');
  
  // Estados de conversación
  const [conversacionActual, setConversacionActual] = useState(null);
  const [guardandoConversacion, setGuardandoConversacion] = useState(false);
  const [serverInfo, setServerInfo] = useState(null);
  
  // Configuración
  const SIGN_COOLDOWN = 2000; // 2 segundos entre señas
  const FRAME_INTERVAL = 100; // Enviar frames cada 100ms
  const idUsuario = 1; // Cambiar según autenticación

  // Efecto para scroll automático
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Efecto de limpieza
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      api.disconnect();
    };
  }, []);

  /**
   * Conectar al servidor de IA
   */
  const connectToServer = useCallback(async () => {
    try {
      // Primero verificar que el servidor esté disponible
      setStatus('🔄 Verificando conexión con el servidor...');
      
      const health = await api.checkHealth();
      console.log('✅ Salud del servidor:', health);
      
      if (health.status !== 'healthy') {
        throw new Error('Servidor no está saludable');
      }

      // Obtener información del servidor
      const info = await api.getServerInfo();
      setServerInfo(info.model_info);
      console.log('📊 Información del servidor:', info);

      // Conectar WebSocket
      await api.connect(
        // Callback para mensajes exitosos
        (data) => {
          handleWebSocketMessage(data);
        },
        // Callback para errores
        (error) => {
          console.error('❌ Error en WebSocket:', error);
          setStatus('❌ Error de conexión con el servidor');
          setIsConnected(false);
          setIsDetecting(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      );

      setIsConnected(true);
      setStatus('✅ Conectado al servidor de IA');
      
    } catch (error) {
      console.error('❌ Error conectando al servidor:', error);
      setStatus(`❌ Error: ${error.message}`);
      setIsConnected(false);
    }
  }, []);

  /**
   * Manejar mensajes del WebSocket
   */
  const handleWebSocketMessage = useCallback((data) => {
    // Log para debugging
    console.log('📥 Datos recibidos del servidor:', data);

    const newSign = data.prediction || '';
    const newConfidence = data.confidence || 0;
    const currentTime = Date.now();
    
    setConfidence(newConfidence);
    setHandDetected(data.hand_detected || false);
    setSequenceProgress(data.sequence_progress || 0);
    
    if (data.error) {
      setStatus(`⚠️ ${data.error}`);
      return;
    }

    if (newSign && newConfidence > 0.6) {
      setDetectedSign(newSign);
      setStatus(`✅ Detectado: ${newSign} (${(newConfidence * 100).toFixed(1)}%)`);
      
      // Verificar si debemos agregar al chat
      const isDifferentSign = newSign !== lastAddedSign;
      const hasTimeElapsed = (currentTime - lastSignTime) > SIGN_COOLDOWN;
      
      if (isDifferentSign || (newSign === lastAddedSign && hasTimeElapsed)) {
        addMessageToChat(newSign, 'sign', newConfidence);
        setLastAddedSign(newSign);
        setLastSignTime(currentTime);
      }
      
    } else if (data.hand_detected) {
      setStatus(`🔄 Procesando: ${data.sequence_progress || 0}/30 frames`);
    } else {
      setStatus('👋 Muestra tus manos a la cámara');
    }
  }, [lastAddedSign, lastSignTime]);

  /**
   * Iniciar detección continua
   */
  const startDetection = useCallback(() => {
    if (!api.isConnected()) {
      alert('⚠️ Primero conecta al servidor');
      return;
    }

    setIsDetecting(true);
    setStatus('🎥 Detectando señas...');

    // Limpiar intervalo anterior si existe
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Configurar intervalo para enviar frames
    intervalRef.current = setInterval(() => {
      if (webcamRef.current && api.isConnected()) {
        try {
          const imageSrc = webcamRef.current.getScreenshot();
          if (imageSrc) {
            api.sendFrame(imageSrc);
          }
        } catch (error) {
          console.error('❌ Error capturando frame:', error);
        }
      }
    }, FRAME_INTERVAL);

  }, []);

  /**
   * Detener detección
   */
  const stopDetection = useCallback(() => {
    setIsDetecting(false);
    setStatus('⏸️ Detección pausada');
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Agregar mensaje al chat y guardar en BD
   */
  const addMessageToChat = useCallback(async (content, type, confianza = null) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      content,
      type,
      confianza,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);

    // Guardar en BD si hay conversación activa
    if (conversacionActual && type === 'sign') {
      try {
        await conversacionApi.agregarMensaje(conversacionActual.idConversacion, {
          tipoMensaje: 'seña_detectada',
          señaDetectada: content,
          confianzaDeteccion: confianza,
          timestamp: new Date().toISOString()
        });
        console.log('💾 Mensaje guardado en BD');
      } catch (error) {
        console.error('❌ Error guardando mensaje:', error);
      }
    }
  }, [conversacionActual]);

  /**
   * Enviar texto como mensaje
   */
  const handleSendText = useCallback(async () => {
    if (textInput.trim()) {
      addMessageToChat(textInput, 'text');
      
      // Guardar en BD si hay conversación
      if (conversacionActual) {
        try {
          await conversacionApi.agregarMensaje(conversacionActual.idConversacion, {
            tipoMensaje: 'texto',
            contenidoTexto: textInput,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          console.error('❌ Error guardando texto:', error);
        }
      }
      
      setTextInput('');
    }
  }, [textInput, conversacionActual, addMessageToChat]);

  /**
   * Simular voz a señas (placeholder)
   */
  const handleVoiceToSign = useCallback(() => {
    // Esta es una simulación - en producción usarías un servicio de voz
    const signEmojis = ['👋 Hola', '🙏 Gracias', '👍 Sí', '👎 No', '🤲 Ayuda', '🤝 Por favor'];
    const randomSign = signEmojis[Math.floor(Math.random() * signEmojis.length)];
    addMessageToChat(randomSign, 'voice');
  }, [addMessageToChat]);

  /**
   * Abrir chat de video
   */
  const openVideoChat = useCallback(async () => {
    try {
      setChatMode('video');
      setMessages([]);
      setLastAddedSign('');
      setLastSignTime(0);

      // Crear nueva conversación en BD
      const nuevaConversacion = await conversacionApi.crearConversacion(
        idUsuario,
        `Video Chat - ${new Date().toLocaleString('es-ES')}`
      );
      
      setConversacionActual(nuevaConversacion);
      console.log('💾 Conversación creada:', nuevaConversacion);

      // Conectar y comenzar detección
      if (!isConnected) {
        await connectToServer();
      }
      
      if (!isDetecting) {
        startDetection();
      }

    } catch (error) {
      console.error('❌ Error abriendo video chat:', error);
      alert('No se pudo iniciar el video chat. Verifica la conexión.');
    }
  }, [isConnected, isDetecting, connectToServer, startDetection]);

  /**
   * Abrir chat de voz
   */
  const openVoiceChat = useCallback(async () => {
    try {
      setChatMode('voice');
      setMessages([]);

      // Crear conversación para voz
      const nuevaConversacion = await conversacionApi.crearConversacion(
        idUsuario,
        `Voz a Señas - ${new Date().toLocaleString('es-ES')}`
      );
      
      setConversacionActual(nuevaConversacion);
      
      // Para voz, no necesitamos conectar al servidor de IA
      setStatus('🎤 Listo para convertir voz a señas');

    } catch (error) {
      console.error('❌ Error abriendo chat de voz:', error);
      alert('No se pudo iniciar el chat de voz.');
    }
  }, []);

  /**
   * Guardar/desguardar conversación
   */
  const guardarConversacion = useCallback(async () => {
    if (!conversacionActual) {
      alert('⚠️ No hay conversación activa');
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
      alert(nuevoEstado ? '✅ Conversación guardada' : '📌 Marcador removido');
      
    } catch (error) {
      console.error('❌ Error guardando conversación:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setGuardandoConversacion(false);
    }
  }, [conversacionActual]);

  /**
   * Cerrar chat y finalizar conversación
   */
  const closeChat = useCallback(async () => {
    // Finalizar en BD
    if (conversacionActual) {
      try {
        await conversacionApi.finalizarConversacion(conversacionActual.idConversacion);
        console.log('💾 Conversación finalizada');
      } catch (error) {
        console.error('❌ Error finalizando conversación:', error);
      }
    }

    // Limpiar estado
    setChatMode(null);
    stopDetection();
    setMessages([]);
    setLastAddedSign('');
    setLastSignTime(0);
    setConversacionActual(null);
    setStatus('Listo para comenzar');
  }, [conversacionActual, stopDetection]);

  // Configuración de video
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user',
    frameRate: { ideal: 30, max: 30 }
  };

  return (
    <div className="translator-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Traductor de Señas</h1>
          <p className="page-subtitle">Conectado a IA en tiempo real</p>
          {serverInfo && (
            <div className="server-info">
              <small>
                Modelo: {serverInfo.classes?.length || 0} señas | 
                Confianza: {(serverInfo.confidence_threshold * 100).toFixed(0)}%
              </small>
            </div>
          )}
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
          Traduce señas a texto o texto a señas usando IA
        </p>

        {!chatMode && (
          <>
            {/* Webcam y controles principales */}
            <div className="webcam-card">
              <div className="webcam-wrapper">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="webcam-feed"
                  screenshotQuality={0.8}
                />
                <div className="webcam-overlay">
                  <div className="status-indicator">
                    <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
                    {isConnected ? 'Conectado' : 'Desconectado'}
                  </div>
                </div>
              </div>
              
              <div className="webcam-controls">
                <button
                  onClick={connectToServer}
                  disabled={isConnected}
                  className={`connect-btn ${isConnected ? 'connected' : ''}`}
                >
                  {isConnected ? '✅ Conectado' : '🔌 Conectar IA'}
                </button>
                
                {isConnected && (
                  <div className="detection-status">
                    <span>Progreso: {sequenceProgress}/30</span>
                    {handDetected && <span className="hand-indicator">✋ Mano detectada</span>}
                    {detectedSign && <span className="sign-indicator">🤟 {detectedSign}</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Entrada de texto */}
            <div className="input-section">
              <div className="input-card">
                <p className="input-label">Texto a señas</p>
                <textarea
                  className="text-input"
                  placeholder="Escribe texto para convertir a señas..."
                  rows="3"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendText()}
                />
                <div className="input-actions">
                  <button className="show-signs-btn" onClick={handleSendText}>
                    ▶ Mostrar Señas
                  </button>
                  <button className="voice-input-btn" onClick={handleVoiceToSign}>
                    🎤 Voz a Texto
                  </button>
                </div>
              </div>
            </div>

            {/* Modos de chat */}
            <div className="chat-modes">
              <h3>Iniciar Conversación</h3>
              <div className="options-grid">
                <button className="option-card" onClick={openVideoChat}>
                  <span className="option-icon">🎥</span>
                  <span className="option-title">Video Chat</span>
                  <span className="option-description">Señas en tiempo real</span>
                </button>
                
                <button className="option-card" onClick={openVoiceChat}>
                  <span className="option-icon">🎤</span>
                  <span className="option-title">Voz a Señas</span>
                  <span className="option-description">Habla y ve señas</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Interfaz de chat activa */}
        {chatMode && (
          <div className="chat-interface">
            {/* Header del chat */}
            <div className="chat-header">
              <div className="chat-header-info">
                <span className="chat-icon">{chatMode === 'video' ? '🎥' : '🎤'}</span>
                <div>
                  <h3>{chatMode === 'video' ? 'Video Chat' : 'Voz a Señas'}</h3>
                  <p className="chat-status">{status}</p>
                  {conversacionActual && (
                    <p className="chat-meta">
                      ID: {conversacionActual.idConversacion} | 
                      {conversacionActual.guardada ? ' 💾 Guardada' : ' 📝 Sin guardar'}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="chat-header-actions">
                <button 
                  className={`save-btn ${conversacionActual?.guardada ? 'saved' : ''}`}
                  onClick={guardarConversacion}
                  disabled={guardandoConversacion}
                  title={conversacionActual?.guardada ? 'Remover de guardados' : 'Guardar conversación'}
                >
                  {guardandoConversacion ? '⏳' : conversacionActual?.guardada ? '✅' : '💾'}
                  {guardandoConversacion ? ' Guardando...' : ' Guardar'}
                </button>
                
                <button className="close-btn" onClick={closeChat}>
                  ✕ Cerrar
                </button>
              </div>
            </div>

            {/* Contenido del chat */}
            <div className="chat-content">
              {chatMode === 'video' && (
                <div className="chat-video-panel">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="chat-webcam"
                  />
                  <div className="video-controls">
                    <button 
                      className={`detect-btn ${isDetecting ? 'active' : ''}`}
                      onClick={isDetecting ? stopDetection : startDetection}
                    >
                      {isDetecting ? '⏸️ Pausar' : '▶️ Detectar'}
                    </button>
                    <div className="video-info">
                      {handDetected && <span className="hand-badge">✋ Mano detectada</span>}
                      <span className="progress">Frames: {sequenceProgress}/30</span>
                      {confidence > 0 && (
                        <span className="confidence">Confianza: {(confidence * 100).toFixed(1)}%</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Mensajes */}
              <div className="chat-messages-panel">
                <div className="messages-container">
                  {messages.length === 0 ? (
                    <div className="empty-chat">
                      <span className="empty-icon">💬</span>
                      <p>
                        {chatMode === 'video' 
                          ? 'Comienza haciendo señas a la cámara'
                          : 'Habla o escribe para comenzar'}
                      </p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg) => (
                        <div key={msg.id} className={`message-bubble ${msg.type}`}>
                          <div className="message-header">
                            {msg.type === 'sign' && <span className="message-icon">🤟</span>}
                            {msg.type === 'voice' && <span className="message-icon">🎤</span>}
                            {msg.type === 'text' && <span className="message-icon">📝</span>}
                            <span className="message-time">{msg.timestamp}</span>
                            {msg.confianza && (
                              <span className="message-confidence">
                                {(msg.confianza * 100).toFixed(0)}%
                              </span>
                            )}
                          </div>
                          <div className="message-body">
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </>
                  )}
                </div>

                {/* Input según modo */}
                <div className="chat-input-panel">
                  {chatMode === 'video' ? (
                    <div className="detection-controls">
                      <button 
                        className={`control-btn ${isDetecting ? 'stop' : 'start'}`}
                        onClick={isDetecting ? stopDetection : startDetection}
                      >
                        {isDetecting ? '⏸️ Pausar Detección' : '▶️ Iniciar Detección'}
                      </button>
                      <div className="current-sign">
                        {detectedSign && `Última seña: ${detectedSign}`}
                      </div>
                    </div>
                  ) : (
                    <div className="voice-input-controls">
                      <button className="voice-btn" onClick={handleVoiceToSign}>
                        🎤 Mantén para hablar
                      </button>
                      <div className="text-input-group">
                        <input
                          type="text"
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          placeholder="O escribe texto..."
                          onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                        />
                        <button onClick={handleSendText}>➤</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estado del sistema */}
        <div className="system-status">
          <div className="status-card">
            <h4>Estado del Sistema</h4>
            <div className="status-items">
              <div className="status-item">
                <span className="status-label">Servidor IA:</span>
                <span className={`status-value ${isConnected ? 'online' : 'offline'}`}>
                  {isConnected ? '✅ Conectado' : '❌ Desconectado'}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Detección:</span>
                <span className={`status-value ${isDetecting ? 'active' : 'inactive'}`}>
                  {isDetecting ? '🎥 Activa' : '⏸️ Inactiva'}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Manos detectadas:</span>
                <span className={`status-value ${handDetected ? 'yes' : 'no'}`}>
                  {handDetected ? '✅ Sí' : '❌ No'}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Mensajes:</span>
                <span className="status-value">{messages.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Translator;