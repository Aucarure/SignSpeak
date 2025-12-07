import axios from 'axios';

const API_URL = 'http://localhost:8081/api/diccionario';

const diccionarioAPI = {
  getCategorias: async (soloActivas = true) => {
    const response = await axios.get(`${API_URL}/categorias`, {
      params: { soloActivas }
    });
    return response.data;
  },

  getSenas: async (pagina = 0, tamanoPagina = 20) => {
    const response = await axios.get(`${API_URL}/senas`, {
      params: { pagina, tamanoPagina }
    });
    return response.data;
  },

  getSenaPorId: async (id) => {
    const response = await axios.get(`${API_URL}/senas/${id}`);
    return response.data;
  },

  getSenaPorNombre: async (nombre) => {
    const response = await axios.get(`${API_URL}/senas/nombre/${nombre}`);
    return response.data;
  },

  buscarSenas: async (query, pagina = 0, tamanoPagina = 20) => {
    const response = await axios.get(`${API_URL}/buscar`, {
      params: { q: query, pagina, tamanoPagina }
    });
    return response.data;
  },

  // ✅ CORRECCIÓN: Asegurar que sea POST y enviar data en el body
  filtrarSenas: async (filtros) => {
    const response = await axios.post(`${API_URL}/filtrar`, filtros, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  getSenasPopulares: async (limite = 10) => {
    const response = await axios.get(`${API_URL}/populares`, {
      params: { limite }
    });
    return response.data;
  },

  getSenasMasPracticadas: async (limite = 10) => {
    const response = await axios.get(`${API_URL}/mas-practicadas`, {
      params: { limite }
    });
    return response.data;
  },

  getEstadisticas: async () => {
    const response = await axios.get(`${API_URL}/estadisticas`);
    return response.data;
  }
};

export default diccionarioAPI;