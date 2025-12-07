package com.signspeak.backend.repository;

import com.signspeak.backend.model.DiccionarioSena;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiccionarioSenaRepository extends JpaRepository<DiccionarioSena, Long> {

    // ============ MÉTODOS EXISTENTES (CORREGIDOS) ============
    Optional<DiccionarioSena> findByPalabra(String palabra);  // ✅ CAMBIADO
    List<DiccionarioSena> findByCategoriaIdCategoria(Long idCategoria);
    List<DiccionarioSena> findByActivoTrue();

    // ============ MÉTODOS NUEVOS PARA EL DICCIONARIO ============

    // Buscar por palabra (case insensitive)
    Optional<DiccionarioSena> findByPalabraIgnoreCase(String palabra);  // ✅ CAMBIADO

    // Buscar por categoría con paginación
    Page<DiccionarioSena> findByActivoTrueAndCategoriaIdCategoria(Long idCategoria, Pageable pageable);

    // Buscar por dificultad con paginación
    Page<DiccionarioSena> findByActivoTrueAndDificultad(DiccionarioSena.Dificultad dificultad, Pageable pageable);

    // Búsqueda general (palabra o descripción)
    @Query("SELECT d FROM DiccionarioSena d WHERE d.activo = true " +
            "AND (LOWER(d.palabra) LIKE LOWER(CONCAT('%', :busqueda, '%')) " +  // ✅ CAMBIADO
            "OR LOWER(d.descripcion) LIKE LOWER(CONCAT('%', :busqueda, '%')))")
    Page<DiccionarioSena> buscarSenas(@Param("busqueda") String busqueda, Pageable pageable);

    // ✅ QUERY MEJORADA - Mejor manejo de NULLs
    @Query("SELECT d FROM DiccionarioSena d WHERE d.activo = true " +
            "AND (COALESCE(:palabra, '') = '' OR LOWER(d.palabra) LIKE LOWER(CONCAT('%', :palabra, '%'))) " +  // ✅ CAMBIADO
            "AND (:idCategoria IS NULL OR d.categoria.idCategoria = :idCategoria) " +
            "AND (:dificultad IS NULL OR d.dificultad = :dificultad)")
    Page<DiccionarioSena> buscarConFiltros(
            @Param("palabra") String palabra,  // ✅ CAMBIADO
            @Param("idCategoria") Long idCategoria,
            @Param("dificultad") DiccionarioSena.Dificultad dificultad,
            Pageable pageable
    );

    // Señas más populares (Top 10)
    List<DiccionarioSena> findTop10ByActivoTrueOrderByPopularidadDesc();

    // Señas más practicadas (Top 10)
    List<DiccionarioSena> findTop10ByActivoTrueOrderByVecesPracticadaDesc();

    // Contar señas activas
    Long countByActivoTrue();

    // Contar por categoría
    Long countByActivoTrueAndCategoriaIdCategoria(Long idCategoria);

    // Contar por dificultad
    Long countByActivoTrueAndDificultad(DiccionarioSena.Dificultad dificultad);
}