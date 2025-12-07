// src/api/ejercicios.js
import api from './axios';

// ============================================
// EJERCICIOS
// ============================================

export const ejerciciosAPI = {
  // Obtener todos los ejercicios
  getAll: (params = {}) => {
    return api.get('/ejercicios/ejercicios/', { params });
  },

  // Obtener un ejercicio por ID
  getById: (id) => {
    return api.get(`/ejercicios/ejercicios/${id}/`);
  },

  // Crear nuevo ejercicio
  create: (data) => {
    return api.post('/ejercicios/ejercicios/', data);
  },

  // Actualizar ejercicio
  update: (id, data) => {
    return api.put(`/ejercicios/ejercicios/${id}/`, data);
  },

  // Actualizar parcialmente
  partialUpdate: (id, data) => {
    return api.patch(`/ejercicios/ejercicios/${id}/`, data);
  },

  // Eliminar ejercicio
  delete: (id) => {
    return api.delete(`/ejercicios/ejercicios/${id}/`);
  },

  // Obtener ejercicios por tipo
  getPorTipo: () => {
    return api.get('/ejercicios/ejercicios/por_tipo/');
  },

  // Obtener ejercicios por dificultad
  getPorDificultad: () => {
    return api.get('/ejercicios/ejercicios/por_dificultad/');
  },
};

// ============================================
// SESIONES DE PRÁCTICA
// ============================================

export const sesionesAPI = {
  // Obtener todas las sesiones
  getAll: (params = {}) => {
    return api.get('/ejercicios/sesiones/', { params });
  },

  // Obtener una sesión por ID
  getById: (id) => {
    return api.get(`/ejercicios/sesiones/${id}/`);
  },

  // Crear nueva sesión
  create: (data) => {
    return api.post('/ejercicios/sesiones/', data);
  },

  // Actualizar sesión
  update: (id, data) => {
    return api.put(`/ejercicios/sesiones/${id}/`, data);
  },

  // Completar sesión
  completar: (id) => {
    return api.post(`/ejercicios/sesiones/${id}/completar/`);
  },

  // Obtener sesiones por usuario
  getPorUsuario: (usuarioId) => {
    return api.get('/ejercicios/sesiones/por_usuario/', {
      params: { usuario_id: usuarioId }
    });
  },

  // Obtener estadísticas de usuario
  getEstadisticasUsuario: (usuarioId) => {
    return api.get('/ejercicios/sesiones/estadisticas_usuario/', {
      params: { usuario_id: usuarioId }
    });
  },

  // Eliminar sesión
  delete: (id) => {
    return api.delete(`/ejercicios/sesiones/${id}/`);
  },
};