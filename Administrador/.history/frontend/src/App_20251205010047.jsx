// ============================================
// ARCHIVO: src/App.jsx (ejemplo)
// Ubicación: frontend/src/App.jsx
// ============================================
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { Toaster } from 'sonner'

// Importar tus páginas de admin
import MainLayout from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import UsuariosPage from './pages/admin/UsuariosPage'
import DiccionarioPage from './pages/admin/DiccionarioPage'
import CategoriasPage from './pages/admin/CategoriasPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Rutas protegidas del admin */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <UsuariosPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/diccionario"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <DiccionarioPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/diccionario/categorias"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CategoriasPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Ruta por defecto */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App