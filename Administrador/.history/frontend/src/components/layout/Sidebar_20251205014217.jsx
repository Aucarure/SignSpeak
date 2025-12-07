// ============================================
// ARCHIVO: src/components/layout/Sidebar.jsx
// ============================================
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
  Settings
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Usuarios',
    href: '/usuarios',
    icon: Users,
  },
  {
    name: 'Diccionario',
    icon: BookOpen,
    children: [
      { name: 'Señas', href: '/diccionario' },
      { name: 'Categorías', href: '/diccionario/categorias' },
    ],
  },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth() // Usar logout del contexto
  const [openMenus, setOpenMenus] = useState({})
  const [userInfo, setUserInfo] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Cargar información del usuario desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setUserInfo(user)
      } catch (error) {
        console.error('Error al parsear usuario:', error)
      }
    }
  }, [])

  // REEMPLAZA ESTA FUNCIÓN:
const handleLogout = async () => {
  if (window.confirm('¿Estás seguro de cerrar sesión?')) {
    try {
      // Limpiar todo el localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      
      // Redirigir al login externo
      window.location.href = 'http://localhost:3000/login'
      
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      // Aún así redirigir
      window.location.href = 'http://localhost:3000/login'
    }
  }
}

  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  const isParentActive = (children) => {
    return children?.some(child => isActive(child.href))
  }

  // Función para obtener las iniciales del nombre
  const getInitials = (name) => {
    if (!name) return 'U'
    const words = name.trim().split(' ')
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  // Función para obtener un color basado en el nombre
  const getAvatarColor = (name) => {
    if (!name) return 'bg-blue-600'
    
    const colors = [
      'bg-blue-600',
      'bg-green-600',
      'bg-purple-600',
      'bg-pink-600',
      'bg-indigo-600',
      'bg-red-600',
      'bg-yellow-600',
      'bg-teal-600'
    ]
    
    const charCode = name.charCodeAt(0)
    return colors[charCode % colors.length]
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-20">
      <div className="flex flex-col h-full">
        {/* Logo / Brand */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">SS</span>
            </div>
            <span className="text-xl font-bold text-gray-900">SignSpeak</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const hasChildren = item.children && item.children.length > 0
              const isOpen = openMenus[item.name]
              const parentActive = hasChildren && isParentActive(item.children)

              // Si NO tiene hijos (es un link directo)
              if (!hasChildren) {
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`
                        flex items-center space-x-3 px-3 py-2.5 rounded-lg
                        transition-all duration-200
                        ${isActive(item.href)
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                )
              }

              // Si TIENE hijos (menú desplegable)
              return (
                <li key={item.name}>
                  {/* Parent Button */}
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                      transition-all duration-200
                      ${parentActive
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.name}</span>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {/* Submenu */}
                  {isOpen && (
                    <ul className="mt-1 ml-8 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            to={child.href}
                            className={`
                              block px-3 py-2 rounded-lg text-sm
                              transition-all duration-200
                              ${isActive(child.href)
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                              }
                            `}
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer / User Info */}
        <div className="p-4 border-t border-gray-200">
          {/* User Info Card */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center space-x-3 px-3 py-2 mb-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Avatar */}
              <div className={`w-10 h-10 ${getAvatarColor(userInfo?.nombre)} rounded-full flex items-center justify-center flex-shrink-0`}>
                <span className="text-sm font-bold text-white">
                  {getInitials(userInfo?.nombre)}
                </span>
              </div>
              
              {/* User Info */}
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userInfo?.nombre || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userInfo?.email || 'usuario@signspeak.com'}
                </p>
              </div>
              
              {/* Dropdown Icon */}
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <div className="p-3 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase">Tipo de Usuario</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize mt-1">
                    {userInfo?.tipoUsuario || userInfo?.tipo_usuario || 'No especificado'}
                  </p>
                </div>
                
                <Link
                  to="/perfil"
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User className="w-4 h-4" />
                  <span>Mi Perfil</span>
                </Link>
                
                <Link
                  to="/configuracion"
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings className="w-4 h-4" />
                  <span>Configuración</span>
                </Link>
              </div>
            )}
          </div>
          
          {/* Botón Cerrar Sesión */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  )
}