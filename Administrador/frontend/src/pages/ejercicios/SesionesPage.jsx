// src/pages/ejercicios/SesionesPage.jsx
import { useState, useEffect } from 'react';
import { useSesiones } from '../../hooks/useSesiones';
import { 
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TrophyIcon,
  ChartBarIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const SesionesPage = () => {
  const {
    sesiones,
    loading,
    error,
    fetchSesiones,
    completarSesion,
    deleteSesion,
  } = useSesiones();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompletado, setFilterCompletado] = useState('');
  const [selectedSesion, setSelectedSesion] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [estadisticas, setEstadisticas] = useState(null);
  const [usuarioIdBuscar, setUsuarioIdBuscar] = useState('');

  const filteredSesiones = sesiones.filter(sesion => {
    const matchSearch = 
      sesion.usuario_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sesion.ejercicio_titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sesion.id_usuario?.toString().includes(searchTerm);
    
    const matchCompletado = filterCompletado === '' || 
      (filterCompletado === 'completado' && sesion.completado) ||
      (filterCompletado === 'pendiente' && !sesion.completado);
    
    return matchSearch && matchCompletado;
  });

  const handleViewDetails = (sesion) => {
    setSelectedSesion(sesion);
    setShowDetailModal(true);
  };

  const handleCompletarSesion = async (id) => {
    if (window.confirm('¿Marcar esta sesión como completada?')) {
      try {
        await completarSesion(id);
        alert('Sesión completada exitosamente');
      } catch (err) {
        alert('Error al completar la sesión: ' + err.message);
      }
    }
  };

  const handleDeleteSesion = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta sesión? Esta acción no se puede deshacer.')) {
      try {
        await deleteSesion(id);
        alert('Sesión eliminada exitosamente');
      } catch (err) {
        alert('Error al eliminar la sesión: ' + err.message);
      }
    }
  };

  const formatDuration = (segundos) => {
    if (!segundos) return 'N/A';
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    
    if (horas > 0) {
      return `${horas}h ${minutos}m ${segs}s`;
    } else if (minutos > 0) {
      return `${minutos}m ${segs}s`;
    } else {
      return `${segs}s`;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcular estadísticas generales
  const stats = {
    total: sesiones.length,
    completadas: sesiones.filter(s => s.completado).length,
    pendientes: sesiones.filter(s => !s.completado).length,
    abandonadas: sesiones.filter(s => s.abandonado).length,
    promedioAciertos: sesiones.length > 0 
      ? (sesiones.reduce((acc, s) => acc + (s.porcentaje_aciertos || 0), 0) / sesiones.length).toFixed(1)
      : 0,
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Sesiones de Práctica</h1>
        <p className="text-gray-600 mt-2">Monitorea el progreso de las sesiones de los usuarios</p>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sesiones</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <ChartBarIcon className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completadas</p>
              <p className="text-2xl font-bold text-green-600">{stats.completadas}</p>
            </div>
            <CheckCircleIcon className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendientes}</p>
            </div>
            <ClockIcon className="w-10 h-10 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Abandonadas</p>
              <p className="text-2xl font-bold text-red-600">{stats.abandonadas}</p>
            </div>
            <XCircleIcon className="w-10 h-10 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">% Aciertos Prom.</p>
              <p className="text-2xl font-bold text-purple-600">{stats.promedioAciertos}%</p>
            </div>
            <TrophyIcon className="w-10 h-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por usuario, ejercicio o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro por estado */}
          <div>
            <select
              value={filterCompletado}
              onChange={(e) => setFilterCompletado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="completado">Completadas</option>
              <option value="pendiente">Pendientes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de sesiones */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            <p>Error al cargar las sesiones: {error}</p>
          </div>
        ) : filteredSesiones.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No se encontraron sesiones</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ejercicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Inicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Puntaje
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % Aciertos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiempo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSesiones.map((sesion) => (
                  <tr key={sesion.id_sesion} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{sesion.id_sesion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon className="w-5 h-5 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {sesion.usuario_nombre || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {sesion.id_usuario}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {sesion.ejercicio_titulo || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID Ejercicio: {sesion.id_ejercicio}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(sesion.fecha_inicio)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-semibold">{sesion.puntaje_obtenido}</span>
                      <span className="text-gray-500">/{sesion.puntaje_maximo}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              sesion.porcentaje_aciertos >= 80 ? 'bg-green-500' :
                              sesion.porcentaje_aciertos >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${sesion.porcentaje_aciertos || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {sesion.porcentaje_aciertos?.toFixed(1) || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDuration(sesion.tiempo_total_segundos)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sesion.completado ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircleIcon className="w-4 h-4 mr-1" />
                          Completada
                        </span>
                      ) : sesion.abandonado ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircleIcon className="w-4 h-4 mr-1" />
                          Abandonada
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          En progreso
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(sesion)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver detalles"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {!sesion.completado && (
                          <button
                            onClick={() => handleCompletarSesion(sesion.id_sesion)}
                            className="text-green-600 hover:text-green-900"
                            title="Completar sesión"
                          >
                            <CheckCircleIcon className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteSesion(sesion.id_sesion)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {showDetailModal && selectedSesion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Detalles de la Sesión #{selectedSesion.id_sesion}
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Usuario y Ejercicio */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Usuario</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedSesion.usuario_nombre || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">ID: {selectedSesion.id_usuario}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Ejercicio</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedSesion.ejercicio_titulo || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">ID: {selectedSesion.id_ejercicio}</p>
                  </div>
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Fecha de Inicio</p>
                    <p className="text-base font-medium text-gray-900">
                      {formatDate(selectedSesion.fecha_inicio)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Fecha de Fin</p>
                    <p className="text-base font-medium text-gray-900">
                      {formatDate(selectedSesion.fecha_fin) || 'En progreso'}
                    </p>
                  </div>
                </div>

                {/* Puntajes */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 mb-2 font-medium">Puntaje</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-blue-900">
                      {selectedSesion.puntaje_obtenido}
                    </span>
                    <span className="text-xl text-blue-600 mb-1">
                      / {selectedSesion.puntaje_maximo}
                    </span>
                  </div>
                </div>

                {/* Estadísticas de intentos */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600 mb-1">Total Intentos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedSesion.intentos_totales}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-green-600 mb-1">Correctos</p>
                    <p className="text-2xl font-bold text-green-900">
                      {selectedSesion.intentos_correctos}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-red-600 mb-1">Incorrectos</p>
                    <p className="text-2xl font-bold text-red-900">
                      {selectedSesion.intentos_incorrectos}
                    </p>
                  </div>
                </div>

                {/* Porcentaje y Tiempo */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 mb-2">% de Aciertos</p>
                    <div className="flex items-center">
                      <div className="flex-1 bg-purple-200 rounded-full h-4 mr-3">
                        <div 
                          className="bg-purple-600 h-4 rounded-full"
                          style={{ width: `${selectedSesion.porcentaje_aciertos || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xl font-bold text-purple-900">
                        {selectedSesion.porcentaje_aciertos?.toFixed(1) || 0}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-orange-600 mb-2">Tiempo Total</p>
                    <p className="text-xl font-bold text-orange-900">
                      {formatDuration(selectedSesion.tiempo_total_segundos)}
                    </p>
                  </div>
                </div>

                {/* Estado */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Estado</p>
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedSesion.completado 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedSesion.completado ? 'Completada' : 'En progreso'}
                      </span>
                    </div>
                    {selectedSesion.abandonado && (
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          Abandonada
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SesionesPage;