import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'

// ... tus imports

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ELIMINAR esta línea si la tienes */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        
        {/* Todas las rutas son protegidas */}
        <Route
          path="/*"
          element={
            <ProtectedRoute adminOnly>
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/usuarios" element={<UsuariosPage />} />
                  <Route path="/diccionario" element={<DiccionarioPage />} />
                  <Route path="/diccionario/categorias" element={<CategoriasPage />} />
                  <Route path="/ejercicios" element={<EjerciciosPage />} />
                  <Route path="/ejercicios/sesiones" element={<SesionesPage />} />
                  <Route path="/progreso" element={<ProgresoPage />} />
                  <Route path="/progreso/errores" element={<ErroresPage />} />
                  <Route path="/progreso/:usuarioId" element={<DetalleUsuarioPage />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App