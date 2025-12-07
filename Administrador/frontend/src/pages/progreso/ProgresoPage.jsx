// ============================================
// ARCHIVO: src/pages/progreso/ProgresoPage.jsx
// ============================================
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  TrendingUp, 
  Users, 
  Trophy,
  Activity,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Eye
} from 'lucide-react'
import { getProgresoUsuarios, getRanking } from '../../api/progreso'
import { usuariosAPI } from '../../api/usuarios'

export default function ProgresoPage() {
  const [progreso, setProgreso] = useState([])
  const [ranking, setRanking] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    usuario: '',
    search: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Obtener progreso
      const progresoData = await getProgresoUsuarios()
      console.log('Progreso data:', progresoData)
      
      // Verificar si la respuesta es un array o tiene una propiedad results
      if (Array.isArray(progresoData)) {
        setProgreso(progresoData)
      } else if (progresoData.results) {
        setProgreso(progresoData.results)
      } else {
        setProgreso([])
      }

      // Obtener ranking
      const rankingData = await getRanking(10)
      if (Array.isArray(rankingData)) {
        setRanking(rankingData)
      } else if (rankingData.results) {
        setRanking(rankingData.results)
      } else {
        setRanking([])
      }

      // Obtener usuarios para el filtro
      const usuariosResponse = await usuariosAPI.getAll()
      setUsuarios(usuariosResponse.data || [])
    } catch (error) {
      console.error('Error al cargar datos:', error)
      setProgreso([])
      setRanking([])
      setUsuarios([])
    } finally {
      setLoading(false)
    }
  }

  // Filtrar progreso
  const filteredProgreso = progreso.filter(item => {
    // Filtro por usuario
    if (filters.usuario && item.id_usuario !== parseInt(filters.usuario)) {
      return false
    }
    
    // Filtro por búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const nombre = item.usuario_nombre?.toLowerCase() || ''
      return nombre.includes(searchLower)
    }
    
    return true
  })

  // Calcular estadísticas
  const stats = {
    totalUsuarios: progreso.length,
    promedioEjercicios: progreso.length > 0
      ? (progreso.reduce((sum, p) => sum + (p.ejercicios_completados || 0), 0) / progreso.length).toFixed(1)
      : 0,
    promedioTiempo: progreso.length > 0
      ? (progreso.reduce((sum, p) => sum + (p.tiempo_practicado || 0), 0) / progreso.length).toFixed(1)
      : 0,
    promedioConfianza: progreso.length > 0
      ? (progreso.reduce((sum, p) => sum + (p.promedio_confianza || 0), 0) / progreso.length).toFixed(1)
      : 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Progreso de Usuarios</h1>
        <p className="text-gray-600 mt-1">
          Seguimiento del rendimiento y avance de los usuarios
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {loading ? '...' : stats.totalUsuarios}
          </h3>
          <p className="text-sm text-gray-600">Usuarios Activos</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {loading ? '...' : stats.promedioEjercicios}
          </h3>
          <p className="text-sm text-gray-600">Promedio Ejercicios</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {loading ? '...' : `${stats.promedioTiempo}h`}
          </h3>
          <p className="text-sm text-gray-600">Tiempo Promedio</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {loading ? '...' : `${stats.promedioConfianza}%`}
          </h3>
          <p className="text-sm text-gray-600">Confianza Promedio</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              {usuarios.map((usuario) => (
                <option key={usuario.id_usuario} value={usuario.id_usuario}>
                  {usuario.nombre}
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
                placeholder="Buscar por nombre..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabla de Progreso Principal */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Progreso General ({filteredProgreso.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : filteredProgreso.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ejercicios
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tiempo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confianza
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProgreso.map((item) => (
                    <tr key={item.id_progreso} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.usuario_nombre || `Usuario #${item.id_usuario}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.ejercicios_completados || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {(item.tiempo_practicado || 0).toFixed(1)}h
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm text-gray-900 mr-2">
                            {(item.promedio_confianza || 0).toFixed(1)}%
                          </div>
                          {item.promedio_confianza >= 80 ? (
                            <ArrowUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/progreso/${item.id_usuario}`}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">Ver detalle</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay datos de progreso disponibles</p>
              </div>
            )}
          </div>
        </div>

        {/* Ranking Sidebar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900">Top 10 Usuarios</h2>
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : ranking.length > 0 ? (
              <div className="space-y-4">
                {ranking.map((user, index) => (
                  <div key={user.id_usuario} className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold
                      ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-50 text-blue-600'}
                    `}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.usuario_nombre || `Usuario #${user.id_usuario}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.ejercicios_completados || 0} ejercicios
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {(user.promedio_confianza || 0).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No hay ranking disponible</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Link rápido a errores */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-1">
              ¿Quieres analizar errores comunes?
            </h3>
            <p className="text-sm text-blue-700">
              Revisa los errores más frecuentes de los usuarios para mejorar el aprendizaje
            </p>
          </div>
          <Link
            to="/progreso/errores"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Ver Errores
          </Link>
        </div>
      </div>
    </div>
  )
}