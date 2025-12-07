import React, { useState, useMemo } from 'react';

// Base de datos de señas
const signDatabase = [
  {
    id: 1,
    word: 'Hola',
    description: 'Saludo básico usado al encontrar a alguien',
    category: 'Saludos',
    difficulty: 'Fácil',
    image: '👋',
    isFavorite: true
  },
  {
    id: 2,
    word: 'Gracias',
    description: 'Expresión de agradecimiento',
    category: 'Cortesía',
    difficulty: 'Fácil',
    image: '🙏',
    isFavorite: true
  },
  {
    id: 3,
    word: 'Familia',
    description: 'Grupo de personas relacionadas',
    category: 'Personas',
    difficulty: 'Medio',
    image: '👨‍👩‍👧‍👦',
    isFavorite: false
  },
  {
    id: 4,
    word: 'Amar',
    description: 'Sentimiento de afecto profundo',
    category: 'Emociones',
    difficulty: 'Medio',
    image: '❤️',
    isFavorite: false
  },
  {
    id: 5,
    word: 'Por favor',
    description: 'Expresión de cortesía para solicitar algo',
    category: 'Cortesía',
    difficulty: 'Fácil',
    image: '🙏',
    isFavorite: false
  },
  {
    id: 6,
    word: 'Adiós',
    description: 'Despedida al marcharse',
    category: 'Saludos',
    difficulty: 'Fácil',
    image: '👋',
    isFavorite: false
  },
  {
    id: 7,
    word: 'Ayuda',
    description: 'Solicitud de asistencia',
    category: 'Acciones',
    difficulty: 'Medio',
    image: '🆘',
    isFavorite: false
  },
  {
    id: 8,
    word: 'Feliz',
    description: 'Estado de alegría y satisfacción',
    category: 'Emociones',
    difficulty: 'Fácil',
    image: '😊',
    isFavorite: false
  }
];

const categories = [
  { id: 'all', name: 'Todos', icon: '✨', color: '#6366f1' },
  { id: 'Saludos', name: 'Saludos', icon: '❤️', color: '#ef4444' },
  { id: 'Cortesía', name: 'Cortesía', icon: '⭐', color: '#f59e0b' },
  { id: 'Personas', name: 'Personas', icon: '❤️', color: '#ec4899' },
  { id: 'Emociones', name: 'Emociones', icon: '❤️', color: '#8b5cf6' },
  { id: 'Acciones', name: 'Acciones', icon: '⚡', color: '#10b981' }
];

