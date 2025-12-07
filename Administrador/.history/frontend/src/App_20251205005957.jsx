import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'

// Usuarios
import UsuariosPage from './pages/usuarios/UsuariosPage'

// Diccionario
import DiccionarioPage from './pages/diccionario/DiccionarioPage'
import CategoriasPage from './pages/diccionario/CategoriasPage'

// Ejercicios
import EjerciciosPage from './pages/ejercicios/EjerciciosPage'
import SesionesPage from './pages/ejercicios/SesionesPage'

// Progreso
import ProgresoPage from './pages/progreso/ProgresoPage'
import DetalleUsuarioPage from './pages/progreso/DetalleUsuarioPage'
import ErroresPage from './pages/progreso/ErroresPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rutas protegidas para ADMIN */}
        <Route
          path="/*"
          element={
            <ProtectedRoute adminOnly>
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  {/* Usuarios */}
                  <Route path="/usuarios" element={<UsuariosPage />} />
                  
                  {/* Diccionario */}
                  <Route path="/diccionario" element={<DiccionarioPage />} />
                  <Route path="/diccionario/categorias" element={<CategoriasPage />} />
                  
                  {/* Ejercicios */}
                  <Route path="/ejercicios" element={<EjerciciosPage />} />
                  <Route path="/ejercicios/sesiones" element={<SesionesPage />} />
                  
                  {/* Progreso */}
                  <Route path="/progreso" element={<ProgresoPage />} />
                  <Route path="/progreso/errores" element={<ErroresPage />} />
                  <Route path="/progreso/:usuarioId" element={<DetalleUsuarioPage />} />
                  
                  {/* Otras rutas admin se agregarán después */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
        
        {/* Rutas para USUARIO NORMAL (agregar después) */}
        <Route
          path="/app/*"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Área de Usuario
                  </h1>
                  <p className="text-gray-600">
                    Panel de usuario en desarrollo...
                  </p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App