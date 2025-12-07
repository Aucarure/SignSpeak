import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import Ejercicios from './pages/Ejercicios';
import Progreso from './pages/Progreso';
import Reportes from './pages/Reportes';
import Settings from './pages/Settings';
import DiccionarioPage from './pages/diccionario/DiccionarioPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/diccionario" element={<DiccionarioPage />} />
        <Route path="/ejercicios" element={<Ejercicios />} />
        <Route path="/progreso" element={<Progreso />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;