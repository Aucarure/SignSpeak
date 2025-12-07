import React from 'react';
import './Pages.css';

function Settings() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Ajustes</h1>
          <p className="page-subtitle">Personalización</p>
        </div>
      </div>

      <div className="content-card">
        <div className="empty-state">
          <div className="empty-icon">⚙️</div>
          <h2>Configuración</h2>
          <p>Próximamente: Personaliza tu experiencia de aprendizaje</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;