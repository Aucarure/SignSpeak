import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    avatar: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState({});
  const [activeTab, setActiveTab] = useState('info');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [stats] = useState({
    senasAprendidas: 156,
    diasRacha: 12,
    tiempoTotal: 24.5,
    nivel: 3,
    experiencia: 2850,
    siguienteNivel: 3000,
    logros: 8,
    rankingGlobal: 342
  });

  useEffect(() => {
    const loadUserData = () => {
      const savedUser = localStorage.getItem('userData');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        if (userData.avatar) {
          setAvatarPreview(userData.avatar);
        }
      } else {
        const defaultUser = {
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan.perez@example.com',
          telefono: '+51 999 888 777',
          fechaNacimiento: '1990-05-15',
          avatar: null
        };
        setUser(defaultUser);
        localStorage.setItem('userData', JSON.stringify(defaultUser));
      }
    };

    loadUserData();
  }, []);

  const handleSave = () => {
    localStorage.setItem('userData', JSON.stringify(tempUser));
    setUser(tempUser);
    setIsEditing(false);
    showMessage('success', '✅ Perfil actualizado exitosamente');
  };

  const handleCancel = () => {
    setTempUser({});
    setIsEditing(false);
    setAvatarPreview(user.avatar);
  };

  const handleEdit = () => {
    setTempUser({ ...user });
    setIsEditing(true);
  };

  const handleInputChange = (field, value) => {
    setTempUser({ ...tempUser, [field]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setTempUser({ ...tempUser, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setTempUser({ ...tempUser, avatar: null });
  };

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      showMessage('error', '❌ Las contraseñas no coinciden');
      return;
    }
    if (passwords.new.length < 6) {
      showMessage('error', '❌ La contraseña debe tener al menos 6 caracteres');
      return;
    }
    showMessage('success', '✅ Contraseña cambiada exitosamente');
    setPasswords({ current: '', new: '', confirm: '' });
    setShowChangePassword(false);
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('⚠️ ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      if (window.confirm('⚠️ CONFIRMACIÓN FINAL: Se perderán todos tus datos, progreso y logros.')) {
        localStorage.clear();
        showMessage('success', '✅ Cuenta eliminada. Redirigiendo...');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    }
  };

  const displayUser = isEditing ? tempUser : user;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>👤 Mi Perfil</h1>
          <p style={styles.subtitle}>Gestiona tu información personal</p>
        </div>
      </div>

      {message.text && (
        <div style={{
          ...styles.messageBanner,
          background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
          borderColor: message.type === 'success' ? '#86efac' : '#fca5a5'
        }}>
          {message.text}
        </div>
      )}

      <div style={styles.content}>
        <div style={styles.profileCard}>
          <div style={styles.avatarSection}>
            <div style={styles.avatarContainer}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" style={styles.avatar} />
              ) : (
                <div style={styles.avatarPlaceholder}>
                  <span style={styles.avatarInitials}>
                    {user.nombre?.charAt(0)}{user.apellido?.charAt(0)}
                  </span>
                </div>
              )}
              {isEditing && (
                <div style={styles.avatarButtons}>
                  <label style={styles.avatarBtn}>
                    📷 Cambiar
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={styles.fileInput}
                    />
                  </label>
                  {avatarPreview && (
                    <button style={styles.avatarBtnDanger} onClick={handleRemoveAvatar}>
                      🗑️ Eliminar
                    </button>
                  )}
                </div>
              )}
            </div>
            <div style={styles.userInfo}>
              <h2 style={styles.userName}>{user.nombre} {user.apellido}</h2>
              <p style={styles.userEmail}>{user.email}</p>
              <div style={styles.levelBadge}>
                ⭐ Nivel {stats.nivel}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'info' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('info')}
          >
            📝 Información Personal
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'security' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('security')}
          >
            🔒 Seguridad
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'stats' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('stats')}
          >
            📊 Estadísticas
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'danger' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('danger')}
          >
            ⚠️ Zona Peligrosa
          </button>
        </div>

        <div style={styles.tabContent}>
          {activeTab === 'info' && (
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Información Personal</h3>
                {!isEditing ? (
                  <button style={styles.editBtn} onClick={handleEdit}>
                    ✏️ Editar
                  </button>
                ) : (
                  <div style={styles.actionButtons}>
                    <button style={styles.cancelBtn} onClick={handleCancel}>
                      ✕ Cancelar
                    </button>
                    <button style={styles.saveBtn} onClick={handleSave}>
                      ✓ Guardar
                    </button>
                  </div>
                )}
              </div>

              <div style={styles.form}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Nombre</label>
                    <input
                      type="text"
                      value={displayUser.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      disabled={!isEditing}
                      style={{
                        ...styles.input,
                        ...(isEditing ? {} : styles.inputDisabled)
                      }}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Apellido</label>
                    <input
                      type="text"
                      value={displayUser.apellido}
                      onChange={(e) => handleInputChange('apellido', e.target.value)}
                      disabled={!isEditing}
                      style={{
                        ...styles.input,
                        ...(isEditing ? {} : styles.inputDisabled)
                      }}
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Correo Electrónico</label>
                  <input
                    type="email"
                    value={displayUser.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    style={{
                      ...styles.input,
                      ...(isEditing ? {} : styles.inputDisabled)
                    }}
                  />
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Teléfono</label>
                    <input
                      type="tel"
                      value={displayUser.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      disabled={!isEditing}
                      style={{
                        ...styles.input,
                        ...(isEditing ? {} : styles.inputDisabled)
                      }}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Fecha de Nacimiento</label>
                    <input
                      type="date"
                      value={displayUser.fechaNacimiento}
                      onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                      disabled={!isEditing}
                      style={{
                        ...styles.input,
                        ...(isEditing ? {} : styles.inputDisabled)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Seguridad de la Cuenta</h3>
              </div>

              <div style={styles.securityOptions}>
                <div style={styles.securityItem}>
                  <div>
                    <div style={styles.securityLabel}>Contraseña</div>
                    <div style={styles.securityDescription}>
                      Última actualización: Hace 30 días
                    </div>
                  </div>
                  <button
                    style={styles.securityBtn}
                    onClick={() => setShowChangePassword(!showChangePassword)}
                  >
                    {showChangePassword ? 'Cancelar' : 'Cambiar'}
                  </button>
                </div>

                {showChangePassword && (
                  <div style={styles.passwordForm}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Contraseña Actual</label>
                      <input
                        type="password"
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        style={styles.input}
                        placeholder="Ingresa tu contraseña actual"
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Nueva Contraseña</label>
                      <input
                        type="password"
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                        style={styles.input}
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Confirmar Nueva Contraseña</label>
                      <input
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        style={styles.input}
                        placeholder="Repite la nueva contraseña"
                      />
                    </div>
                    <button style={styles.saveBtn} onClick={handleChangePassword}>
                      💾 Guardar Nueva Contraseña
                    </button>
                  </div>
                )}

                <div style={styles.securityItem}>
                  <div>
                    <div style={styles.securityLabel}>Autenticación de Dos Factores</div>
                    <div style={styles.securityDescription}>
                      No configurado
                    </div>
                  </div>
                  <button style={styles.securityBtn} onClick={() => alert('Próximamente')}>
                    Configurar
                  </button>
                </div>

                <div style={styles.securityItem}>
                  <div>
                    <div style={styles.securityLabel}>Sesiones Activas</div>
                    <div style={styles.securityDescription}>
                      1 dispositivo conectado
                    </div>
                  </div>
                  <button style={styles.securityBtn} onClick={() => alert('Sesión actual')}>
                    Ver Dispositivos
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Tus Estadísticas</h3>
              </div>

              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <div style={styles.statIcon}>📚</div>
                  <div style={styles.statValue}>{stats.senasAprendidas}</div>
                  <div style={styles.statLabel}>Señas Aprendidas</div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statIcon}>🔥</div>
                  <div style={styles.statValue}>{stats.diasRacha}</div>
                  <div style={styles.statLabel}>Días de Racha</div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statIcon}>⏱️</div>
                  <div style={styles.statValue}>{stats.tiempoTotal}h</div>
                  <div style={styles.statLabel}>Tiempo Total</div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statIcon}>🏆</div>
                  <div style={styles.statValue}>{stats.logros}</div>
                  <div style={styles.statLabel}>Logros Desbloqueados</div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statIcon}>🌟</div>
                  <div style={styles.statValue}>#{stats.rankingGlobal}</div>
                  <div style={styles.statLabel}>Ranking Global</div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statIcon}>⭐</div>
                  <div style={styles.statValue}>Nivel {stats.nivel}</div>
                  <div style={styles.statLabel}>Nivel Actual</div>
                </div>
              </div>

              <div style={styles.progressSection}>
                <div style={styles.progressHeader}>
                  <span style={styles.progressLabel}>Progreso al Nivel {stats.nivel + 1}</span>
                  <span style={styles.progressValue}>{stats.experiencia} / {stats.siguienteNivel} XP</span>
                </div>
                <div style={styles.progressBar}>
                  <div style={{
                    ...styles.progressFill,
                    width: `${(stats.experiencia / stats.siguienteNivel) * 100}%`
                  }}></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>⚠️ Zona Peligrosa</h3>
              </div>

              <div style={styles.dangerZone}>
                <div style={styles.dangerItem}>
                  <div>
                    <div style={styles.dangerLabel}>Eliminar Cuenta</div>
                    <div style={styles.dangerDescription}>
                      Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, estate seguro.
                    </div>
                  </div>
                  <button style={styles.dangerBtn} onClick={handleDeleteAccount}>
                    🗑️ Eliminar Cuenta
                  </button>
                </div>

                <div style={styles.dangerItem}>
                  <div>
                    <div style={styles.dangerLabel}>Exportar Datos</div>
                    <div style={styles.dangerDescription}>
                      Descarga una copia de toda tu información y progreso
                    </div>
                  </div>
                  <button style={styles.exportBtn} onClick={() => alert('Próximamente')}>
                    📥 Exportar Datos
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: {
    marginBottom: '24px'
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
  messageBanner: {
    padding: '16px 24px',
    borderRadius: '12px',
    marginBottom: '24px',
    fontSize: '14px',
    fontWeight: '600',
    border: '2px solid',
    textAlign: 'center'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  profileCard: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    borderRadius: '16px',
    padding: '32px',
    color: 'white',
    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)'
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  avatarContainer: {
    position: 'relative'
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
  },
  avatarPlaceholder: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.2)',
    border: '4px solid white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
  },
  avatarInitials: {
    fontSize: '48px',
    fontWeight: '700',
    color: 'white'
  },
  avatarButtons: {
    position: 'absolute',
    bottom: '-40px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    whiteSpace: 'nowrap'
  },
  avatarBtn: {
    padding: '8px 12px',
    background: 'white',
    color: '#6366f1',
    border: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  avatarBtnDanger: {
    padding: '8px 12px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  fileInput: {
    display: 'none'
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 8px 0'
  },
  userEmail: {
    fontSize: '16px',
    opacity: 0.9,
    margin: '0 0 16px 0'
  },
  levelBadge: {
    display: 'inline-block',
    padding: '8px 16px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    backdropFilter: 'blur(10px)'
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    background: 'white',
    padding: '8px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    overflowX: 'auto'
  },
  tab: {
    flex: 1,
    padding: '12px 16px',
    border: 'none',
    background: 'transparent',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap'
  },
  tabActive: {
    background: '#6366f1',
    color: 'white'
  },
  tabContent: {
    minHeight: '400px'
  },
  section: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid #f3f4f6'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },
  editBtn: {
    padding: '10px 20px',
    background: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px'
  },
  cancelBtn: {
    padding: '10px 20px',
    background: '#e5e7eb',
    color: '#6b7280',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  saveBtn: {
    padding: '10px 20px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  input: {
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none'
  },
  inputDisabled: {
    background: '#f9fafb',
    color: '#6b7280'
  },
  securityOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  securityItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    background: '#f9fafb',
    borderRadius: '12px'
  },
  securityLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '4px'
  },
  securityDescription: {
    fontSize: '13px',
    color: '#6b7280'
  },
  securityBtn: {
    padding: '10px 20px',
    background: 'white',
    color: '#6366f1',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  passwordForm: {
    padding: '20px',
    background: '#f9fafb',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px'
  },
  statCard: {
    background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
    padding: '24px',
    borderRadius: '12px',
    textAlign: 'center',
    border: '2px solid #f3f4f6'
  },
  statIcon: {
    fontSize: '48px',
    marginBottom: '12px'
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '8px'
  },
  statLabel: {
    fontSize: '13px',
    color: '#6b7280'
  },
  progressSection: {
    padding: '24px',
    background: '#f9fafb',
    borderRadius: '12px'
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px'
  },
  progressLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f2937'
  },
  progressValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6366f1'
  },
  progressBar: {
    width: '100%',
    height: '12px',
    background: '#e5e7eb',
    borderRadius: '6px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
    borderRadius: '6px',
    transition: 'width 0.3s'
  },
  dangerZone: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  dangerItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    background: '#fef2f2',
    border: '2px solid #fecaca',
    borderRadius: '12px'
  },
  dangerLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '4px'
  },
  dangerDescription: {
    fontSize: '13px',
    color: '#6b7280',
    maxWidth: '500px'
  },
  dangerBtn: {
    padding: '10px 20px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  exportBtn: {
    padding: '10px 20px',
    background: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s'
  }
};

export default Profile;