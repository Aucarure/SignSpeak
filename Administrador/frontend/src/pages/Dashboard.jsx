// ============================================
// ARCHIVO: src/pages/Dashboard.jsx
// Ubicación: frontend/src/pages/Dashboard.jsx
// ============================================
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  BookOpen, 
  FolderOpen,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts'
import { toast } from 'sonner'
import { usuariosAPI, diccionarioAPI } from '../api'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // Estados para las estadísticas
  const [statsUsuarios, setStatsUsuarios] = useState({
    total_usuarios: 0,
    usuarios_activos: 0,
    usuarios_inactivos: 0,
    por_tipo: {}
  })
  
  const [statsSenas, setStatsSenas] = useState({
    total_senas: 0,
    por_dificultad: {},
    por_categoria: {}
  })
  
  const [statsCategorias, setStatsCategorias] = useState({
    total_categorias: 0,
    activas: 0,
    inactivas: 0
  })

  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      
      // Cargar todas las estadísticas en paralelo
      await Promise.all([
        fetchEstadisticasUsuarios(),
        fetchEstadisticasSenas(),
        fetchCategorias()
      ])
      
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error)
      toast.error('Error al cargar algunos datos')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAllData()
    setRefreshing(false)
    toast.success('Datos actualizados')
  }

  const fetchEstadisticasUsuarios = async () => {
    try {
      const response = await usuariosAPI.getEstadisticas()
      setStatsUsuarios(response.data)
    } catch (error) {
      console.error('Error al cargar estadísticas de usuarios:', error)
    }
  }

  const fetchEstadisticasSenas = async () => {
    try {
      const response = await diccionarioAPI.señas.getAll()
      const data = response.data
      
      // Procesar datos localmente
      let senasData = []
      if (Array.isArray(data)) {
        senasData = data
      } else if (data.results && Array.isArray(data.results)) {
        senasData = data.results
      }

      // Contar por dificultad
      const porDificultad = {
        facil: senasData.filter(s => s.dificultad === 'facil').length,
        medio: senasData.filter(s => s.dificultad === 'medio').length,
        dificil: senasData.filter(s => s.dificultad === 'dificil').length
      }

      setStatsSenas({
        total_senas: senasData.length,
        por_dificultad: porDificultad
      })
    } catch (error) {
      console.error('Error al cargar estadísticas de señas:', error)
    }
  }

  const fetchCategorias = async () => {
    try {
      const response = await diccionarioAPI.categorias.getAll()
      const data = response.data
      
      let categoriasData = []
      if (Array.isArray(data)) {
        categoriasData = data
      } else if (data.results && Array.isArray(data.results)) {
        categoriasData = data.results
      }

      setCategorias(categoriasData)
      
      setStatsCategorias({
        total_categorias: categoriasData.length,
        activas: categoriasData.filter(c => c.activo).length,
        inactivas: categoriasData.filter(c => !c.activo).length
      })
    } catch (error) {
      console.error('Error al cargar categorías:', error)
    }
  }

  const statCards = [
    {
      title: 'Usuarios Totales',
      value: loading ? '...' : statsUsuarios.total_usuarios.toLocaleString(),
      subtitle: `${statsUsuarios.usuarios_activos} activos`,
      icon: Users,
      color: 'blue',
      link: '/usuarios'
    },
    {
      title: 'Señas en Diccionario',
      value: loading ? '...' : statsSenas.total_senas.toLocaleString(),
      subtitle: `${statsSenas.por_dificultad.facil || 0} fáciles, ${statsSenas.por_dificultad.medio || 0} medias`,
      icon: BookOpen,
      color: 'green',
      link: '/diccionario'
    },
    {
      title: 'Categorías',
      value: loading ? '...' : statsCategorias.total_categorias.toLocaleString(),
      subtitle: `${statsCategorias.activas} activas`,
      icon: FolderOpen,
      color: 'purple',
      link: '/categorias'
    }
  ]

  // Preparar datos para gráficos
  const tiposUsuarioData = Object.entries(statsUsuarios.por_tipo || {}).map(([tipo, cantidad]) => ({
    name: tipo.charAt(0).toUpperCase() + tipo.slice(1),
    value: cantidad
  }))

  const dificultadSenasData = [
    { name: 'Fácil', value: statsSenas.por_dificultad.facil || 0, fill: '#10b981' },
    { name: 'Medio', value: statsSenas.por_dificultad.medio || 0, fill: '#f59e0b' },
    { name: 'Difícil', value: statsSenas.por_dificultad.dificil || 0, fill: '#ef4444' }
  ]

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Resumen general de la plataforma de aprendizaje de lenguaje de señas
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const bgColors = {
            blue: 'bg-blue-100',
            green: 'bg-green-100',
            purple: 'bg-purple-100'
          }
          const textColors = {
            blue: 'text-blue-600',
            green: 'text-green-600',
            purple: 'text-purple-600'
          }
          
          return (
            <Link
              key={card.title}
              to={card.link}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${bgColors[card.color]} rounded-lg flex items-center justify-center`}>
                  <card.icon className={`w-6 h-6 ${textColors[card.color]}`} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {card.value}
              </h3>
              <p className="text-sm font-medium text-gray-900">{card.title}</p>
              <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
            </Link>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Tipos de Usuario */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Distribución de Usuarios por Tipo
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Cantidad de usuarios según su tipo
            </p>
          </div>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Cargando datos...
            </div>
          ) : tiposUsuarioData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tiposUsuarioData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tiposUsuarioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No hay datos disponibles
            </div>
          )}
        </div>

        {/* Gráfico de Dificultad de Señas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Señas por Nivel de Dificultad
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Distribución de señas según su complejidad
            </p>
          </div>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Cargando datos...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dificultadSenasData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {dificultadSenasData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Distribution by User Type - Detailed */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Detalle de Usuarios por Tipo
        </h3>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(statsUsuarios.por_tipo || {}).map(([tipo, cantidad]) => (
              <div key={tipo} className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-3xl font-bold text-gray-900">{cantidad}</p>
                <p className="text-sm text-gray-600 capitalize mt-1">{tipo}</p>
              </div>
            ))}
            {Object.keys(statsUsuarios.por_tipo || {}).length === 0 && (
              <div className="col-span-4 text-center text-gray-500 py-4">
                No hay datos disponibles
              </div>
            )}
          </div>
        )}
      </div>

      {/* Listado de Categorías */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Categorías del Diccionario
          </h3>
          <Link 
            to="/categorias"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver todas →
          </Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando...</div>
        ) : categorias.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categorias.slice(0, 8).map((categoria) => (
              <div 
                key={categoria.id_categoria}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${categoria.color}20` }}
                >
                  {categoria.icono ? (
                    <span className="text-xl">{categoria.icono}</span>
                  ) : (
                    <FolderOpen className="w-5 h-5" style={{ color: categoria.color }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {categoria.nombre}
                  </p>
                  <p className="text-xs text-gray-500">
                    {categoria.total_senas || 0} señas
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            No hay categorías disponibles
          </div>
        )}
      </div>

      {/* Estado del Sistema */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Estado del Sistema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div>
              <p className="text-sm text-green-800 font-medium">Usuarios Activos</p>
              <p className="text-2xl font-bold text-green-900">{statsUsuarios.usuarios_activos}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <p className="text-sm text-blue-800 font-medium">Categorías Activas</p>
              <p className="text-2xl font-bold text-blue-900">{statsCategorias.activas}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div>
              <p className="text-sm text-purple-800 font-medium">Total de Señas</p>
              <p className="text-2xl font-bold text-purple-900">{statsSenas.total_senas}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}