import React from 'react';
import UnityPlayer from './UnityPlayer';

const SenaModal = ({ sena, isOpen, onClose }) => {
  if (!isOpen || !sena) return null;

  const handlePlaySign = () => {
    console.log('Reproducir seña:', sena.nombre);
    // El UnityPlayer manejará la reproducción
  };

  const getDifficultyColor = (dificultad) => {
    switch (dificultad) {
      case 'FACIL': return '#10b981';
      case 'MEDIO': return '#f59e0b';
      case 'DIFICIL': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDifficultyText = (dificultad) => {
    switch (dificultad) {
      case 'FACIL': return 'Fácil';
      case 'MEDIO': return 'Medio';
      case 'DIFICIL': return 'Difícil';
      default: return dificultad;
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>{sena.nombre}</h2>
            <span 
              style={{
                ...styles.difficultyBadge,
                background: getDifficultyColor(sena.dificultad)
              }}
            >
              {getDifficultyText(sena.dificultad)}
            </span>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Unity Player */}
        <div style={styles.playerSection}>
          <UnityPlayer word={sena.nombre} />
        </div>

        {/* Información */}
        <div style={styles.infoSection}>
          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>📝 Descripción</h3>
            <p style={styles.infoText}>{sena.descripcion}</p>
          </div>

          {sena.categoria && (
            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>🏷️ Categoría</h3>
              <div style={styles.categoryTag}>
                {sena.categoria.icono && <span>{sena.categoria.icono}</span>}
                <span>{sena.categoria.nombre}</span>
              </div>
            </div>
          )}

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{sena.popularidad || 0}</div>
              <div style={styles.statLabel}>⭐ Popularidad</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{sena.vecesPracticada || 0}</div>
              <div style={styles.statLabel}>🎯 Veces practicada</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button style={styles.playBtn} onClick={handlePlaySign}>
            ▶️ Reproducir Seña
          </button>
          <button style={styles.practiceBtn}>
            🎓 Practicar
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modal: {
    background: 'white',
    borderRadius: '24px',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '24px 32px',
    borderBottom: '2px solid #f3f4f6'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 8px 0'
  },
  difficultyBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600'
  },
  closeBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    background: '#f3f4f6',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s'
  },
  playerSection: {
    padding: '32px'
  },
  infoSection: {
    padding: '0 32px 32px'
  },
  infoCard: {
    background: '#f9fafb',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '16px'
  },
  infoTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 12px 0'
  },
  infoText: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.6',
    margin: 0
  },
  categoryTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'white',
    padding: '8px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#6366f1',
    border: '2px solid #e0e7ff'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  statCard: {
    background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid #e5e7eb'
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
  actions: {
    display: 'flex',
    gap: '12px',
    padding: '0 32px 32px'
  },
  playBtn: {
    flex: 1,
    padding: '16px',
    border: 'none',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
  },
  practiceBtn: {
    flex: 1,
    padding: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    background: 'white',
    color: '#1f2937',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};

export default SenaModal;