import React from 'react';
import './Pages.css';

function Learn() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Aprender</h1>
          <p className="page-subtitle">Lecciones y práctica</p>
        </div>
      </div>

      <div className="content-card">
        <div className="empty-state">
          <div className="empty-icon">📖</div>
          <h2>Lecciones de Lenguaje de Señas</h2>
          <p>Próximamente: Aprende señas paso a paso con lecciones interactivas</p>
        </div>
      </div>
    </div>
  );
}

export default Learn;