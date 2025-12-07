// src/hooks/useEjercicios.js
import { useState, useCallback } from 'react';
import { ejerciciosAPI } from '../api/ejercicios';

export const useEjercicios = () => {
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEjercicios = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ejerciciosAPI.getAll(params);
      // Asegurarnos de que siempre sea un array
      setEjercicios(Array.isArray(response.data) ? response.data : []);
      return response.data;
    } catch (err) {
      console.error('Error fetching ejercicios:', err);
      setError(err.message);
      setEjercicios([]); // Asegurar que sea array vacío en caso de error
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getEjercicioById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ejerciciosAPI.getById(id);
      return response.data;
    } catch (err) {
      console.error('Error fetching ejercicio:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEjercicio = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ejerciciosAPI.create(data);
      setEjercicios(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating ejercicio:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEjercicio = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ejerciciosAPI.update(id, data);
      setEjercicios(prev => 
        prev.map(ej => ej.id_ejercicio === id ? response.data : ej)
      );
      return response.data;
    } catch (err) {
      console.error('Error updating ejercicio:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEjercicio = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await ejerciciosAPI.delete(id);
      setEjercicios(prev => prev.filter(ej => ej.id_ejercicio !== id));
    } catch (err) {
      console.error('Error deleting ejercicio:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getEjerciciosPorTipo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ejerciciosAPI.getPorTipo();
      return response.data;
    } catch (err) {
      console.error('Error fetching ejercicios por tipo:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getEjerciciosPorDificultad = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ejerciciosAPI.getPorDificultad();
      return response.data;
    } catch (err) {
      console.error('Error fetching ejercicios por dificultad:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    ejercicios,
    loading,
    error,
    fetchEjercicios,
    getEjercicioById,
    createEjercicio,
    updateEjercicio,
    deleteEjercicio,
    getEjerciciosPorTipo,
    getEjerciciosPorDificultad,
  };
};