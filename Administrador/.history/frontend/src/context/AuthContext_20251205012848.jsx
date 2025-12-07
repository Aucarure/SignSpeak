// ============================================
// ARCHIVO: src/context/AuthContext.jsx (PROYECTO ADMIN - puerto 5174)
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

  const LOGIN_URL = 'http://localhost:3000/login'

  const api = axios.create({
    baseURL: 'http://localhost:8000/api/auth',
  })

  // Cargar usuario SOLO UNA VEZ al iniciar
  useEffect(() => {
    const loadUser = () => {
      console.log('🔍 [AuthContext Admin] Cargando usuario...')
      
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('token')
      
      console.log('📦 Token existe:', !!storedToken)
      console.log('📦 User existe:', !!storedUser)
      
      if (!storedUser || !storedToken) {
        console.log('⚠️ No hay datos de sesión')
        setLoading(false)
        return
      }
      
      if (storedToken.trim() === '' || storedToken === 'null' || storedToken === 'undefined') {
        console.log('❌ Token inválido')
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        setLoading(false)
        return
      }
      
      try {
        const userData = JSON.parse(storedUser)
        
        console.log('👤 Usuario cargado:', userData.nombre)
        console.log('🔐 is_staff:', userData.is_staff)
        
        if (!userData.email) {
          console.log('❌ Usuario sin email, datos inválidos')
          localStorage.removeItem('user')
          localStorage.removeItem('token')
          setLoading(false)
          return
        }
        
        setUser(userData)
        api.defaults.headers.common['Authorization'] = `Token ${storedToken}`
        
        console.log('✅ Autenticación cargada exitosamente')
        
      } catch (error) {
        console.error('❌ Error al parsear usuario:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
      
      setLoading(false)
    }

    loadUser()
  }, []) // Array vacío = solo se ejecuta UNA VEZ al montar

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      
      if (refreshToken) {
        await api.post('/logout/', { refresh_token: refreshToken })
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      setUser(null)
      delete api.defaults.headers.common['Authorization']
      
      console.log('👋 Sesión cerrada, redirigiendo al login...')
      window.location.href = LOGIN_URL
    }
  }

  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const verifyToken = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return false
      return true
    } catch (error) {
      console.error('Token inválido:', error)
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
    isLoading: loading, // ← IMPORTANTE: Exportar también como isLoading
    LOGIN_URL
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}