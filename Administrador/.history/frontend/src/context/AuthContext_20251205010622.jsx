// ============================================
// ARCHIVO: src/context/AuthContext.jsx
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

  // URL del proyecto de login externo
  const LOGIN_URL = 'http://localhost:3000/login'

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
        const userData = JSON.parse(storedUser)
        setUser(userData)
        // Configurar el token en axios (ajusta según tu backend use Bearer o Token)
        api.defaults.headers.common['Authorization'] = `Token ${storedToken}`
      } catch (error) {
        console.error('Error al cargar usuario:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

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

  // Función para actualizar usuario
  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  // Función para verificar si el token sigue válido
  const verifyToken = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return false

      // Opcional: llamar a un endpoint de verificación
      // await api.post('/verify/', { token })
      return true
    } catch (error) {
      console.error('Token inválido:', error)
      // Limpiar datos
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      return false
    }
  }

  const value = {
    user,
    loading,
    error,
    logout,
    updateUser,
    verifyToken,
    isAuthenticated: !!user,
    isLoading: loading,
    LOGIN_URL // Exportar la URL para usarla en otros componentes
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}