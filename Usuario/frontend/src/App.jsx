import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Translator from './pages/Translator';
import Learn from './pages/Learn';
import Dictionary from './pages/Dictionary';
import Settings from './pages/Settings';
import Profile from './pages/Profile';  // ✅ AGREGAR ESTA LÍNEA
import DiccionarioPage from './pages/diccionario/DiccionarioPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/traducir" replace />} />
          <Route path="aprender" element={<Learn />} />
          <Route path="traducir" element={<Translator />} />
          <Route path="diccionario" element={<DiccionarioPage />} />
          <Route path="ajustes" element={<Settings />} />
          <Route path="profile" element={<Profile />} />  {/* ✅ AGREGAR ESTA LÍNEA */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;