// src/pages/ejercicios/EjerciciosPage.jsx
import { useState, useEffect } from 'react';
import { useEjercicios } from '../../hooks/useEjercicios';
import EjercicioForm from '../../components/forms/EjercicioForm';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const EjerciciosPage = () => {
  const {
    ejercicios,
    loading,
    error,
    fetchEjercicios,
    createEjercicio,
    updateEjercicio,
    deleteEjercicio,
  } = useEjercicios();

  const [showModal, setShowModal] = useState(false);
  const [selectedEjercicio, setSelectedEjercicio] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterDificultad, setFilterDificultad] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [ejercicioToDelete, setEjercicioToDelete] = useState(null);

  const TIPO_CHOICES = [
    { value: 'practica_seña', label: 'Práctica de Seña' },
    { value: 'reconocimiento', label: 'Reconocimiento' },
    { value: 'traduccion', label: 'Traducción' },
    { value: 'memoria', label: 'Memoria' },
    { value: 'velocidad', label: 'Velocidad' },
  ];

  const DIFICULTAD_CHOICES = [
    { value: 'facil', label: 'Fácil' },
    { value: 'medio', label: 'Medio' },
    { value: 'dificil', label: 'Difícil' },
  ];

  const getTipoLabel = (tipo) => {
    const encontrado = TIPO_CHOICES.find(t => t.value === tipo);
    return encontrado ? encontrado.label : tipo;
  };

  const getDificultadLabel = (dificultad) => {
    const encontrado = DIFICULTAD_CHOICES.find(d => d.value === dificultad);
    return encontrado ? encontrado.label : dificultad;
  };

  const getDificultadColor = (dificultad) => {
    switch (dificultad) {
      case 'facil':
        return 'bg-green-100 text-green-800';
      case 'medio':
        return 'bg-yellow-100 text-yellow-800';
      case 'dificil':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo) => {
    const colors = {
      'practica_seña': 'bg-blue-100 text-blue-800',
      'reconocimiento': 'bg-purple-100 text-purple-800',
      'traduccion': 'bg-indigo-100 text-indigo-800',
      'memoria': 'bg-pink-100 text-pink-800',
      'velocidad': 'bg-orange-100 text-orange-800',
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  const filteredEjercicios = ejercicios.filter(ejercicio => {
    const matchSearch = ejercicio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (ejercicio.descripcion && ejercicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchTipo = !filterTipo || ejercicio.tipo === filterTipo;
    const matchDificultad = !filterDificultad || ejercicio.nivel_dificultad === filterDificultad;
    
    return matchSearch && matchTipo && matchDificultad;
  });

  const handleCreate = () => {
    setSelectedEjercicio(null);
    setShowModal(true);
  };

  const handleEdit = (ejercicio) => {
    setSelectedEjercicio(ejercicio);
    setShowModal(true);
  };

  const handleDeleteClick = (ejercicio) => {
    setEjercicioToDelete(ejercicio);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteEjercicio(ejercicioToDelete.id_ejercicio);
      setShowDeleteConfirm(false);
      setEjercicioToDelete(null);
      alert('Ejercicio eliminado exitosamente');
    } catch (err) {
      alert('Error al eliminar el ejercicio: ' + err.message);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedEjercicio) {
        await updateEjercicio(selectedEjercicio.id_ejercicio, data);
        alert('Ejercicio actualizado exitosamente');
      } else {
        await createEjercicio(data);
        alert('Ejercicio creado exitosamente');
      }
      setShowModal(false);
      setSelectedEjercicio(null);
    } catch (err) {
      alert('Error al guardar el ejercicio: ' + err.message);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedEjercicio(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Ejercicios</h1>
        <p className="text-gray-600 mt-2">Administra los ejercicios de práctica del sistema</p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Ejercicios</p>
              <p className="text-2xl font-bold text-gray-900">{ejercicios.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-green-600">
                {ejercicios.filter(e => e.activo).length}
              </p>
            </div>
            <CheckCircleIcon className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactivos</p>
              <p className="text-2xl font-bold text-red-600">
                {ejercicios.filter(e => !e.activo).length}
              </p>
            </div>
            <XCircleIcon className="w-10 h-10 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tipos Diferentes</p>
              <p className="text-2xl font-bold text-purple-600">
                {new Set(ejercicios.map(e => e.tipo)).size}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro por tipo */}
          <div>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              {TIPO_CHOICES.map(tipo => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por dificultad */}
          <div>
            <select
              value={filterDificultad}
              onChange={(e) => setFilterDificultad(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las dificultades</option>
              {DIFICULTAD_CHOICES.map(dif => (
                <option key={dif.value} value={dif.value}>
                  {dif.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botón crear */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Nuevo Ejercicio
          </button>
        </div>
      </div>

      {/* Tabla de ejercicios */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            <p>Error al cargar los ejercicios: {error}</p>
          </div>
        ) : filteredEjercicios.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No se encontraron ejercicios</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dificultad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Puntaje
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Señas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orden
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEjercicios.map((ejercicio) => (
                  <tr key={ejercicio.id_ejercicio} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {ejercicio.titulo}
                        </p>
                        {ejercicio.descripcion && (
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {ejercicio.descripcion}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTipoColor(ejercicio.tipo)}`}>
                        {getTipoLabel(ejercicio.tipo)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDificultadColor(ejercicio.nivel_dificultad)}`}>
                        {getDificultadLabel(ejercicio.nivel_dificultad)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ejercicio.puntaje_maximo} pts
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ejercicio.señas_incluidas.length} señas
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ejercicio.activo ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ejercicio.orden}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(ejercicio)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(ejercicio)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <TrashIcon className="w-5 h-5" />
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

      {/* Modal de formulario */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {selectedEjercicio ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
              </h2>
              <EjercicioForm
                ejercicio={selectedEjercicio}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar el ejercicio "{ejercicioToDelete?.titulo}"? 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setEjercicioToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EjerciciosPage;