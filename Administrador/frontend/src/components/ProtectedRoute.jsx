// ============================================
// ARCHIVO: src/components/ProtectedRoute.jsx
// PROYECTO ADMIN (http://localhost:5174)
// ============================================
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  
  useEffect(() => {
    // Si terminó de cargar y NO está autenticado
    if (!loading && !user) {
      window.location.href = 'http://localhost:3000/login'
    }
    
    // Si requiere admin y el usuario NO es admin
    if (!loading && user && adminOnly && !user.is_staff) {
      window.location.href = 'http://localhost:5173/traducir'
    }
  }, [loading, user, adminOnly])
  
  // Mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado, no renderizar
  if (!user) {
    return null
  }

  // Si requiere admin y no es admin, no renderizar
  if (adminOnly && !user.is_staff) {
    return null
  }

  // Todo OK, mostrar contenido
  return children
}