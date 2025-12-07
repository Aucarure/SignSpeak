import React from 'react';

const SenaCard = ({ sena, onClick }) => {
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
    <div style={styles.card} onClick={onClick}>
      <div style={styles.imageContainer}>
        {sena.urlImagen ? (
          <img src={sena.urlImagen} alt={sena.nombre} style={styles.image} />
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
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
      borderColor: '#6366f1'
    }
  },
  imageContainer: {
    position: 'relative',
    background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
    height: '180px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  placeholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  placeholderIcon: {
    fontSize: '72px'
  },
  difficultyBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
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
    gap: '4px'
  }
};

export default SenaCard;