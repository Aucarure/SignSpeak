import api from './axios'

export const diccionarioAPI = {
  // Categorías
  categorias: {
    getAll: (params = {}) => api.get('/diccionario/categorias/', { params }),
    getById: (id) => api.get(`/diccionario/categorias/${id}/`),
    create: (data) => api.post('/diccionario/categorias/', data),
    update: (id, data) => api.put(`/diccionario/categorias/${id}/`, data),
    delete: (id) => api.delete(`/diccionario/categorias/${id}/`),
  },
  
  // Señas
  señas: {
    getAll: (params = {}) => api.get('/diccionario/señas/', { params }),
    getById: (id) => api.get(`/diccionario/señas/${id}/`),
    create: (data) => api.post('/diccionario/señas/', data),
    update: (id, data) => api.put(`/diccionario/señas/${id}/`, data),
    delete: (id) => api.delete(`/diccionario/señas/${id}/`),
    
    // Acciones especiales
    porCategoria: () => api.get('/diccionario/señas/por_categoria/'),
    masPracticadas: () => api.get('/diccionario/señas/mas_practicadas/'),
    masPopulares: () => api.get('/diccionario/señas/mas_populares/'),
    incrementarPracticas: (id) => api.post(`/diccionario/señas/${id}/incrementar_practicas/`),
  }
}