// ============================================
// ARCHIVO: src/components/ProtectedRoute.jsx
// Ubicación: frontend/src/components/ProtectedRoute.jsx
// ============================================
import { Navigate } from 'react-router-dom'

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  
  // Si no hay token, redirigir al login
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  try {
    const user = JSON.parse(userStr)
    
    // Verificar si es administrador
    if (!user.is_staff) {
      // Si no es admin, redirigir a la app de usuario
      window.location.href = 'http://localhost:5173/traducir'
      return null
    }
    
    // Si es admin, permitir acceso
    return children
    
  } catch (error) {
    console.error('Error al verificar usuario:', error)
    return <Navigate to="/login" replace />
  }
}