import React, { useState } from 'react';

const SenaCard = ({ sena, onClick }) => {
  const [imageError, setImageError] = useState(false);

  // Extraer el ID del video de YouTube desde la URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    url = url.trim();
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
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

  // Obtener el ID del video de YouTube
  const videoId = getYouTubeVideoId(sena.urlVideo);

  // Determinar qué imagen mostrar
  const getImageSource = () => {
    // Prioridad: 1. Imagen personalizada, 2. Thumbnail de YouTube, 3. Placeholder
    if (sena.urlImagen && !imageError) {
      return sena.urlImagen;
    } else if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return null;
  };

  const imageSource = getImageSource();

  return (
    <div style={styles.card} onClick={onClick}>
      <div style={styles.imageContainer}>
        {imageSource ? (
          <>
            <img 
              src={imageSource} 
              alt={sena.nombre} 
              style={styles.image}
              onError={() => setImageError(true)}
            />
            {videoId && (
              <div style={styles.videoOverlay}>
                <div style={styles.playIcon}>▶️</div>
              </div>
            )}
          </>
        ) : (
          <div style={styles.placeholder}>
            <span style={styles.placeholderIcon}>👋</span>
          </div>
        )}
        <span 
          style={{
            ...styles.difficultyBadge,
            background: getDifficultyColor(sena.dificultad)
          }}
        >
          {getDifficultyText(sena.dificultad)}
        </span>
      </div>

      <div style={styles.content}>
        <h3 style={styles.title}>{sena.nombre}</h3>
        <p style={styles.description}>
          {sena.descripcion?.substring(0, 80)}
          {sena.descripcion?.length > 80 ? '...' : ''}
        </p>

        <div style={styles.footer}>
          {sena.categoria && (
            <span style={styles.categoryTag}>
              {sena.categoria.icono} {sena.categoria.nombre}
            </span>
          )}
          <button style={styles.viewBtn}>
            👁️ Ver
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'white',
    border: '2px solid #e5e7eb',
    borderRadius: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s',
    position: 'relative'
  },
  imageContainer: {
    position: 'relative',
    background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
    height: '180px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s'
  },
  videoOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60px',
    height: '60px',
    background: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    transition: 'all 0.3s',
    opacity: 0.9
  },
  playIcon: {
    fontSize: '24px',
    marginLeft: '3px'
  },
  placeholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
  },
  placeholderIcon: {
    fontSize: '72px',
    opacity: 0.5
  },
  difficultyBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    padding: '6px 14px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(4px)',
    zIndex: 2
  },
  content: {
    padding: '16px'
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 8px 0'
  },
  description: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '0 0 16px 0',
    lineHeight: '1.5',
    minHeight: '40px'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  categoryTag: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    background: '#f3f4f6',
    color: '#6b7280'
  },
  viewBtn: {
    padding: '6px 12px',
    border: 'none',
    background: 'transparent',
    color: '#6366f1',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'color 0.2s'
  }
};

// Agregar estilos hover con JavaScript
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .sena-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
      border-color: #6366f1;
    }
    .sena-card:hover img {
      transform: scale(1.05);
    }
    .sena-card:hover .video-overlay {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.1);
    }
  `;
  document.head.appendChild(style);
}

export default SenaCard;