function Dictionary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('todos');
  const [favorites, setFavorites] = useState(signDatabase.filter(s => s.isFavorite).map(s => s.id));

  // Filtrar señas
  const filteredSigns = useMemo(() => {
    let filtered = signDatabase;

    // Filtrar por favoritos
    if (activeTab === 'favoritos') {
      filtered = filtered.filter(sign => favorites.includes(sign.id));
    }

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(sign => sign.category === selectedCategory);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(sign => 
        sign.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sign.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [searchTerm, selectedCategory, activeTab, favorites]);

  // Estadísticas
  const stats = {
    progress: 78,
    mastered: 24,
    streak: 5
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Fácil': return '#10b981';
      case 'Medio': return '#f59e0b';
      case 'Difícil': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.name === category);
    return cat?.color || '#6366f1';
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Diccionario</h1>
          <p style={styles.pageSubtitle}>Busca y practica señas</p>
        </div>
        <div style={styles.headerBadge}>
          <span style={styles.levelBadge}>✨ Nivel 3</span>
          <button style={styles.notificationBtn}>
            🔔
            <span style={styles.notificationDot}></span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div style={styles.mainContainer}>
        {/* Hero Section */}
        <div style={styles.heroSection}>
          <div style={styles.heroContent}>
            <h2 style={styles.heroTitle}>✨ Diccionario de Señas</h2>
            <p style={styles.heroDescription}>
              Explora {signDatabase.length} palabras y practica en cualquier momento
            </p>
            <div style={styles.heroStats}>
              <span style={styles.heroStat}>⭐ {favorites.length} Favoritas</span>
              <span style={styles.heroStat}>📚 {signDatabase.length} Resultados</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Buscar palabra mágica... ✨"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              style={styles.clearBtn}
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div style={styles.categoryFilters}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                ...styles.categoryBtn,
                ...(selectedCategory === cat.id ? {
                  ...styles.categoryBtnActive,
                  background: cat.color,
                  boxShadow: `0 4px 12px ${cat.color}40`
                } : {})
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'}}>
              📈
            </div>
            <div style={styles.statValue}>{stats.progress}%</div>
            <div style={styles.statLabel}>Progreso</div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}>
              ⭐
            </div>
            <div style={styles.statValue}>{stats.mastered}</div>
            <div style={styles.statLabel}>Dominadas</div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'}}>
              🔥
            </div>
            <div style={styles.statValue}>{stats.streak}</div>
            <div style={styles.statLabel}>Racha días</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabsContainer}>
          <button
            onClick={() => setActiveTab('todos')}
            style={{
              ...styles.tab,
              ...(activeTab === 'todos' ? styles.tabActive : {})
            }}
          >
            📚 Todos ({signDatabase.length})
          </button>
          <button
            onClick={() => setActiveTab('favoritos')}
            style={{
              ...styles.tab,
              ...(activeTab === 'favoritos' ? styles.tabActive : {})
            }}
          >
            ⭐ Favoritos ({favorites.length})
          </button>
        </div>

        {/* Signs Grid */}
        {filteredSigns.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔍</div>
            <h3 style={styles.emptyTitle}>No se encontraron señas</h3>
            <p style={styles.emptyText}>
              Intenta con otra palabra o categoría
            </p>
          </div>
        ) : (
          <div style={styles.signsGrid}>
            {filteredSigns.map(sign => (
              <div key={sign.id} style={styles.signCard}>
                <div style={styles.signImageContainer}>
                  <div style={styles.signImage}>{sign.image}</div>
                  <button 
                    onClick={() => toggleFavorite(sign.id)}
                    style={styles.favoriteBtn}
                  >
                    {favorites.includes(sign.id) ? '⭐' : '☆'}
                  </button>
                  <span 
                    style={{
                      ...styles.difficultyBadge,
                      background: getDifficultyColor(sign.difficulty)
                    }}
                  >
                    {sign.difficulty}
                  </span>
                </div>

                <div style={styles.signContent}>
                  <h3 style={styles.signTitle}>{sign.word}</h3>
                  <p style={styles.signDescription}>{sign.description}</p>
                  
                  <div style={styles.signFooter}>
                    <span 
                      style={{
                        ...styles.categoryTag,
                        background: getCategoryColor(sign.category) + '20',
                        color: getCategoryColor(sign.category)
                      }}
                    >
                      {sign.category}
                    </span>
                    <button style={styles.viewSignBtn}>
                      👁️ Ver señal
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Button */}
      <button style={styles.helpButton}>❓</button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 4px 0'
  },
  pageSubtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0
  },
  headerBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  levelBadge: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
  },
  notificationBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    background: 'white',
    fontSize: '20px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    transition: 'transform 0.2s'
  },
  notificationDot: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '8px',
    height: '8px',
    background: '#ef4444',
    borderRadius: '50%',
    border: '2px solid white'
  },
  mainContainer: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
  },
  heroSection: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '24px',
    color: 'white'
  },
  heroContent: {
    maxWidth: '600px'
  },
  heroTitle: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 8px 0'
  },
  heroDescription: {
    fontSize: '16px',
    margin: '0 0 16px 0',
    opacity: 0.95
  },
  heroStats: {
    display: 'flex',
    gap: '24px'
  },
  heroStat: {
    fontSize: '14px',
    fontWeight: '600',
    opacity: 0.9
  },
  searchContainer: {
    position: 'relative',
    marginBottom: '24px'
  },
  searchIcon: {
    position: 'absolute',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '20px'
  },
  searchInput: {
    width: '100%',
    padding: '16px 56px 16px 56px',
    border: '2px solid #e5e7eb',
    borderRadius: '16px',
    fontSize: '15px',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
    outline: 'none',
    boxSizing: 'border-box'
  },
  clearBtn: {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: 'none',
    background: '#e5e7eb',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  categoryFilters: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  categoryBtn: {
    padding: '10px 20px',
    border: '2px solid #e5e7eb',
    borderRadius: '24px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s'
  },
  categoryBtnActive: {
    color: 'white',
    border: 'none',
    transform: 'translateY(-2px)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '24px'
  },
  statCard: {
    background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid #e5e7eb'
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    marginBottom: '12px'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '13px',
    color: '#6b7280'
  },
  tabsContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: '12px'
  },
  tab: {
    padding: '12px 24px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    color: '#6b7280',
    borderRadius: '12px',
    transition: 'all 0.2s'
  },
  tabActive: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
  },
  signsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px'
  },
  signCard: {
    background: 'white',
    border: '2px solid #e5e7eb',
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'all 0.2s',
    cursor: 'pointer'
  },
  signImageContainer: {
    position: 'relative',
    background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
    height: '180px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  signImage: {
    fontSize: '72px'
  },
  favoriteBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    background: 'white',
    fontSize: '18px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s'
  },
  difficultyBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600'
  },
  signContent: {
    padding: '16px'
  },
  signTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 8px 0'
  },
  signDescription: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '0 0 16px 0',
    lineHeight: '1.5'
  },
  signFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  categoryTag: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  viewSignBtn: {
    padding: '6px 12px',
    border: 'none',
    background: 'transparent',
    color: '#6b7280',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'color 0.2s'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6b7280'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 8px 0'
  },
  emptyText: {
    fontSize: '14px',
    margin: 0
  },
  helpButton: {
    position: 'fixed',
    bottom: '32px',
    right: '32px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
    transition: 'all 0.2s',
    zIndex: 100
  }
};

export default Dictionary;