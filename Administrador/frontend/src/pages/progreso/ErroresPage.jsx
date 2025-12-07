// ============================================
// ARCHIVO: src/pages/progreso/ErroresPage.jsx
// ============================================
import { useState, useEffect } from 'react'
import { getErrores } from '../../api/progreso'
import { usuariosAPI } from '../../api/usuarios'
import {
  AlertCircle,
  Filter,
  Search,
  TrendingDown,
  XCircle,
  AlertTriangle
} from 'lucide-react'

export default function ErroresPage() {
  const [errores, setErrores] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    usuario: '',
    tipo_error: '',
    search: ''
  })

  useEffect(() => {
    fetchUsuarios()
    fetchErrores()
  }, [])

  const fetchUsuarios = async () => {
    try {
      const response = await usuariosAPI.getAll()
      console.log('Usuarios response:', response)
      
      // Verificar diferentes formatos de respuesta
      if (Array.isArray(response)) {
        setUsuarios(response)
      } else if (Array.isArray(response.data)) {
        setUsuarios(response.data)
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        setUsuarios(response.data.results)
      } else {
        console.warn('Formato inesperado de usuarios:', response)
        setUsuarios([])
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
      setUsuarios([])
    }
  }

  const fetchErrores = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.usuario) params.id_usuario = filters.usuario
      if (filters.tipo_error) params.tipo_error = filters.tipo_error
      
      const data = await getErrores(params)
      console.log('Errores data:', data)
      
      // Verificar si la respuesta es un array o tiene una propiedad results
      if (Array.isArray(data)) {
        setErrores(data)
      } else if (data.results) {
        setErrores(data.results)
      } else {
        setErrores([])
      }
    } catch (error) {
      console.error('Error al cargar errores:', error)
      setErrores([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchErrores()
  }, [filters.usuario, filters.tipo_error])

  // Filtrar errores de manera segura
  const filteredErrores = Array.isArray(errores) ? errores.filter(error => {
    const searchLower = filters.search.toLowerCase()
    return (
      error.usuario_nombre?.toLowerCase().includes(searchLower) ||
      error.seña_esperada?.toLowerCase().includes(searchLower) ||
      error.seña_detectada?.toLowerCase().includes(searchLower)
    )
  }) : []

  const tiposError = [
    { value: 'seña_incorrecta', label: 'Seña Incorrecta' },
    { value: 'no_detectada', label: 'No Detectada' },
    { value: 'gesto_incompleto', label: 'Gesto Incompleto' },
    { value: 'baja_confianza', label: 'Baja Confianza' }
  ]

  const getTipoErrorColor = (tipo) => {
    const colors = {
      seña_incorrecta: 'bg-red-100 text-red-800',
      no_detectada: 'bg-orange-100 text-orange-800',
      gesto_incompleto: 'bg-yellow-100 text-yellow-800',
      baja_confianza: 'bg-blue-100 text-blue-800'
    }
    return colors[tipo] || 'bg-gray-100 text-gray-800'
  }

  const getTipoErrorIcon = (tipo) => {
    switch (tipo) {
      case 'seña_incorrecta':
        return <XCircle className="w-4 h-4" />
      case 'no_detectada':
        return <AlertCircle className="w-4 h-4" />
      case 'gesto_incompleto':
        return <TrendingDown className="w-4 h-4" />
      case 'baja_confianza':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  // Calcular estadísticas de manera segura
  const estadisticas = {
    total: Array.isArray(errores) ? errores.length : 0,
    porTipo: tiposError.map(tipo => ({
      tipo: tipo.label,
      cantidad: Array.isArray(errores) 
        ? errores.filter(e => e.tipo_error === tipo.value).length 
        : 0
    })),
    conRetroalimentacion: Array.isArray(errores) 
      ? errores.filter(e => e.retroalimentacion_mostrada).length 
      : 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Errores de Usuarios</h1>
        <p className="text-gray-600 mt-1">
          Análisis y seguimiento de errores durante las prácticas
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Errores</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {loading ? '...' : estadisticas.total}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        {estadisticas.porTipo.slice(0, 3).map((stat, index) => {
          const colors = ['bg-orange-100 text-orange-600', 'bg-yellow-100 text-yellow-600', 'bg-blue-100 text-blue-600']
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.tipo}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {loading ? '...' : stat.cantidad}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${colors[index]}`}>
                  {getTipoErrorIcon(tiposError.find(t => t.label === stat.tipo)?.value)}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuario
            </label>
            <select
              value={filters.usuario}
              onChange={(e) => setFilters({...filters, usuario: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los usuarios</option>
              {Array.isArray(usuarios) && usuarios.map((usuario) => (
                <option key={usuario.id_usuario} value={usuario.id_usuario}>
                  {usuario.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Error
            </label>
            <select
              value={filters.tipo_error}
              onChange={(e) => setFilters({...filters, tipo_error: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              {tiposError.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por usuario o seña..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Errores */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Historial de Errores ({filteredErrores.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : filteredErrores.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seña Esperada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seña Detectada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo de Error
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confianza
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Retroalimentación
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredErrores.map((error) => (
                  <tr key={error.id_error} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {error.usuario_nombre || `Usuario #${error.id_usuario}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {error.seña_esperada}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {error.seña_detectada || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getTipoErrorColor(error.tipo_error)}`}>
                        {getTipoErrorIcon(error.tipo_error)}
                        {tiposError.find(t => t.value === error.tipo_error)?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {error.confianza_deteccion 
                          ? `${parseFloat(error.confianza_deteccion).toFixed(1)}%`
                          : '-'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {new Date(error.timestamp).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {error.retroalimentacion_mostrada ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          ✓ Mostrada
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          ✗ No mostrada
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron errores</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}