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

      {/* Progress Section */}
      <div className="sidebar-footer">
        <div className="progress-section">
          <div className="progress-header">
            <span>Tu progreso</span>
            <span className="progress-level">Nivel 3</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: '35%' }}></div>
          </div>
          <p className="progress-text">¡Sigue así! 35% hasta el siguiente nivel</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;