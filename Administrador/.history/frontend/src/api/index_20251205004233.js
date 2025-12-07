// ============================================
// ARCHIVO: src/api/index.js
// Ubicación: frontend/src/api/index.js
// ============================================
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ============================================
// API DE USUARIOS
// ============================================
export const usuariosAPI = {
  getAll: (params) => api.get('/usuarios', { params }),
  getById: (id) => api.get(`/usuarios/${id}`),
  create: (data) => api.post('/usuarios', data),
  update: (id, data) => api.put(`/usuarios/${id}`, data),
  delete: (id) => api.delete(`/usuarios/${id}`),
  eliminarLogico: (id) => api.put(`/usuarios/${id}/eliminar-logico`),
  cambiarEstado: (id, activo) => api.put(`/usuarios/${id}/estado`, { activo }),
  getEstadisticas: () => api.get('/usuarios/estadisticas'),
}

// ============================================
// API DE DICCIONARIO
// ============================================
export const diccionarioAPI = {
  // Categorías
  categorias: {
    getAll: (params) => api.get('/categorias', { params }),
    getById: (id) => api.get(`/categorias/${id}`),
    create: (data) => api.post('/categorias', data),
    update: (id, data) => api.put(`/categorias/${id}`, data),
    delete: (id) => api.delete(`/categorias/${id}`),
  },
  
  // Señas
  señas: {
    getAll: (params) => api.get('/senas', { params }),
    getById: (id) => api.get(`/senas/${id}`),
    create: (data) => api.post('/senas', data),
    update: (id, data) => api.put(`/senas/${id}`, data),
    delete: (id) => api.delete(`/senas/${id}`),
  },
}

export default api