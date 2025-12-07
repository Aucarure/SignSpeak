import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'translate',
      icon: '🌐',
      title: 'Traducir',
      subtitle: 'Tiempo real',
      path: '/traducir',
      badge: '✨'
    },
    {
      id: 'dictionary',
      icon: '📚',
      title: 'Diccionario',
      subtitle: 'Búsqueda de señas',
      path: '/diccionario'
    },
    {
      id: 'settings',
      icon: '⚙️',
      title: 'Ajustes',
      subtitle: 'Personalización',
      path: '/ajustes'
    }
  ];

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de cerrar sesión?')) {
      // Limpiar todo el localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Redirigir al login externo
      window.location.href = 'http://localhost:3000/login';
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">🤟</div>
          <div className="logo-text">
            <h1>SignSpeak</h1>
            <p>Aprende sin barreras</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <div className="menu-icon">{item.icon}</div>
            <div className="menu-content">
              <span className="menu-title">{item.title}</span>
              <span className="menu-subtitle">{item.subtitle}</span>
            </div>
            {item.badge && <span className="menu-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>

      {/* Footer - Botón Cerrar Sesión */}
      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          <div className="menu-icon">🚪</div>
          <div className="menu-content">
            <span className="menu-title">Cerrar Sesión</span>
            <span className="menu-subtitle">Salir de la app</span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;