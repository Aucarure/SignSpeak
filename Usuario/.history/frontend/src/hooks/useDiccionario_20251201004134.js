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

 // Cargar señas (Paginación base)
 const cargarSenas = async (pagina = 0, tamanoPagina = pagination.size) => {
  try {
   setLoading(true);
   setError(null);
   // Usa el tamaño de página que se le pasa o el que está en el state (por defecto 20)
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

 // Buscar señas (AJUSTADO: se añade tamanoPagina como argumento)
 const buscarSenas = async (query, pagina = 0, tamanoPagina = pagination.size) => {
  try {
   setLoading(true);
   setError(null);
   // Se usa tamanoPagina del argumento
   const response = await diccionarioAPI.buscarSenas(query, pagina, tamanoPagina);
   
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

 // Filtrar señas (Usa tamanoPagina del objeto filtros)
 const filtrarSenas = async (filtros) => {
  try {
   setLoading(true);
   setError(null);
   // Asumimos que filtros ya contiene { pagina, tamanoPagina }
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