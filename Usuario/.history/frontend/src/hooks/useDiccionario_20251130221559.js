import { useState, useEffect } from 'react';
import diccionarioAPI from '../api/diccionario';

export const useDiccionario = () => {
  const [senas, setSenas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 20
  });

  // Cargar categorías
  const cargarCategorias = async () => {
    try {
      setLoading(true);
      const response = await diccionarioAPI.getCategorias();
      if (response.success) {
        setCategorias(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar señas
  const cargarSenas = async (pagina = 0, tamanoPagina = 20) => {
    try {
      setLoading(true);
      setError(null);
      const response = await diccionarioAPI.getSenas(pagina, tamanoPagina);
      
      if (response.success) {
        setSenas(response.data.content);
        setPagination({
          currentPage: response.data.number,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          size: response.data.size
        });
      }
    } catch (err) {
      setError(err.message);
      setSenas([]);
    } finally {
      setLoading(false);
    }
  };

  // Buscar señas
  const buscarSenas = async (query, pagina = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await diccionarioAPI.buscarSenas(query, pagina, pagination.size);
      
      if (response.success) {
        setSenas(response.data.content);
        setPagination({
          currentPage: response.data.number,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          size: response.data.size
        });
      }
    } catch (err) {
      setError(err.message);
      setSenas([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar señas
  const filtrarSenas = async (filtros) => {
    try {
      setLoading(true);
      setError(null);
      const response = await diccionarioAPI.filtrarSenas(filtros);
      
      if (response.success) {
        setSenas(response.data.content);
        setPagination({
          currentPage: response.data.number,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          size: response.data.size
        });
      }
    } catch (err) {
      setError(err.message);
      setSenas([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    senas,
    categorias,
    loading,
    error,
    pagination,
    cargarCategorias,
    cargarSenas,
    buscarSenas,
    filtrarSenas
  };
};