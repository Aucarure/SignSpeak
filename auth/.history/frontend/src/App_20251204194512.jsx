import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Páginas temporales para demostración
const UserDashboard = () => (
  <div className="min-h-screen bg-gray-100 p-8">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard de Usuario</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Bienvenido al dashboard de usuario de SignSpeak</p>
        <p className="text-sm text-gray-500 mt-2">
          Aquí irán las funcionalidades del usuario normal
        </p>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => (
  <div className="min-h-screen bg-gray-100 p-8">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard de Administrador</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Bienvenido al dashboard de administrador de SignSpeak</p>
        <p className="text-sm text-gray-500 mt-2">
          Aquí irán las funcionalidades del administrador
        </p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas protegidas - Usuario */}
          <Route
            path="/usuario/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas - Administrador */}
          <Route
            path="/administrador/dashboard"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;