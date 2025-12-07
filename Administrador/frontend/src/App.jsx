// ============================================
// ARCHIVO: src/App.jsx (PROYECTO ADMIN - puerto 5174)
// SIN PROTECCIÓN - Funciona como antes
// ============================================
import { Routes, Route, Navigate } from 'react-router-dom'
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
    <Routes>
      {/* Ruta raíz redirige a dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Todas las rutas SIN protección */}
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
      
      <Route
        path="/usuarios"
        element={
          <Layout>
            <UsuariosPage />
          </Layout>
        }
      />
      
      <Route
        path="/diccionario"
        element={
          <Layout>
            <DiccionarioPage />
          </Layout>
        }
      />
      
      <Route
        path="/diccionario/categorias"
        element={
          <Layout>
            <CategoriasPage />
          </Layout>
        }
      />
      
      <Route
        path="/ejercicios"
        element={
          <Layout>
            <EjerciciosPage />
          </Layout>
        }
      />
      
      <Route
        path="/ejercicios/sesiones"
        element={
          <Layout>
            <SesionesPage />
          </Layout>
        }
      />
      
      <Route
        path="/progreso"
        element={
          <Layout>
            <ProgresoPage />
          </Layout>
        }
      />
      
      <Route
        path="/progreso/errores"
        element={
          <Layout>
            <ErroresPage />
          </Layout>
        }
      />
      
      <Route
        path="/progreso/:usuarioId"
        element={
          <Layout>
            <DetalleUsuarioPage />
          </Layout>
        }
      />
      
      {/* Ruta 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App