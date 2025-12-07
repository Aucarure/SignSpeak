// ============================================
// ARCHIVO: src/pages/Dashboard.jsx
// Ubicación: frontend/src/pages/Dashboard.jsx
// ============================================
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  BookOpen, 
  Dumbbell, 
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { usuariosAPI } from '../api/usuarios'

// Datos de ejemplo para los gráficos
const progresoData = [
  { mes: 'Ene', usuarios: 3000, ejercicios: 1200 },
  { mes: 'Feb', usuarios: 4200, ejercicios: 1800 },
  { mes: 'Mar', usuarios: 5100, ejercicios: 2100 },
  { mes: 'Abr', usuarios: 6500, ejercicios: 2400 },
  { mes: 'May', usuarios: 8800, ejercicios: 2700 },
  { mes: 'Jun', usuarios: 11200, ejercicios: 3000 },
]

const actividadData = [
  { dia: 'Lun', detecciones: 420 },
  { dia: 'Mar', detecciones: 380 },
  { dia: 'Mié', detecciones: 510 },
  { dia: 'Jue', detecciones: 445 },
  { dia: 'Vie', detecciones: 590 },
  { dia: 'Sáb', detecciones: 320 },
  { dia: 'Dom', detecciones: 280 },
]

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_usuarios: 0,
    usuarios_activos: 0,
    usuarios_inactivos: 0,
    por_tipo: {}
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEstadisticas()
  }, [])

  const fetchEstadisticas = async () => {
    try {
      const response = await usuariosAPI.getEstadisticas()
      setStats(response.data)
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Usuarios Totales',
      value: stats.total_usuarios,
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue',
      link: '/usuarios'
    },
    {
      title: 'Señas en Diccionario',
      value: '2,847',
      change: '+8.2%',
      trend: 'up',
      icon: BookOpen,
      color: 'green',
      link: '/diccionario'
    },
    {
      title: 'Ejercicios Completados',
      value: '15,892',
      change: '+23.1%',
      trend: 'up',
      icon: Dumbbell,
      color: 'purple',
      link: '/ejercicios'
    },
    {
      title: 'Traducciones Hoy',
      value: '8,432',
      change: '-3.2%',
      trend: 'down',
      icon: Activity,
      color: 'orange',
      link: '/progreso'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Resumen general de la plataforma de aprendizaje de lenguaje de señas
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const bgColors = {
            blue: 'bg-blue-100',
            green: 'bg-green-100',
            purple: 'bg-purple-100',
            orange: 'bg-orange-100'
          }
          const textColors = {
            blue: 'text-blue-600',
            green: 'text-green-600',
            purple: 'text-purple-600',
            orange: 'text-orange-600'
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
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.trend === 'up' ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  <span>{card.change}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {loading ? '...' : card.value}
              </h3>
              <p className="text-sm text-gray-600">{card.title}</p>
            </Link>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Progreso de Usuarios
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Crecimiento mensual de usuarios y ejercicios completados
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={progresoData}>
              <defs>
                <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEjercicios" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="usuarios" 
                stroke="#3b82f6" 
                fillOpacity={1}
                fill="url(#colorUsuarios)"
                name="Usuarios"
              />
              <Area 
                type="monotone" 
                dataKey="ejercicios" 
                stroke="#10b981" 
                fillOpacity={1}
                fill="url(#colorEjercicios)"
                name="Ejercicios"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Actividad Semanal
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Detecciones de señas por día de la semana
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={actividadData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="dia" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="detecciones" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution by User Type */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Distribución de Usuarios por Tipo
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.por_tipo).map(([tipo, cantidad]) => (
            <div key={tipo} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-gray-900">{cantidad}</p>
              <p className="text-sm text-gray-600 capitalize mt-1">{tipo}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Actividad Reciente
        </h3>
        <div className="space-y-4">
          {[
            { user: 'María González', action: 'completó el módulo "Alfabeto básico"', time: 'Hace 5 min' },
            { user: 'Carlos Rodríguez', action: 'se registró como usuario oyente', time: 'Hace 12 min' },
            { user: 'Ana Martínez', action: 'descargó 3 videos educativos', time: 'Hace 23 min' },
            { user: 'Juan López', action: 'usó traducción en tiempo real 5 veces', time: 'Hace 34 min' },
            { user: 'Laura Sánchez', action: 'completó evaluación con 95% de precisión', time: 'Hace 45 min' },
          ].map((activity, index) => (
            <div key={index} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-blue-600">
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}