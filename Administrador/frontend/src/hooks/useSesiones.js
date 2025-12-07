// src/hooks/useSesiones.js
import { useState, useCallback } from 'react';
import { sesionesAPI } from '../api/ejercicios';

export const useSesiones = () => {
  const [sesiones, setSesiones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSesiones = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await sesionesAPI.getAll(params);
      // Asegurarnos de que siempre sea un array
      setSesiones(Array.isArray(response.data) ? response.data : []);
      return response.data;
    } catch (err) {
      console.error('Error fetching sesiones:', err);
      setError(err.message);
      setSesiones([]); // Asegurar que sea array vacío en caso de error
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSesionById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await sesionesAPI.getById(id);
      return response.data;
    } catch (err) {
      console.error('Error fetching sesion:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSesion = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await sesionesAPI.create(data);
      setSesiones(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating sesion:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSesion = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await sesionesAPI.update(id, data);
      setSesiones(prev => 
        prev.map(sesion => sesion.id_sesion === id ? response.data : sesion)
      );
      return response.data;
    } catch (err) {
      console.error('Error updating sesion:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const completarSesion = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await sesionesAPI.completar(id);
      setSesiones(prev => 
        prev.map(sesion => 
          sesion.id_sesion === id ? response.data.sesion : sesion
        )
      );
      return response.data;
    } catch (err) {
      console.error('Error completing sesion:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSesionesPorUsuario = useCallback(async (usuarioId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await sesionesAPI.getPorUsuario(usuarioId);
      return response.data;
    } catch (err) {
      console.error('Error fetching sesiones por usuario:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getEstadisticasUsuario = useCallback(async (usuarioId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await sesionesAPI.getEstadisticasUsuario(usuarioId);
      return response.data;
    } catch (err) {
      console.error('Error fetching estadisticas:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSesion = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await sesionesAPI.delete(id);
      setSesiones(prev => prev.filter(sesion => sesion.id_sesion !== id));
    } catch (err) {
      console.error('Error deleting sesion:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sesiones,
    loading,
    error,
    fetchSesiones,
    getSesionById,
    createSesion,
    updateSesion,
    completarSesion,
    getSesionesPorUsuario,
    getEstadisticasUsuario,
    deleteSesion,
  };
};