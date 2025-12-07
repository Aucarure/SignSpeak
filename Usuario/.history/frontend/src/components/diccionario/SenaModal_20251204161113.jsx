import React, { useState } from 'react';

const SenaModal = ({ sena, isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen || !sena) return null;

  // Extraer el ID del video de YouTube desde la URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    // Soporta varios formatos de URL de YouTube:
    // https://www.youtube.com/watch?v=VIDEO_ID
    // https://youtu.be/VIDEO_ID
    // https://www.youtube.com/embed/VIDEO_ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(sena.urlVideo);

  const handlePlaySign = () => {
    setIsPlaying(true);
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

        {/* YouTube Player Section */}
        <div style={styles.playerSection}>
          {videoId ? (
            <div style={styles.videoContainer}>
              {!isPlaying ? (
                // Thumbnail con botón de play
                <div style={styles.thumbnailContainer}>
                  <img 
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt={sena.nombre}
                    style={styles.thumbnail}
                    onError={(e) => {
                      // Fallback a thumbnail de menor calidad si maxresdefault no existe
                      e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                    }}
                  />
                  <button 
                    style={styles.playButton}
                    onClick={handlePlaySign}
                  >
                    <div style={styles.playIcon}>▶</div>
                  </button>
                  <div style={styles.overlay}>
                    <span style={styles.playText}>Reproducir Seña</span>
                  </div>
                </div>
              ) : (
                // Iframe de YouTube cuando se reproduce
                <iframe
                  style={styles.iframe}
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                  title={sena.nombre}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          ) : (
            // Estado cuando no hay video disponible
            <div style={styles.noVideoContainer}>
              <div style={styles.noVideoIcon}>📹</div>
              <p style={styles.noVideoText}>Video no disponible</p>
              <p style={styles.noVideoSubtext}>
                Aún no se ha cargado un video para esta seña
              </p>
            </div>
          )}
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

        {/* Actions - SIN BOTÓN DE PRACTICAR */}
        {videoId && (
          <div style={styles.actions}>
            <button 
              style={styles.playBtn} 
              onClick={handlePlaySign}
            >
              ▶️ {isPlaying ? 'Ver Video' : 'Reproducir Seña'}
            </button>
          </div>
        )}
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
    padding: '32px',
    background: '#f9fafb'
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%', // Aspect ratio 16:9
    background: '#000',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
  },
  thumbnailContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer'
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.95)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
    zIndex: 2
  },
  playIcon: {
    fontSize: '32px',
    color: '#ef4444',
    marginLeft: '4px'
  },
  playText: {
    position: 'absolute',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    zIndex: 1
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
    borderRadius: '16px'
  },
  noVideoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    background: 'white',
    borderRadius: '16px',
    border: '2px dashed #e5e7eb'
  },
  noVideoIcon: {
    fontSize: '64px',
    marginBottom: '16px',
    opacity: 0.5
  },
  noVideoText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 8px 0'
  },
  noVideoSubtext: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0
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
  }
};

export default SenaModal;