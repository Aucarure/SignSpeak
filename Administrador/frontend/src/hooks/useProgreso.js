import { useState, useEffect } from 'react';
import {
  getProgresoUsuarios,
  getProgresoPorUsuario,
  getEstadisticasUsuario,
  getRanking,
  getDeteccionesPorUsuario,
  getEstadisticasDetecciones,
  getErroresPorUsuario,
  getErroresFrecuentes,
} from '../api/progreso';

export const useProgreso = () => {
  const [progresos, setProgresos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProgresos = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProgresoUsuarios(params);
      setProgresos(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    progresos,
    loading,
    error,
    fetchProgresos,
  };
};

export const useProgresoUsuario = (usuarioId) => {
  const [progreso, setProgreso] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProgresoUsuario = async () => {
    if (!usuarioId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await getProgresoPorUsuario(usuarioId);
      setProgreso(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchEstadisticas = async () => {
    if (!usuarioId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await getEstadisticasUsuario(usuarioId);
      setEstadisticas(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuarioId) {
      fetchProgresoUsuario();
      fetchEstadisticas();
    }
  }, [usuarioId]);

  return {
    progreso,
    estadisticas,
    loading,
    error,
    refetch: () => {
      fetchProgresoUsuario();
      fetchEstadisticas();
    },
  };
};

export const useRanking = (limit = 10) => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRanking = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRanking(limit);
      setRanking(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, [limit]);

  return {
    ranking,
    loading,
    error,
    refetch: fetchRanking,
  };
};

export const useDetecciones = (usuarioId) => {
  const [detecciones, setDetecciones] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDetecciones = async (page = 1) => {
    if (!usuarioId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await getDeteccionesPorUsuario(usuarioId, page);
      setDetecciones(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchEstadisticas = async () => {
    if (!usuarioId) return;
    
    try {
      const data = await getEstadisticasDetecciones(usuarioId);
      setEstadisticas(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (usuarioId) {
      fetchDetecciones();
      fetchEstadisticas();
    }
  }, [usuarioId]);

  return {
    detecciones,
    estadisticas,
    loading,
    error,
    refetch: fetchDetecciones,
  };
};

export const useErrores = (usuarioId) => {
  const [errores, setErrores] = useState([]);
  const [erroresFrecuentes, setErroresFrecuentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchErrores = async (page = 1) => {
    if (!usuarioId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await getErroresPorUsuario(usuarioId, page);
      setErrores(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchErroresFrecuentes = async () => {
    if (!usuarioId) return;
    
    try {
      const data = await getErroresFrecuentes(usuarioId);
      setErroresFrecuentes(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (usuarioId) {
      fetchErrores();
      fetchErroresFrecuentes();
    }
  }, [usuarioId]);

  return {
    errores,
    erroresFrecuentes,
    loading,
    error,
    refetch: fetchErrores,
  };
};