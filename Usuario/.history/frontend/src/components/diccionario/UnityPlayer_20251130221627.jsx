import React, { useEffect, useRef } from 'react';

const UnityPlayer = ({ word, onAnimationComplete }) => {
  const unityInstanceRef = useRef(null);

  useEffect(() => {
    // Aquí se inicializa Unity cuando esté disponible
    // Por ahora es un placeholder
    console.log('Unity player inicializado');

    // Cleanup
    return () => {
      if (unityInstanceRef.current) {
        // Limpiar instancia de Unity
        console.log('Limpiando Unity instance');
      }
    };
  }, []);

  useEffect(() => {
    if (word && unityInstanceRef.current) {
      // Llamar a la función de Unity para reproducir la seña
      // unityInstance.SendMessage('GameObjectName', 'PlaySign', word);
      console.log(`Reproduciendo seña: ${word}`);
      
      // Simular animación completa (tu compañera implementará esto)
      setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 3000);
    }
  }, [word, onAnimationComplete]);

  const playSign = (signWord) => {
    // Esta función será llamada desde el componente padre
    if (unityInstanceRef.current) {
      console.log(`PlaySign called with: ${signWord}`);
      // unityInstance.SendMessage('GameObjectName', 'PlaySign', signWord);
    }
  };

  // Exponer método para uso externo
  React.useImperativeHandle(unityInstanceRef, () => ({
    playSign
  }));

  return (
    <div style={styles.unityContainer}>
      <div style={styles.placeholder}>
        <div style={styles.avatar}>🧑‍🦰</div>
        <p style={styles.placeholderText}>
          {word ? `Reproduciendo: "${word}"` : 'Selecciona una seña para ver la animación'}
        </p>
        <div style={styles.unityInfo}>
          <p style={styles.infoText}>🎮 Unity Player</p>
          <p style={styles.infoSubtext}>Integración lista para tu personaje 3D</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  unityContainer: {
    width: '100%',
    height: '500px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
  },
  placeholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    padding: '40px'
  },
  avatar: {
    fontSize: '120px',
    marginBottom: '24px',
    animation: 'float 3s ease-in-out infinite'
  },
  placeholderText: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '32px',
    textAlign: 'center',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
  },
  unityInfo: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    padding: '16px 24px',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  infoText: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 8px 0'
  },
  infoSubtext: {
    fontSize: '14px',
    opacity: 0.9,
    margin: 0
  }
};

export default UnityPlayer;