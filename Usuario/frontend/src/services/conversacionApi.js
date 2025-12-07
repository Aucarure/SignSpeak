import axios from 'axios';

const API_URL = 'http://localhost:8081/api/conversaciones'; 
class ConversacionAPI {
  
  // Crear nueva conversación
  async crearConversacion(idUsuario, titulo = 'Conversación sin título') {
    try {
      const response = await axios.post(API_URL, {
        idUsuario,
        tituloConversacion: titulo // ✅ Cambiar 'titulo' a 'tituloConversacion'
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
      // ✅ Cambiar ruta a /{id}/mensajes
      const response = await axios.post(`${API_URL}/${idConversacion}/mensajes`, {
        tipoMensaje: mensaje.tipoMensaje || 'seña_detectada',
        contenidoTexto: mensaje.contenidoTexto || null,
        idSenaDetectada: mensaje.señaDetectada || null, // ✅ Cambiar nombre
        confianzaDeteccion: mensaje.confianzaDeteccion || null
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error agregando mensaje:', error);
      throw error;
    }
  }

  // Guardar conversación (CA-17) ⭐
  async guardarConversacion(idConversacion, guardada = true) {
    try {
      // ✅ Agregar parámetro 'guardada'
      const response = await axios.put(`${API_URL}/${idConversacion}/guardar?guardada=${guardada}`);
      console.log('✅ Conversación guardada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error guardando conversación:', error);
      throw error;
    }
  }

  // Finalizar conversación
  async finalizarConversacion(idConversacion, resumen = null) {
    try {
      const body = resumen ? { resumenConversacion: resumen } : {};
      const response = await axios.put(`${API_URL}/${idConversacion}/finalizar`, body);
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

  // Obtener conversación específica con todos sus mensajes
  async obtenerConversacion(idConversacion) {
    try {
      // ✅ Usar /completa para obtener con mensajes
      const response = await axios.get(`${API_URL}/${idConversacion}/completa`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo conversación:', error);
      throw error;
    }
  }

  // Obtener solo los mensajes de una conversación
  async obtenerMensajes(idConversacion) {
    try {
      const response = await axios.get(`${API_URL}/${idConversacion}/mensajes`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo mensajes:', error);
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

  // Contar conversaciones activas
  async contarConversacionesActivas(idUsuario) {
    try {
      const response = await axios.get(`${API_URL}/usuario/${idUsuario}/count`);
      return response.data;
    } catch (error) {
      console.error('❌ Error contando conversaciones:', error);
      throw error;
    }
  }
}

export default new ConversacionAPI();