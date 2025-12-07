// src/components/forms/EjercicioForm.jsx
import { useState, useEffect } from 'react';

const EjercicioForm = ({ ejercicio, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'practica_seña',
    nivel_dificultad: 'medio',
    señas_incluidas: [],
    puntaje_maximo: 100,
    tiempo_limite_segundos: null,
    instrucciones: '',
    requisitos_previos: [],
    orden: 0,
    activo: true,
  });

  const [errors, setErrors] = useState({});

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

  useEffect(() => {
    if (ejercicio) {
      setFormData({
        titulo: ejercicio.titulo || '',
        descripcion: ejercicio.descripcion || '',
        tipo: ejercicio.tipo || 'practica_seña',
        nivel_dificultad: ejercicio.nivel_dificultad || 'medio',
        señas_incluidas: ejercicio.señas_incluidas || [],
        puntaje_maximo: ejercicio.puntaje_maximo || 100,
        tiempo_limite_segundos: ejercicio.tiempo_limite_segundos || null,
        instrucciones: ejercicio.instrucciones || '',
        requisitos_previos: ejercicio.requisitos_previos || [],
        orden: ejercicio.orden || 0,
        activo: ejercicio.activo !== undefined ? ejercicio.activo : true,
      });
    }
  }, [ejercicio]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleArrayChange = (e, fieldName) => {
    const value = e.target.value;
    const arrayValue = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    setFormData(prev => ({
      ...prev,
      [fieldName]: arrayValue
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es requerido';
    }

    if (!formData.tipo) {
      newErrors.tipo = 'El tipo es requerido';
    }

    if (formData.señas_incluidas.length === 0) {
      newErrors.señas_incluidas = 'Debe incluir al menos una seña';
    }

    if (formData.puntaje_maximo <= 0) {
      newErrors.puntaje_maximo = 'El puntaje debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Título */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título *
        </label>
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.titulo ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ej: Reconocimiento de números"
        />
        {errors.titulo && (
          <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Descripción del ejercicio..."
        />
      </div>

      {/* Tipo y Dificultad */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo *
          </label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.tipo ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {TIPO_CHOICES.map(tipo => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
          {errors.tipo && (
            <p className="mt-1 text-sm text-red-600">{errors.tipo}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dificultad
          </label>
          <select
            name="nivel_dificultad"
            value={formData.nivel_dificultad}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {DIFICULTAD_CHOICES.map(dif => (
              <option key={dif.value} value={dif.value}>
                {dif.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Señas Incluidas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Señas Incluidas (IDs separados por coma) *
        </label>
        <input
          type="text"
          value={formData.señas_incluidas.join(', ')}
          onChange={(e) => handleArrayChange(e, 'señas_incluidas')}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.señas_incluidas ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ej: 1, 2, 3, 4, 5"
        />
        {errors.señas_incluidas && (
          <p className="mt-1 text-sm text-red-600">{errors.señas_incluidas}</p>
        )}
      </div>

      {/* Puntaje y Tiempo */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Puntaje Máximo
          </label>
          <input
            type="number"
            name="puntaje_maximo"
            value={formData.puntaje_maximo}
            onChange={handleChange}
            min="1"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.puntaje_maximo ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.puntaje_maximo && (
            <p className="mt-1 text-sm text-red-600">{errors.puntaje_maximo}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiempo Límite (segundos)
          </label>
          <input
            type="number"
            name="tiempo_limite_segundos"
            value={formData.tiempo_limite_segundos || ''}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Sin límite"
          />
        </div>
      </div>

      {/* Instrucciones */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Instrucciones
        </label>
        <textarea
          name="instrucciones"
          value={formData.instrucciones}
          onChange={handleChange}
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Instrucciones detalladas para el ejercicio..."
        />
      </div>

      {/* Requisitos Previos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Requisitos Previos (IDs separados por coma)
        </label>
        <input
          type="text"
          value={formData.requisitos_previos.join(', ')}
          onChange={(e) => handleArrayChange(e, 'requisitos_previos')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ej: 1, 2"
        />
      </div>

      {/* Orden y Activo */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Orden
          </label>
          <input
            type="number"
            name="orden"
            value={formData.orden}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center pt-8">
          <input
            type="checkbox"
            name="activo"
            checked={formData.activo}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Ejercicio activo
          </label>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {ejercicio ? 'Actualizar' : 'Crear'} Ejercicio
        </button>
      </div>
    </form>
  );
};

export default EjercicioForm;