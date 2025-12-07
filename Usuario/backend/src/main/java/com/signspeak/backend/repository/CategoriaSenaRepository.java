package com.signspeak.backend.repository;

import com.signspeak.backend.model.CategoriaSena;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaSenaRepository extends JpaRepository<CategoriaSena, Long> {

    // Buscar por nombre
    Optional<CategoriaSena> findByNombre(String nombre);

    // Obtener todas las categorías activas ordenadas por orden
    List<CategoriaSena> findByActivoTrueOrderByOrdenAsc();

    // Obtener todas las categorías activas
    List<CategoriaSena> findByActivoTrue();

    // Verificar si existe una categoría por nombre
    boolean existsByNombre(String nombre);

    // Contar categorías activas
    Long countByActivoTrue();
}