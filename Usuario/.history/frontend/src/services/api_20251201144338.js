/**
 * Servicio para conexión con el backend de IA (FastAPI)
 * Maneja WebSocket y peticiones HTTP
 */
class ApiService {
  constructor() {
    this.ws = null;
    this.messageCallback = null;
    this.errorCallback = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.baseUrl = 'http://localhost:8000'; // Cambia según tu backend
  }

  /**
   * Conectar al WebSocket del backend
   */
  connect(messageCallback, errorCallback) {
    this.messageCallback = messageCallback;
    this.errorCallback = errorCallback;

    try {
      // Crear conexión WebSocket
      this.ws = new WebSocket('ws://localhost:8000/ws/detect');

      this.ws.onopen = () => {
        console.log('✅ WebSocket conectado al backend');
        this.reconnectAttempts = 0;
        if (this.messageCallback) {
          this.messageCallback({ 
            success: true, 
            message: 'Conectado al servidor' 
          });
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Log para debugging
          console.log('📥 Datos recibidos:', {
            prediction: data.prediction,
            confidence: data.confidence,
            hand_detected: data.hand_detected,
            sequence_progress: data.sequence_progress
          });

          if (this.messageCallback) {
            this.messageCallback(data);
          }
        } catch (error) {
          console.error('❌ Error parseando mensaje:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ Error en WebSocket:', error);
        if (this.errorCallback) {
          this.errorCallback(error);
        }
      };

      this.ws.onclose = () => {
        console.log('🔌 WebSocket desconectado');
        
        // Intentar reconectar
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`🔄 Reintentando conexión (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          
          setTimeout(() => {
            this.connect(messageCallback, errorCallback);
          }, 3000);
        } else {
          console.error('❌ Máximo de intentos de reconexión alcanzado');
        }
      };

    } catch (error) {
      console.error('❌ Error inicializando WebSocket:', error);
      if (errorCallback) {
        errorCallback(error);
      }
    }
  }

  /**
   * Enviar frame al servidor (WebSocket)
   */
  sendFrame(imageSrc) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('⚠️ WebSocket no está conectado');
      return;
    }

    try {
      // Limpiar el prefijo data:image/jpeg;base64, si existe
      let base64Data = imageSrc;
      if (imageSrc.includes(',')) {
        base64Data = imageSrc.split(',')[1];
      }

      const message = {
        image: base64Data,
        timestamp: new Date().toISOString()
      };

      this.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error('❌ Error enviando frame:', error);
    }
  }

  /**
   * Enviar imagen individual para predicción (HTTP POST)
   * Útil para pruebas o modo single-frame
   */
  async sendImageForPrediction(imageBlob) {
    try {
      const formData = new FormData();
      formData.append('file', imageBlob, 'capture.jpg');

      const response = await fetch(`${this.baseUrl}/api/predict`, {
        method: 'POST',
        body: formData,
        // No establecer Content-Type, FormData lo hace automáticamente
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error enviando imagen:', error);
      throw error;
    }
  }

  /**
   * Obtener información del servidor
   */
  async getServerInfo() {
    try {
      const response = await fetch(`${this.baseUrl}/api/info`);
      return await response.json();
    } catch (error) {
      console.error('❌ Error obteniendo info del servidor:', error);
      throw error;
    }
  }

  /**
   * Verificar salud del servidor
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return await response.json();
    } catch (error) {
      console.error('❌ Error verificando salud del servidor:', error);
      throw error;
    }
  }

  /**
   * Desconectar del WebSocket
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageCallback = null;
    this.errorCallback = null;
    console.log('🔌 Desconectado del servidor');
  }

  /**
   * Verificar estado de conexión
   */
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Cambiar URL base del servidor
   */
  setBaseUrl(url) {
    this.baseUrl = url;
    console.log(`🔧 URL base cambiada a: ${url}`);
  }
}

// Exportar una instancia única
const api = new ApiService();
export default api;