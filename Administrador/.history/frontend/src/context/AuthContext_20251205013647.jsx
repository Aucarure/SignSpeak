// ============================================
// ARCHIVO: src/context/AuthContext.jsx
// PROYECTO ADMIN (http://localhost:5174)
// ============================================
import { createContext, useState, useContext, useEffect } from 'react'

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
  const [isLoading, setIsLoading] = useState(true)
  
  // URL del login externo
  const LOGIN_URL = 'http://localhost:3000/login'

  useEffect(() => {
    // Leer datos del localStorage (guardados por el login en puerto 3000)
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    
    console.log('🔍 Verificando autenticación...')
    console.log('  - Token:', storedToken ? '✅ Existe' : '❌ No existe')
    console.log('  - User:', storedUser ? '✅ Existe' : '❌ No existe')
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser)
        console.log('👤 Usuario cargado:', parsedUser)
        console.log('🔐 ¿Es admin?', parsedUser.is_staff)
        setUser(parsedUser)
      } catch (error) {
        console.error('❌ Error al parsear usuario:', error)
        // Si hay error, limpiar datos corruptos
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
      }
    } else {
      console.log('⚠️ No hay sesión activa')
    }
    
    setIsLoading(false)
  }, [])

  const logout = async () => {
    console.log('👋 Cerrando sesión...')
    
    // Limpiar localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    
    // Limpiar estado
    setUser(null)
    
    console.log('✅ LocalStorage limpiado')
    console.log('🔄 Redirigiendo a:', LOGIN_URL)
    
    // Redirigir al login externo
    window.location.href = LOGIN_URL
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    LOGIN_URL
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}