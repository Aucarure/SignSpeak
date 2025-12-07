// ============================================
// ARCHIVO: src/components/ProtectedRoute.jsx
// ============================================
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated, isLoading, LOGIN_URL } = useAuth()
  
  useEffect(() => {
    // Si no está autenticado, redirigir al login externo
    if (!isLoading && !isAuthenticated) {
      // Guardar la URL actual para volver después del login
      const returnUrl = window.location.pathname + window.location.search
      sessionStorage.setItem('returnUrl', returnUrl)
      
      // Redirigir al login externo
      window.location.href = LOGIN_URL
    }
    
    // Si requiere admin y el usuario NO es admin
    if (!isLoading && isAuthenticated && adminOnly && !user?.is_staff) {
      // Redirigir a la app de usuario
      window.location.href = 'http://localhost:5173/traducir'
    }
  }, [isLoading, isAuthenticated, user, adminOnly, LOGIN_URL])
  
  // Mostrar loading mientras se verifica
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado, no renderizar nada (el useEffect redirigirá)
  if (!isAuthenticated) {
    return null
  }

  // Si requiere admin y no es admin, no renderizar (el useEffect redirigirá)
  if (adminOnly && !user?.is_staff) {
    return null
  }

  // Si todo está OK, renderizar children
  return children
}