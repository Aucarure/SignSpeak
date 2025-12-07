// ========================================
// API para WebSocket (IA - Detección de señas)
// ========================================
class SignDetectionAPI {
  constructor() {
    this.ws = null;
    this.wsUrl = 'ws://localhost:8000/ws/detect';
  }

  connect(onMessage, onError) {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        console.log('✅ Conectado al servidor de IA');
        resolve();
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onMessage(data);
      };

      this.ws.onerror = (error) => {
        console.error('❌ Error WebSocket:', error);
        onError(error);
      };

      this.ws.onclose = () => {
        console.log('🔌 Desconectado del servidor de IA');
      };
    });
  }

  sendFrame(imageBase64) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ image: imageBase64 }));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default new SignDetectionAPI();