import api from './axios';

// ==========================================
// PROGRESO USUARIO
// ==========================================

const getProgresoUsuarios = async (params = {}) => {
  const response = await api.get('/progreso/progreso/', { params });
  return response.data;
};

const getProgresoUsuario = async (id) => {
  const response = await api.get(`/progreso/progreso/${id}/`);
  return response.data;
};

const getProgresoPorUsuario = async (usuarioId) => {
  const response = await api.get('/progreso/progreso/por_usuario/', {
    params: { usuario_id: usuarioId }
  });
  return response.data;
};

const getEstadisticasUsuario = async (usuarioId) => {
  const response = await api.get('/progreso/progreso/estadisticas_usuario/', {
    params: { usuario_id: usuarioId }
  });
  return response.data;
};

const getRanking = async (limit = 10) => {
  const response = await api.get('/progreso/progreso/ranking/', {
    params: { limit }
  });
  return response.data;
};

const createProgreso = async (data) => {
  const response = await api.post('/progreso/progreso/', data);
  return response.data;
};

const updateProgreso = async (id, data) => {
  const response = await api.put(`/progreso/progreso/${id}/`, data);
  return response.data;
};

const deleteProgreso = async (id) => {
  const response = await api.delete(`/progreso/progreso/${id}/`);
  return response.data;
};

// ==========================================
// HISTORIAL DETECCIONES
// ==========================================

const getDetecciones = async (params = {}) => {
  const response = await api.get('/progreso/detecciones/', { params });
  return response.data;
};

const getDeteccion = async (id) => {
  const response = await api.get(`/progreso/detecciones/${id}/`);
  return response.data;
};

const getDeteccionesPorUsuario = async (usuarioId, page = 1) => {
  const response = await api.get('/progreso/detecciones/por_usuario/', {
    params: { usuario_id: usuarioId, page }
  });
  return response.data;
};

const getEstadisticasDetecciones = async (usuarioId) => {
  const response = await api.get('/progreso/detecciones/estadisticas_detecciones/', {
    params: { usuario_id: usuarioId }
  });
  return response.data;
};

// ==========================================
// ERRORES USUARIO
// ==========================================

const getErrores = async (params = {}) => {
  const response = await api.get('/progreso/errores/', { params });
  return response.data;
};

const getError = async (id) => {
  const response = await api.get(`/progreso/errores/${id}/`);
  return response.data;
};

const getErroresPorUsuario = async (usuarioId, page = 1) => {
  const response = await api.get('/progreso/errores/por_usuario/', {
    params: { usuario_id: usuarioId, page }
  });
  return response.data;
};

const getErroresFrecuentes = async (usuarioId) => {
  const response = await api.get('/progreso/errores/errores_frecuentes/', {
    params: { usuario_id: usuarioId }
  });
  return response.data;
};

// ==========================================
// EXPORTS
// ==========================================

export {
  // Progreso
  getProgresoUsuarios,
  getProgresoUsuario,
  getProgresoPorUsuario,
  getEstadisticasUsuario,
  getRanking,
  createProgreso,
  updateProgreso,
  deleteProgreso,
  // Detecciones
  getDetecciones,
  getDeteccion,
  getDeteccionesPorUsuario,
  getEstadisticasDetecciones,
  // Errores
  getErrores,
  getError,
  getErroresPorUsuario,
  getErroresFrecuentes,
};