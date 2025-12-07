// ============================================
// ARCHIVO: src/context/AuthContext.jsx
// Ubicación: frontend/src/context/AuthContext.jsx
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
    baseURL: 'http://localhost:8000/api/auth', // Ajusta según tu backend
  })

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
        // Configurar el token en axios
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
      } catch (error) {
        console.error('Error al cargar usuario:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  // Función de login
  const login = async (credentials) => {
    try {
      setError(null)
      const response = await api.post('/login/', credentials)

      if (response.data.success) {
        const { user: userData, tokens, redirect_to } = response.data.data

        // Guardar token
        localStorage.setItem('token', tokens.access)
        localStorage.setItem('refreshToken', tokens.refresh)
        
        // Guardar usuario (IMPORTANTE: esto es lo que el Sidebar necesita)
        const userToStore = {
          id_usuario: userData.id_usuario,
          nombre: userData.nombre,
          email: userData.email,
          tipo_usuario: userData.tipo_usuario,
          tipoUsuario: userData.tipo_usuario, // Por compatibilidad
          activo: userData.activo,
          is_staff: userData.is_staff,
          foto_perfil: userData.foto_perfil
        }
        
        localStorage.setItem('user', JSON.stringify(userToStore))
        setUser(userToStore)

        // Configurar token en axios
        api.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`

        return {
          success: true,
          redirect_to: redirect_to
        }
      }
    } catch (error) {
      console.error('Error en login:', error)
      setError(error.response?.data?.message || 'Error al iniciar sesión')
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
        api.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`

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