import React, { useState, useEffect } from 'react';

const Settings = () => {
  // Estados para cada configuración
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [practiceReminders, setPracticeReminders] = useState(true);
  const [language, setLanguage] = useState('es');

  // Cargar configuraciones desde localStorage al montar
  useEffect(() => {
    const loadSettings = () => {
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      const savedHighContrast = localStorage.getItem('highContrast') === 'true';
      const savedFontSize = parseInt(localStorage.getItem('fontSize')) || 16;
      const savedReducedMotion = localStorage.getItem('reducedMotion') === 'true';
      const savedSound = localStorage.getItem('soundEnabled') !== 'false';
      const savedVibration = localStorage.getItem('vibrationEnabled') !== 'false';
      const savedReminders = localStorage.getItem('practiceReminders') !== 'false';
      const savedLanguage = localStorage.getItem('language') || 'es';

      setDarkMode(savedDarkMode);
      setHighContrast(savedHighContrast);
      setFontSize(savedFontSize);
      setReducedMotion(savedReducedMotion);
      setSoundEnabled(savedSound);
      setVibrationEnabled(savedVibration);
      setPracticeReminders(savedReminders);
      setLanguage(savedLanguage);

      // Aplicar modo oscuro inmediatamente
      if (savedDarkMode) {
        document.body.classList.add('dark-mode');
      }
      
      // Aplicar alto contraste
      if (savedHighContrast) {
        document.body.classList.add('high-contrast');
      }

      // Aplicar tamaño de fuente
      document.documentElement.style.fontSize = `${savedFontSize}px`;
    };

    loadSettings();
  }, []);

  // Guardar y aplicar configuraciones
  const handleDarkMode = (value) => {
    setDarkMode(value);
    localStorage.setItem('darkMode', value);
    
    if (value) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const handleHighContrast = (value) => {
    setHighContrast(value);
    localStorage.setItem('highContrast', value);
    
    if (value) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  const handleFontSize = (value) => {
    setFontSize(value);
    localStorage.setItem('fontSize', value);
    document.documentElement.style.fontSize = `${value}px`;
  };

  const handleReducedMotion = (value) => {
    setReducedMotion(value);
    localStorage.setItem('reducedMotion', value);
    
    if (value) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  };

  const handleSound = (value) => {
    setSoundEnabled(value);
    localStorage.setItem('soundEnabled', value);
  };

  const handleVibration = (value) => {
    setVibrationEnabled(value);
    localStorage.setItem('vibrationEnabled', value);
    
    // Probar vibración si está soportada y se activa
    if (value && 'vibrate' in navigator) {
      navigator.vibrate(200);
    }
  };

  const handleReminders = (value) => {
    setPracticeReminders(value);
    localStorage.setItem('practiceReminders', value);
  };

  const handleLanguage = (value) => {
    setLanguage(value);
    localStorage.setItem('language', value);
  };

  const getFontSizeLabel = () => {
    if (fontSize <= 14) return 'Pequeño';
    if (fontSize >= 18) return 'Grande';
    return 'Normal';
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>⚙️ Configuración</h1>
          <p style={styles.subtitle}>Personaliza tu experiencia de aprendizaje</p>
        </div>
      </div>

      <div style={styles.content}>
        {/* Apariencia */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>🎨</span>
            <h2 style={styles.sectionTitle}>Apariencia</h2>
          </div>

          <div style={styles.settingsGroup}>
            {/* Modo Oscuro */}
            <div style={styles.settingItem}>
              <div style={styles.settingLeft}>
                <span style={styles.settingIcon}>🌙</span>
                <div>
                  <div style={styles.settingLabel}>Modo Oscuro</div>
                  <div style={styles.settingDescription}>Reduce el brillo de la pantalla</div>
                </div>
              </div>
              <label style={styles.toggle}>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => handleDarkMode(e.target.checked)}
                  style={styles.toggleInput}
                />
                <span style={{
                  ...styles.toggleSlider,
                  background: darkMode ? '#6366f1' : '#e5e7eb'
                }}></span>
              </label>
            </div>

            {/* Alto Contraste */}
            <div style={styles.settingItem}>
              <div style={styles.settingLeft}>
                <span style={styles.settingIcon}>◐</span>
                <div>
                  <div style={styles.settingLabel}>Alto Contraste</div>
                  <div style={styles.settingDescription}>Mejora la visibilidad del texto</div>
                </div>
              </div>
              <label style={styles.toggle}>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => handleHighContrast(e.target.checked)}
                  style={styles.toggleInput}
                />
                <span style={{
                  ...styles.toggleSlider,
                  background: highContrast ? '#6366f1' : '#e5e7eb'
                }}></span>
              </label>
            </div>

            {/* Tamaño de Fuente */}
            <div style={styles.settingItemColumn}>
              <div style={styles.settingLeft}>
                <span style={styles.settingIcon}>T</span>
                <div>
                  <div style={styles.settingLabel}>Tamaño de Fuente</div>
                  <div style={styles.settingDescription}>{fontSize}px</div>
                </div>
              </div>
              
              <div style={styles.sliderContainer}>
                <span style={styles.sliderLabel}>A</span>
                <input
                  type="range"
                  min="12"
                  max="20"
                  value={fontSize}
                  onChange={(e) => handleFontSize(parseInt(e.target.value))}
                  style={styles.slider}
                />
                <span style={styles.sliderLabelLarge}>A</span>
              </div>

              <div style={styles.fontSizeButtons}>
                <button
                  style={{
                    ...styles.fontSizeBtn,
                    ...(fontSize <= 14 ? styles.fontSizeBtnActive : {})
                  }}
                  onClick={() => handleFontSize(14)}
                >
                  Pequeño
                </button>
                <button
                  style={{
                    ...styles.fontSizeBtn,
                    ...(fontSize === 16 ? styles.fontSizeBtnActive : {})
                  }}
                  onClick={() => handleFontSize(16)}
                >
                  Normal
                </button>
                <button
                  style={{
                    ...styles.fontSizeBtn,
                    ...(fontSize >= 18 ? styles.fontSizeBtnActive : {})
                  }}
                  onClick={() => handleFontSize(18)}
                >
                  Grande
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Accesibilidad */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>👁️</span>
            <h2 style={styles.sectionTitle}>Accesibilidad</h2>
          </div>

          <div style={styles.settingsGroup}>
            {/* Reducir Movimiento */}
            <div style={styles.settingItem}>
              <div style={styles.settingLeft}>
                <span style={styles.settingIcon}>⚡</span>
                <div>
                  <div style={styles.settingLabel}>Reducir Movimiento</div>
                  <div style={styles.settingDescription}>Limita animaciones y transiciones</div>
                </div>
              </div>
              <label style={styles.toggle}>
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(e) => handleReducedMotion(e.target.checked)}
                  style={styles.toggleInput}
                />
                <span style={{
                  ...styles.toggleSlider,
                  background: reducedMotion ? '#6366f1' : '#e5e7eb'
                }}></span>
              </label>
            </div>

            {/* Sonido */}
            <div style={styles.settingItem}>
              <div style={styles.settingLeft}>
                <span style={styles.settingIcon}>🔊</span>
                <div>
                  <div style={styles.settingLabel}>Sonido</div>
                  <div style={styles.settingDescription}>Efectos de sonido y audio</div>
                </div>
              </div>
              <label style={styles.toggle}>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => handleSound(e.target.checked)}
                  style={styles.toggleInput}
                />
                <span style={{
                  ...styles.toggleSlider,
                  background: soundEnabled ? '#6366f1' : '#e5e7eb'
                }}></span>
              </label>
            </div>

            {/* Vibración */}
            <div style={styles.settingItem}>
              <div style={styles.settingLeft}>
                <span style={styles.settingIcon}>📳</span>
                <div>
                  <div style={styles.settingLabel}>Vibración</div>
                  <div style={styles.settingDescription}>Feedback táctil al interactuar</div>
                </div>
              </div>
              <label style={styles.toggle}>
                <input
                  type="checkbox"
                  checked={vibrationEnabled}
                  onChange={(e) => handleVibration(e.target.checked)}
                  style={styles.toggleInput}
                />
                <span style={{
                  ...styles.toggleSlider,
                  background: vibrationEnabled ? '#6366f1' : '#e5e7eb'
                }}></span>
              </label>
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>🔔</span>
            <h2 style={styles.sectionTitle}>Notificaciones</h2>
          </div>

          <div style={styles.settingsGroup}>
            <div style={styles.settingItem}>
              <div style={styles.settingLeft}>
                <span style={styles.settingIcon}>🔔</span>
                <div>
                  <div style={styles.settingLabel}>Recordatorios de Práctica</div>
                  <div style={styles.settingDescription}>Te recordaremos practicar cada día</div>
                </div>
              </div>
              <label style={styles.toggle}>
                <input
                  type="checkbox"
                  checked={practiceReminders}
                  onChange={(e) => handleReminders(e.target.checked)}
                  style={styles.toggleInput}
                />
                <span style={{
                  ...styles.toggleSlider,
                  background: practiceReminders ? '#6366f1' : '#e5e7eb'
                }}></span>
              </label>
            </div>
          </div>
        </div>

        {/* Mi Perfil */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>👤</span>
            <h2 style={styles.sectionTitle}>Mi Perfil</h2>
          </div>

          <div style={styles.settingsGroup}>
            {/* Idioma */}
              <div style={styles.settingItemButton} onClick={() => window.location.href = '/profile'}>
              <div style={styles.settingLeft}>
                <span style={styles.settingIcon}>👤</span>
                <div>
                  <div style={styles.settingLabel}>Mi Perfil</div>
                  <div style={styles.settingDescription}>Gestiona tu cuenta</div>
                </div>
              </div>
              <span style={styles.chevron}>›</span>
            </div>

            <div style={styles.settingItemButton} onClick={() => {}}>
              <div style={styles.settingLeft}>
                <span style={styles.settingIcon}>🌐</span>
                <div>
                  <div style={styles.settingLabel}>Idioma</div>
                  <div style={styles.settingDescription}>Español</div>
                </div>
              </div>
              <span style={styles.chevron}>›</span>
            </div>

            

            <div style={styles.settingItemButton} onClick={() => alert('SignSpeak v1.0.0')}>
              <div style={styles.settingLeft}>
                <span style={styles.settingIcon}>ℹ️</span>
                <div>
                  <div style={styles.settingLabel}>Acerca de SignSpeak</div>
                  <div style={styles.settingDescription}>Versión 1.0.0</div>
                </div>
              </div>
              <span style={styles.chevron}>›</span>
            </div>
          </div>
        </div>

        {/* Privacidad */}
        <div style={styles.privacyBanner}>
          <span style={styles.privacyIcon}>🔒</span>
          <div style={styles.privacyContent}>
            <div style={styles.privacyTitle}>Privacidad y Seguridad</div>
            <div style={styles.privacyText}>
              Tus datos están protegidos. SignSpeak respeta tu privacidad y cumple con estándares de accesibilidad WCAG 2.1.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: {
    marginBottom: '32px'
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  section: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '2px solid #f3f4f6'
  },
  sectionIcon: {
    fontSize: '24px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },
  settingsGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: '#f9fafb',
    borderRadius: '12px',
    transition: 'background 0.2s'
  },
  settingItemColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '20px',
    background: '#f9fafb',
    borderRadius: '12px'
  },
  settingItemButton: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: '#f9fafb',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  settingLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  settingIcon: {
    fontSize: '24px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  settingLabel: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '4px'
  },
  settingDescription: {
    fontSize: '13px',
    color: '#6b7280'
  },
  toggle: {
    position: 'relative',
    display: 'inline-block',
    width: '48px',
    height: '26px',
    cursor: 'pointer'
  },
  toggleInput: {
    opacity: 0,
    width: 0,
    height: 0
  },
  toggleSlider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '26px',
    transition: '0.3s',
    '::before': {
      content: '""',
      position: 'absolute',
      height: '20px',
      width: '20px',
      left: '3px',
      bottom: '3px',
      backgroundColor: 'white',
      borderRadius: '50%',
      transition: '0.3s'
    }
  },
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    width: '100%'
  },
  slider: {
    flex: 1,
    height: '6px',
    borderRadius: '3px',
    background: '#e5e7eb',
    outline: 'none',
    cursor: 'pointer'
  },
  sliderLabel: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '600'
  },
  sliderLabelLarge: {
    fontSize: '20px',
    color: '#6b7280',
    fontWeight: '600'
  },
  fontSizeButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px'
  },
  fontSizeBtn: {
    padding: '10px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    background: 'white',
    fontSize: '13px',
    fontWeight: '600',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  fontSizeBtnActive: {
    background: '#6366f1',
    color: 'white',
    border: '2px solid #6366f1'
  },
  chevron: {
    fontSize: '24px',
    color: '#d1d5db',
    fontWeight: '300'
  },
  privacyBanner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '20px',
    background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
    borderRadius: '16px',
    border: '2px solid #e0e7ff'
  },
  privacyIcon: {
    fontSize: '32px'
  },
  privacyContent: {
    flex: 1
  },
  privacyTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '8px'
  },
  privacyText: {
    fontSize: '13px',
    color: '#6b7280',
    lineHeight: '1.5'
  }
};

export default Settings;