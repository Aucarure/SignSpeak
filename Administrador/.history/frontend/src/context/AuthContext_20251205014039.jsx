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

  const api = axios.create({
    baseURL: 'http://localhost:8000/api/auth',
  })

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

  const login = async (credentials) => {
    try {
      setError(null)
      console.log('🔐 Intentando login con:', credentials.email)
      
      const response = await api.post('/login/', credentials)
      console.log('📦 Respuesta COMPLETA del backend:', response.data)

      // Extraer datos de manera flexible
      let userData, token, refreshToken

      // Opción 1: Estructura con success
      if (response.data.success && response.data.data) {
        userData = response.data.data.user
        token = response.data.data.tokens?.access || response.data.data.tokens?.token || response.data.data.token
        refreshToken = response.data.data.tokens?.refresh
      }
      // Opción 2: Estructura directa
      else if (response.data.user) {
        userData = response.data.user
        token = response.data.token || response.data.access
        refreshToken = response.data.refresh
      }
      // Opción 3: Token y user en raíz
      else if (response.data.token) {
        userData = response.data
        token = response.data.token
        refreshToken = response.data.refresh_token
      }
      else {
        console.error('❌ Estructura de respuesta no reconocida:', response.data)
        throw new Error('Formato de respuesta inválido')
      }

      if (!token || !userData) {
        console.error('❌ Faltan datos:', { token: !!token, userData: !!userData })
        throw new Error('Faltan datos de autenticación')
      }

      console.log('📋 Datos extraídos:')
      console.log('  - Token:', token.substring(0, 20) + '...')
      console.log('  - Usuario:', userData)

      // Guardar token
      localStorage.setItem('token', token)
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }
      console.log('✅ Token guardado')

      // Preparar usuario en formato estándar
      const userToStore = {
        id_usuario: userData.id_usuario || userData.id || userData.user_id,
        nombre: userData.nombre || userData.name || userData.username,
        email: userData.email,
        tipo_usuario: userData.tipo_usuario || userData.tipoUsuario || userData.user_type || 'estudiante',
        tipoUsuario: userData.tipo_usuario || userData.tipoUsuario || userData.user_type || 'estudiante',
        activo: userData.activo !== undefined ? userData.activo : true,
        is_staff: userData.is_staff !== undefined ? userData.is_staff : false,
        foto_perfil: userData.foto_perfil || userData.profile_picture || null
      }
      
      localStorage.setItem('user', JSON.stringify(userToStore))
      setUser(userToStore)
      
      console.log('✅ Usuario guardado:', userToStore)
      console.log('🔐 ¿Es admin (is_staff)?', userToStore.is_staff)

      // Configurar axios
      api.defaults.headers.common['Authorization'] = `Token ${token}`

      // Determinar redirección
      let redirect_to
      
      if (userToStore.is_staff) {
        redirect_to = 'http://localhost:5174/dashboard'
        console.log('🔐 Redirigiendo al panel de ADMIN...')
      } else {
        redirect_to = 'http://localhost:5173/traducir'
        console.log('👤 Redirigiendo a la APP de USUARIO...')
      }

      // Verificar que se guardó correctamente
      console.log('🔍 Verificación final:')
      console.log('  - Token en localStorage:', localStorage.getItem('token') ? '✅' : '❌')
      console.log('  - User en localStorage:', localStorage.getItem('user') ? '✅' : '❌')

      return {
        success: true,
        redirect_to: redirect_to
      }
      
    } catch (error) {
      console.error('❌ Error en login:', error)
      console.error('❌ Detalle del error:', error.response?.data)
      const errorMessage = error.response?.data?.message || error.message || 'Error al iniciar sesión'
      setError(errorMessage)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      setError(null)
      console.log('📝 Intentando registro con:', userData.email)
      
      const response = await api.post('/register/', userData)
      console.log('📦 Respuesta de registro:', response.data)

      // Extraer datos de manera flexible (igual que login)
      let newUser, token, refreshToken

      if (response.data.success && response.data.data) {
        newUser = response.data.data.user
        token = response.data.data.tokens?.access || response.data.data.tokens?.token || response.data.data.token
        refreshToken = response.data.data.tokens?.refresh
      } else if (response.data.user) {
        newUser = response.data.user
        token = response.data.token || response.data.access
        refreshToken = response.data.refresh
      } else if (response.data.token) {
        newUser = response.data
        token = response.data.token
        refreshToken = response.data.refresh_token
      } else {
        console.error('❌ Estructura de respuesta no reconocida:', response.data)
        throw new Error('Formato de respuesta inválido')
      }

      if (!token || !newUser) {
        console.error('❌ Faltan datos:', { token: !!token, newUser: !!newUser })
        throw new Error('Faltan datos de autenticación')
      }

      console.log('📋 Datos de registro extraídos:')
      console.log('  - Token:', token.substring(0, 20) + '...')
      console.log('  - Usuario:', newUser)

      // Guardar token
      localStorage.setItem('token', token)
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }
      
      // Preparar usuario en formato estándar
      const userToStore = {
        id_usuario: newUser.id_usuario || newUser.id || newUser.user_id,
        nombre: newUser.nombre || newUser.name || newUser.username,
        email: newUser.email,
        tipo_usuario: newUser.tipo_usuario || newUser.tipoUsuario || newUser.user_type || 'estudiante',
        tipoUsuario: newUser.tipo_usuario || newUser.tipoUsuario || newUser.user_type || 'estudiante',
        activo: newUser.activo !== undefined ? newUser.activo : true,
        is_staff: newUser.is_staff !== undefined ? newUser.is_staff : false,
        foto_perfil: newUser.foto_perfil || newUser.profile_picture || null
      }
      
      localStorage.setItem('user', JSON.stringify(userToStore))
      setUser(userToStore)
      api.defaults.headers.common['Authorization'] = `Token ${token}`

      console.log('✅ Usuario registrado:', userToStore)
      console.log('🔐 ¿Es admin (is_staff)?', userToStore.is_staff)

      // Determinar redirección
      let redirect_to
      
      if (userToStore.is_staff) {
        redirect_to = 'http://localhost:5174/dashboard'
        console.log('🔐 Redirigiendo al panel de ADMIN...')
      } else {
        redirect_to = 'http://localhost:5173/traducir'
        console.log('👤 Redirigiendo a la APP de USUARIO...')
      }

      // Verificar que se guardó correctamente
      console.log('🔍 Verificación final:')
      console.log('  - Token en localStorage:', localStorage.getItem('token') ? '✅' : '❌')
      console.log('  - User en localStorage:', localStorage.getItem('user') ? '✅' : '❌')

      return {
        success: true,
        redirect_to: redirect_to
      }
      
    } catch (error) {
      console.error('❌ Error en registro:', error)
      console.error('❌ Detalle del error:', error.response?.data)
      const errorMessage = error.response?.data?.message || error.message || 'Error al registrar usuario'
      setError(errorMessage)
      throw error
    }
  }

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