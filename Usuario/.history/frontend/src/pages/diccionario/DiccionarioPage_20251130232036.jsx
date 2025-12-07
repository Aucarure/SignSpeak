import React, { useState, useEffect } from 'react';
import { useDiccionario } from '../../hooks/useDiccionario';
import SenaCard from '../../components/diccionario/SenaCard';
import SenaModal from '../../components/diccionario/SenaModal';

const DiccionarioPage = () => {
  const {
    senas,
    categorias,
    loading,
    error,
    pagination,
    cargarCategorias,
    cargarSenas,
    buscarSenas,
    filtrarSenas
  } = useDiccionario();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedSena, setSelectedSena] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('todos');

  // Cargar datos iniciales
  useEffect(() => {
    cargarCategorias();
    cargarSenas();
  }, []);

  // Manejar búsqueda
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.trim()) {
      buscarSenas(value);
    } else {
      aplicarFiltros();
    }
  };

  // Aplicar filtros
  const aplicarFiltros = () => {
    const filtros = {
      nombre: searchTerm || null,
      idCategoria: selectedCategory,
      dificultad: selectedDifficulty,
      ordenar: 'alfabetico',
      pagina: 0,
      tamanoPagina: 20
    };
    filtrarSenas(filtros);
  };

  // Efecto para aplicar filtros cuando cambian
  useEffect(() => {
    if (selectedCategory !== null || selectedDifficulty !== null) {
      aplicarFiltros();
    }
  }, [selectedCategory, selectedDifficulty]);

  // Abrir modal de detalle
  const handleOpenModal = (sena) => {
    setSelectedSena(sena);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSena(null);
  };

  // Cambiar página
  const handlePageChange = (newPage) => {
    if (searchTerm) {
      buscarSenas(searchTerm, newPage);
    } else {
      const filtros = {
        nombre: null,
        idCategoria: selectedCategory,
        dificultad: selectedDifficulty,
        ordenar: 'alfabetico',
        pagina: newPage,
        tamanoPagina: 20
      };
      filtrarSenas(filtros);
    }
  };

  const dificultades = [
    { id: null, nombre: 'Todas', icon: '✨', color: '#6366f1' },
    { id: 'FACIL', nombre: 'Fácil', icon: '😊', color: '#10b981' },
    { id: 'MEDIO', nombre: 'Medio', icon: '🎯', color: '#f59e0b' },
    { id: 'DIFICIL', nombre: 'Difícil', icon: '🔥', color: '#ef4444' }
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>📚 Diccionario de Señas</h1>
          <p style={styles.pageSubtitle}>
            Explora y aprende {pagination.totalElements} señas diferentes
          </p>
        </div>
        <div style={styles.headerActions}>
          <span style={styles.levelBadge}>✨ Nivel 3</span>
        </div>
      </div>

      {/* Main Container */}
      <div style={styles.mainContainer}>
        {/* Hero Section */}
        <div style={styles.heroSection}>
          <div style={styles.heroContent}>
            <h2 style={styles.heroTitle}>✨ Aprende Lenguaje de Señas</h2>
            <p style={styles.heroDescription}>
              Descubre, practica y domina el lenguaje de señas con nuestro diccionario interactivo
            </p>
            <div style={styles.heroStats}>
              <div style={styles.heroStat}>
                <span style={styles.heroStatIcon}>📚</span>
                <div>
                  <div style={styles.heroStatValue}>{pagination.totalElements}</div>
                  <div style={styles.heroStatLabel}>Señas</div>
                </div>
              </div>
              <div style={styles.heroStat}>
                <span style={styles.heroStatIcon}>🏷️</span>
                <div>
                  <div style={styles.heroStatValue}>{categorias.length}</div>
                  <div style={styles.heroStatLabel}>Categorías</div>
                </div>
              </div>
              <div style={styles.heroStat}>
                <span style={styles.heroStatIcon}>🎓</span>
                <div>
                  <div style={styles.heroStatValue}>78%</div>
                  <div style={styles.heroStatLabel}>Progreso</div>
                </div>
              </div>
            </div>
          </div>
          <div style={styles.heroImage}>
            <div style={styles.heroAvatar}>👋</div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Buscar señas por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={styles.searchInput}
          />
          {searchTerm && (
            <button
              onClick={() => handleSearch('')}
              style={styles.clearBtn}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtros */}
        <div style={styles.filtersSection}>
          {/* Categorías */}
          <div style={styles.filterGroup}>
            <h3 style={styles.filterTitle}>🏷️ Categorías</h3>
            <div style={styles.filterButtons}>
              <button
                onClick={() => setSelectedCategory(null)}
                style={{
                  ...styles.filterBtn,
                  ...(selectedCategory === null ? styles.filterBtnActive : {})
                }}
              >
                ✨ Todas
              </button>
              {categorias.map((cat) => (
                <button
                  key={cat.idCategoria}
                  onClick={() => setSelectedCategory(cat.idCategoria)}
                  style={{
                    ...styles.filterBtn,
                    ...(selectedCategory === cat.idCategoria ? styles.filterBtnActive : {})
                  }}
                >
                  {cat.icono} {cat.nombre}
                </button>
              ))}
            </div>
          </div>

          {/* Dificultades */}
          <div style={styles.filterGroup}>
            <h3 style={styles.filterTitle}>📊 Dificultad</h3>
            <div style={styles.filterButtons}>
              {dificultades.map((dif) => (
                <button
                  key={dif.id}
                  onClick={() => setSelectedDifficulty(dif.id)}
                  style={{
                    ...styles.filterBtn,
                    ...(selectedDifficulty === dif.id && {
                      background: dif.color,
                      color: 'white',
                      border: `2px solid ${dif.color}`,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    })
                  }}
                >
                  {dif.icon} {dif.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Cargando señas...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={styles.errorContainer}>
            <div style={styles.errorIcon}>⚠️</div>
            <h3 style={styles.errorTitle}>Error al cargar las señas</h3>
            <p style={styles.errorText}>{error}</p>
            <button style={styles.retryBtn} onClick={() => cargarSenas()}>
              🔄 Reintentar
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && senas.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔍</div>
            <h3 style={styles.emptyTitle}>No se encontraron señas</h3>
            <p style={styles.emptyText}>
              {searchTerm
                ? `No hay resultados para "${searchTerm}"`
                : 'Intenta con otros filtros'}
            </p>
            {searchTerm && (
              <button
                style={styles.clearFiltersBtn}
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                  setSelectedDifficulty(null);
                  cargarSenas();
                }}
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}

        {/* Grid de Señas */}
        {!loading && !error && senas.length > 0 && (
          <>
            <div style={styles.resultsHeader}>
              <p style={styles.resultsCount}>
                Mostrando <strong>{senas.length}</strong> de{' '}
                <strong>{pagination.totalElements}</strong> señas
              </p>
            </div>

            <div style={styles.senasGrid}>
              {senas.map((sena) => (
                <SenaCard
                  key={sena.idSena}
                  sena={sena}
                  onClick={() => handleOpenModal(sena)}
                />
              ))}
            </div>

            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  style={{
                    ...styles.pageBtn,
                    ...(pagination.currentPage === 0 ? styles.pageBtnDisabled : {})
                  }}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 0}
                >
                  ← Anterior
                </button>

                <div style={styles.pageNumbers}>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = pagination.currentPage < 3
                      ? i
                      : pagination.currentPage + i - 2;

                    if (pageNum >= pagination.totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        style={{
                          ...styles.pageNumber,
                          ...(pageNum === pagination.currentPage ? styles.pageNumberActive : {})
                        }}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  style={{
                    ...styles.pageBtn,
                    ...(pagination.currentPage === pagination.totalPages - 1
                      ? styles.pageBtnDisabled
                      : {})
                  }}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages - 1}
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <SenaModal
        sena={selectedSena}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  pageTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 8px 0'
  },
  pageSubtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0
  },
  headerActions: {
    display: 'flex',
    gap: '12px'
  },
  levelBadge: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '24px',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
  },
  mainContainer: {
    background: 'white',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
  },
  heroSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    borderRadius: '20px',
    padding: '40px',
    marginBottom: '32px',
    color: 'white'
  },
  heroContent: {
    flex: 1
  },
  heroTitle: {
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 12px 0'
  },
  heroDescription: {
    fontSize: '16px',
    margin: '0 0 24px 0',
    opacity: 0.95,
    lineHeight: '1.6'
  },
  heroStats: {
    display: 'flex',
    gap: '32px'
  },
  heroStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  heroStatIcon: {
    fontSize: '32px'
  },
  heroStatValue: {
    fontSize: '24px',
    fontWeight: '700'
  },
  heroStatLabel: {
    fontSize: '12px',
    opacity: 0.9
  },
  heroImage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroAvatar: {
    fontSize: '120px',
    animation: 'float 3s ease-in-out infinite'
  },
  searchContainer: {
    position: 'relative',
    marginBottom: '32px'
  },
  searchIcon: {
    position: 'absolute',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '20px',
    zIndex: 1
  },
  searchInput: {
    width: '100%',
    padding: '16px 56px',
    border: '2px solid #e5e7eb',
    borderRadius: '16px',
    fontSize: '15px',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
    outline: 'none',
    boxSizing: 'border-box'
  },
  clearBtn: {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    background: '#e5e7eb',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  filtersSection: {
    marginBottom: '32px'
  },
  filterGroup: {
    marginBottom: '24px'
  },
  filterTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 12px 0'
  },
  filterButtons: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  filterBtn: {
    padding: '10px 20px',
    border: '2px solid #e5e7eb',
    borderRadius: '24px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280',
    transition: 'all 0.2s'
  },
  filterBtnActive: {
    background: '#6366f1',
    color: 'white',
    border: '2px solid #6366f1',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6b7280'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    margin: '0 auto 16px',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    fontSize: '16px',
    margin: 0
  },
  errorContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6b7280'
  },
  errorIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  errorTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 8px 0'
  },
  errorText: {
    fontSize: '14px',
    margin: '0 0 24px 0'
  },
  retryBtn: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '12px',
    background: '#6366f1',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    color: '#6b7280'
  },
  emptyIcon: {
    fontSize: '80px',
    marginBottom: '24px'
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 12px 0'
  },
  emptyText: {
    fontSize: '16px',
    margin: '0 0 24px 0'
  },
  clearFiltersBtn: {
    padding: '12px 24px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    background: 'white',
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  resultsHeader: {
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid #f3f4f6'
  },
  resultsCount: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0
  },
  senasGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    marginTop: '40px'
  },
  pageBtn: {
    padding: '10px 20px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    background: 'white',
    color: '#1f2937',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  pageBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  pageNumbers: {
    display: 'flex',
    gap: '8px'
  },
  pageNumber: {
    width: '40px',
    height: '40px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    background: 'white',
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  pageNumberActive: {
    background: '#6366f1',
    color: 'white',
    border: '2px solid #6366f1'
  }
};

export default DiccionarioPage;