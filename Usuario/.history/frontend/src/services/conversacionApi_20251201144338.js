/**
 * Servicio para manejar conversaciones en la base de datos
 */
class ConversacionApiService {
  constructor() {
    this.baseUrl = 'http://localhost:3000/api'; // URL de tu backend de conversaciones
  }

  /**
   * Crear nueva conversación
   */
  async crearConversacion(idUsuario, titulo) {
    try {
      const response = await fetch(`${this.baseUrl}/conversaciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idUsuario,
          titulo,
          fechaInicio: new Date().toISOString(),
          activa: true
        })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error creando conversación:', error);
      throw error;
    }
  }

  /**
   * Agregar mensaje a conversación
   */
  async agregarMensaje(idConversacion, mensajeData) {
    try {
      const response = await fetch(`${this.baseUrl}/conversaciones/${idConversacion}/mensajes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...mensajeData,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error agregando mensaje:', error);
      throw error;
    }
  }

  /**
   * Guardar/desguardar conversación
   */
  async guardarConversacion(idConversacion, guardada) {
    try {
      const response = await fetch(`${this.baseUrl}/conversaciones/${idConversacion}/guardar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guardada })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error guardando conversación:', error);
      throw error;
    }
  }

  /**
   * Finalizar conversación
   */
  async finalizarConversacion(idConversacion) {
    try {
      const response = await fetch(`${this.baseUrl}/conversaciones/${idConversacion}/finalizar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activa: false,
          fechaFin: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error finalizando conversación:', error);
      throw error;
    }
  }

  /**
   * Obtener conversaciones del usuario
   */
  async obtenerConversaciones(idUsuario) {
    try {
      const response = await fetch(`${this.baseUrl}/usuarios/${idUsuario}/conversaciones`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error obteniendo conversaciones:', error);
      throw error;
    }
  }

  /**
   * Obtener mensajes de una conversación
   */
  async obtenerMensajes(idConversacion) {
    try {
      const response = await fetch(`${this.baseUrl}/conversaciones/${idConversacion}/mensajes`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error obteniendo mensajes:', error);
      throw error;
    }
  }

  /**
   * Cambiar URL base
   */
  setBaseUrl(url) {
    this.baseUrl = url;
    console.log(`🔧 URL base cambiada a: ${url}`);
  }
}

// Exportar una instancia única
const conversacionApi = new ConversacionApiService();
export default conversacionApi;