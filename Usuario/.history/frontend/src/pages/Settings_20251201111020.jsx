import React, { useState, useEffect } from 'react';
import './Pages.css';

function Settings() {
  // Estados para las configuraciones
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('fontSize');
    return saved || 'medium';
  });

  const [contrast, setContrast] = useState(() => {
    const saved = localStorage.getItem('contrast');
    return saved || 'normal';
  });

  const [showTutorial, setShowTutorial] = useState(() => {
    const saved = localStorage.getItem('showTutorial');
    return saved ? JSON.parse(saved) : true;
  });

  // Aplicar tema oscuro
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Aplicar tamaño de fuente
  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  // Aplicar contraste
  useEffect(() => {
    document.documentElement.setAttribute('data-contrast', contrast);
    localStorage.setItem('contrast', contrast);
  }, [contrast]);

  // Guardar preferencia de tutorial
  useEffect(() => {
    localStorage.setItem('showTutorial', JSON.stringify(showTutorial));
  }, [showTutorial]);

  const handleResetSettings = () => {
    if (window.confirm('¿Estás seguro de que deseas restablecer todas las configuraciones?')) {
      setDarkMode(false);
      setFontSize('medium');
      setContrast('normal');
      setShowTutorial(true);
      localStorage.removeItem('darkMode');
      localStorage.removeItem('fontSize');
      localStorage.removeItem('contrast');
      localStorage.removeItem('showTutorial');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Ajustes</h1>
          <p className="page-subtitle">Personaliza tu experiencia de aprendizaje</p>
        </div>
      </div>

      <div className="settings-container">
        {/* Apariencia */}
        <div className="content-card settings-section">
          <h2 className="settings-section-title">👁️ Apariencia</h2>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Modo Oscuro</h3>
              <p>Reduce el brillo de la pantalla para mayor comodidad</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Tamaño de Fuente</h3>
              <p>Ajusta el tamaño del texto para mejor legibilidad</p>
            </div>
            <div className="radio-group">
              <label className={`radio-option ${fontSize === 'small' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="fontSize" 
                  value="small"
                  checked={fontSize === 'small'}
                  onChange={(e) => setFontSize(e.target.value)}
                />
                <span>Pequeño</span>
              </label>
              <label className={`radio-option ${fontSize === 'medium' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="fontSize" 
                  value="medium"
                  checked={fontSize === 'medium'}
                  onChange={(e) => setFontSize(e.target.value)}
                />
                <span>Mediano</span>
              </label>
              <label className={`radio-option ${fontSize === 'large' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="fontSize" 
                  value="large"
                  checked={fontSize === 'large'}
                  onChange={(e) => setFontSize(e.target.value)}
                />
                <span>Grande</span>
              </label>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Contraste</h3>
              <p>Mejora la visibilidad de los elementos</p>
            </div>
            <div className="radio-group">
              <label className={`radio-option ${contrast === 'normal' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="contrast" 
                  value="normal"
                  checked={contrast === 'normal'}
                  onChange={(e) => setContrast(e.target.value)}
                />
                <span>Normal</span>
              </label>
              <label className={`radio-option ${contrast === 'high' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="contrast" 
                  value="high"
                  checked={contrast === 'high'}
                  onChange={(e) => setContrast(e.target.value)}
                />
                <span>Alto</span>
              </label>
            </div>
          </div>
        </div>

        {/* Aprendizaje */}
        <div className="content-card settings-section">
          <h2 className="settings-section-title">📚 Aprendizaje</h2>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Mostrar Tutorial</h3>
              <p>Muestra guías interactivas al iniciar la aplicación</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={showTutorial}
                onChange={(e) => setShowTutorial(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Acciones */}
        <div className="content-card settings-section">
          <h2 className="settings-section-title">🔧 Acciones</h2>
          
          <button className="reset-button" onClick={handleResetSettings}>
            🔄 Restablecer Configuración
          </button>
        </div>

        {/* Vista Previa */}
        <div className="content-card settings-section">
          <h2 className="settings-section-title">👀 Vista Previa</h2>
          <div className="preview-box">
            <p>Este es un ejemplo de cómo se verá el texto con tu configuración actual.</p>
            <p>La configuración se aplica automáticamente en toda la aplicación.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;