import api from './axios'

export const usuariosAPI = {
  // Listar todos los usuarios
  getAll: (params = {}) => api.get('/usuarios/', { params }),
  
  // Obtener un usuario por ID
  getById: (id) => api.get(`/usuarios/${id}/`),
  
  // Crear usuario
  create: (data) => api.post('/usuarios/', data),
  
  // Actualizar usuario
  update: (id, data) => api.put(`/usuarios/${id}/`, data),
  
  // Actualizar parcialmente
  patch: (id, data) => api.patch(`/usuarios/${id}/`, data),
  
  // Eliminar usuario
  delete: (id) => api.delete(`/usuarios/${id}/`),
  
  // Estadísticas
  getEstadisticas: () => api.get('/usuarios/estadisticas/'),
  
  // Cambiar estado
  cambiarEstado: (id, activo) => api.post(`/usuarios/${id}/cambiar_estado/`, { activo }),
  
  // Eliminar lógicamente
  eliminarLogico: (id) => api.post(`/usuarios/${id}/eliminar_logico/`),
  
  // Configuración de usuario
  getConfiguracion: (id) => api.get(`/usuarios/${id}/configuracion/`),
  updateConfiguracion: (id, data) => api.put(`/usuarios/${id}/configuracion/`, data),
  
  // Registros recientes
  getRecientes: () => api.get('/usuarios/registro_reciente/'),
}
