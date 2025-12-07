import axios from 'axios';

const API_URL = 'http://localhost:8080/api/diccionario';

const diccionarioAPI = {
  // Obtener todas las categorías
  getCategorias: async (soloActivas = true) => {
    const response = await axios.get(`${API_URL}/categorias`, {
      params: { soloActivas }
    });
    return response.data;
  },

  // Obtener todas las señas con paginación
  getSenas: async (pagina = 0, tamanoPagina = 20) => {
    const response = await axios.get(`${API_URL}/senas`, {
      params: { pagina, tamanoPagina }
    });
    return response.data;
  },

  // Obtener seña por ID
  getSenaPorId: async (id) => {
    const response = await axios.get(`${API_URL}/senas/${id}`);
    return response.data;
  },

  // Obtener seña por nombre
  getSenaPorNombre: async (nombre) => {
    const response = await axios.get(`${API_URL}/senas/nombre/${nombre}`);
    return response.data;
  },

  // Buscar señas
  buscarSenas: async (query, pagina = 0, tamanoPagina = 20) => {
    const response = await axios.get(`${API_URL}/buscar`, {
      params: { q: query, pagina, tamanoPagina }
    });
    return response.data;
  },

  // Filtrar señas
  filtrarSenas: async (filtros) => {
    const response = await axios.post(`${API_URL}/filtrar`, filtros);
    return response.data;
  },

  // Señas populares
  getSenasPopulares: async (limite = 10) => {
    const response = await axios.get(`${API_URL}/populares`, {
      params: { limite }
    });
    return response.data;
  },

  // Señas más practicadas
  getSenasMasPracticadas: async (limite = 10) => {
    const response = await axios.get(`${API_URL}/mas-practicadas`, {
      params: { limite }
    });
    return response.data;
  },

  // Estadísticas
  getEstadisticas: async () => {
    const response = await axios.get(`${API_URL}/estadisticas`);
    return response.data;
  }
};

export default diccionarioAPI;