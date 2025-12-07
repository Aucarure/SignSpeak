// ============================================
// ARCHIVO: src/App.jsx (PROYECTO ADMIN - puerto 5174)
// ============================================
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/layout/Layout'

// Páginas
import Dashboard from './pages/Dashboard'
import UsuariosPage from './pages/usuarios/UsuariosPage'
import DiccionarioPage from './pages/diccionario/DiccionarioPage'
import CategoriasPage from './pages/diccionario/CategoriasPage'
import EjerciciosPage from './pages/ejercicios/EjerciciosPage'
import SesionesPage from './pages/ejercicios/SesionesPage'
import ProgresoPage from './pages/progreso/ProgresoPage'
import DetalleUsuarioPage from './pages/progreso/DetalleUsuarioPage'
import ErroresPage from './pages/progreso/ErroresPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Ruta raíz redirige a dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Todas las rutas están protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute adminOnly>
              <Layout>
                <UsuariosPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/diccionario"
          element={
            <ProtectedRoute adminOnly>
              <Layout>
                <DiccionarioPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/diccionario/categorias"
          element={
            <ProtectedRoute adminOnly>
              <Layout>
                <CategoriasPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/ejercicios"
          element={
            <ProtectedRoute adminOnly>
              <Layout>
                <EjerciciosPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/ejercicios/sesiones"
          element={
            <ProtectedRoute adminOnly>
              <Layout>
                <SesionesPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/progreso"
          element={
            <ProtectedRoute adminOnly>
              <Layout>
                <ProgresoPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/progreso/errores"
          element={
            <ProtectedRoute adminOnly>
              <Layout>
                <ErroresPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/progreso/:usuarioId"
          element={
            <ProtectedRoute adminOnly>
              <Layout>
                <DetalleUsuarioPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        {/* Ruta 404 - Cualquier otra ruta no encontrada */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App