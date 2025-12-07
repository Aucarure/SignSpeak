import axios from 'axios';

const API_URL = 'http://localhost:8081/api/v1/conversaciones';

class ConversacionAPI {
  
  // Crear nueva conversación
  async crearConversacion(idUsuario, titulo = 'Conversación sin título') {
    try {
      const response = await axios.post(API_URL, {
        idUsuario,
        titulo
      });
      console.log('✅ Conversación creada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando conversación:', error);
      throw error;
    }
  }

  // Agregar mensaje a conversación
  async agregarMensaje(idConversacion, mensaje) {
    try {
      const response = await axios.post(`${API_URL}/mensaje`, {
        idConversacion,
        tipoMensaje: mensaje.tipoMensaje || 'seña_detectada',
        contenidoTexto: mensaje.contenidoTexto || null,
        señaDetectada: mensaje.señaDetectada || null,
        confianzaDeteccion: mensaje.confianzaDeteccion || null
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error agregando mensaje:', error);
      throw error;
    }
  }

  // Guardar conversación (CA-17) ⭐
  async guardarConversacion(idConversacion) {
    try {
      const response = await axios.put(`${API_URL}/${idConversacion}/guardar`);
      console.log('✅ Conversación guardada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error guardando conversación:', error);
      throw error;
    }
  }

  // Finalizar conversación
  async finalizarConversacion(idConversacion) {
    try {
      const response = await axios.put(`${API_URL}/${idConversacion}/finalizar`);
      console.log('✅ Conversación finalizada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error finalizando conversación:', error);
      throw error;
    }
  }

  // Listar conversaciones del usuario
  async listarConversaciones(idUsuario) {
    try {
      const response = await axios.get(`${API_URL}/usuario/${idUsuario}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error listando conversaciones:', error);
      throw error;
    }
  }

  // Listar solo conversaciones guardadas
  async listarConversacionesGuardadas(idUsuario) {
    try {
      const response = await axios.get(`${API_URL}/usuario/${idUsuario}/guardadas`);
      return response.data;
    } catch (error) {
      console.error('❌ Error listando conversaciones guardadas:', error);
      throw error;
    }
  }

  // Obtener conversación específica
  async obtenerConversacion(idConversacion) {
    try {
      const response = await axios.get(`${API_URL}/${idConversacion}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo conversación:', error);
      throw error;
    }
  }

  // Eliminar conversación
  async eliminarConversacion(idConversacion) {
    try {
      await axios.delete(`${API_URL}/${idConversacion}`);
      console.log('✅ Conversación eliminada');
      return true;
    } catch (error) {
      console.error('❌ Error eliminando conversación:', error);
      throw error;
    }
  }
}

export default new ConversacionAPI();