// ============================================
// ARCHIVO: src/context/AuthContext.jsx
// PROYECTO LOGIN (http://localhost:3000)
// ============================================
import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Configurar axios con la URL base del backend
  const api = axios.create({
    baseURL: 'http://localhost:8000/api/auth',
  })

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
        api.defaults.headers.common['Authorization'] = `Token ${storedToken}`
      } catch (error) {
        console.error('Error al cargar usuario:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  // ============================================
  // FUNCIÓN DE LOGIN CORREGIDA
  // ============================================
  const login = async (credentials) => {
    try {
      setError(null)
      console.log('🔐 Intentando login con:', credentials.email)
      
      const response = await api.post('/login/', credentials)
      console.log('📦 Respuesta del backend:', response.data)

      if (response.data.success) {
        const { user: userData, tokens } = response.data.data

        // 1. GUARDAR TOKEN
        const token = tokens.access || tokens.token || response.data.token
        localStorage.setItem('token', token)
        
        if (tokens.refresh) {
          localStorage.setItem('refreshToken', tokens.refresh)
        }
        
        console.log('✅ Token guardado:', token.substring(0, 20) + '...')

        // 2. GUARDAR USUARIO EN FORMATO CORRECTO
        const userToStore = {
          id_usuario: userData.id_usuario || userData.id,
          nombre: userData.nombre || userData.name,
          email: userData.email,
          tipo_usuario: userData.tipo_usuario || userData.tipoUsuario,
          tipoUsuario: userData.tipo_usuario || userData.tipoUsuario, // Por compatibilidad
          activo: userData.activo !== undefined ? userData.activo : true,
          is_staff: userData.is_staff || false, // ← MUY IMPORTANTE
          foto_perfil: userData.foto_perfil || null
        }
        
        localStorage.setItem('user', JSON.stringify(userToStore))
        setUser(userToStore)
        
        console.log('✅ Usuario guardado:', userToStore)
        console.log('🔐 ¿Es admin?', userToStore.is_staff)

        // Configurar token en axios
        api.defaults.headers.common['Authorization'] = `Token ${token}`

        // 3. DETERMINAR REDIRECCIÓN
        let redirect_to = '/usuario/dashboard' // Por defecto usuario normal
        
        if (userToStore.is_staff) {
          // Es ADMIN → Redirigir al panel de admin (puerto 5174)
          redirect_to = 'http://localhost:5174/dashboard'
          console.log('🔐 Redirigiendo al panel de ADMIN...')
        } else {
          // Es USUARIO NORMAL → Redirigir a la app de usuario
          redirect_to = 'http://localhost:5173/traducir'
          console.log('👤 Redirigiendo a la APP de USUARIO...')
        }

        return {
          success: true,
          redirect_to: redirect_to
        }
      }
      
      return {
        success: false,
        error: 'Respuesta inesperada del servidor'
      }
      
    } catch (error) {
      console.error('❌ Error en login:', error)
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión'
      setError(errorMessage)
      throw error
    }
  }

  // Función de registro
  const register = async (userData) => {
    try {
      setError(null)
      const response = await api.post('/register/', userData)

      if (response.data.success) {
        const { user: newUser, tokens } = response.data.data

        // Guardar token
        localStorage.setItem('token', tokens.access)
        localStorage.setItem('refreshToken', tokens.refresh)
        
        // Guardar usuario
        const userToStore = {
          id_usuario: newUser.id_usuario,
          nombre: newUser.nombre,
          email: newUser.email,
          tipo_usuario: newUser.tipo_usuario,
          tipoUsuario: newUser.tipo_usuario,
          activo: newUser.activo,
          is_staff: newUser.is_staff || false,
          foto_perfil: newUser.foto_perfil
        }
        
        localStorage.setItem('user', JSON.stringify(userToStore))
        setUser(userToStore)

        // Configurar token en axios
        api.defaults.headers.common['Authorization'] = `Token ${tokens.access}`

        return {
          success: true
        }
      }
    } catch (error) {
      console.error('Error en registro:', error)
      setError(error.response?.data?.message || 'Error al registrar usuario')
      throw error
    }
  }

  // Función de logout
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      
      if (refreshToken) {
        await api.post('/logout/', { refresh_token: refreshToken })
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      // Limpiar todo
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      setUser(null)
      delete api.defaults.headers.common['Authorization']
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}