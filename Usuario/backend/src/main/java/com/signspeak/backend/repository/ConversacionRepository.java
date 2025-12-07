package com.signspeak.backend.repository;

import com.signspeak.backend.model.Conversacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConversacionRepository extends JpaRepository<Conversacion, Long> {

    // Buscar conversaciones por usuario
    List<Conversacion> findByUsuarioIdUsuarioAndEliminadaFalse(Long idUsuario);

    // ✅ AGREGADO - Ordenado por fecha descendente
    List<Conversacion> findByUsuarioIdUsuarioAndEliminadaFalseOrderByFechaInicioDesc(Long idUsuario);

    // Buscar conversaciones por usuario con paginación
    Page<Conversacion> findByUsuarioIdUsuarioAndEliminadaFalse(Long idUsuario, Pageable pageable);

    // Buscar conversaciones guardadas
    List<Conversacion> findByUsuarioIdUsuarioAndGuardadaTrueAndEliminadaFalse(Long idUsuario);

    // ✅ AGREGADO - Conversaciones guardadas ordenadas
    List<Conversacion> findByUsuarioIdUsuarioAndGuardadaTrueAndEliminadaFalseOrderByFechaInicioDesc(Long idUsuario);

    // Buscar por ID y usuario (para seguridad)
    Optional<Conversacion> findByIdConversacionAndUsuarioIdUsuario(Long idConversacion, Long idUsuario);

    // ✅ AGREGADO - Búsqueda por rango de fechas simplificado
    List<Conversacion> findByUsuarioIdUsuarioAndFechaInicioBetweenAndEliminadaFalse(
            Long idUsuario,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin
    );

    // Buscar conversaciones por rango de fechas (método existente con @Query)
    @Query("SELECT c FROM Conversacion c WHERE c.usuario.idUsuario = :idUsuario " +
            "AND c.fechaInicio BETWEEN :fechaInicio AND :fechaFin " +
            "AND c.eliminada = false")
    List<Conversacion> findByUsuarioAndFechaRange(
            @Param("idUsuario") Long idUsuario,
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

    // Contar conversaciones activas del usuario
    Long countByUsuarioIdUsuarioAndEliminadaFalse(Long idUsuario);

    // Buscar últimas conversaciones
    @Query("SELECT c FROM Conversacion c WHERE c.usuario.idUsuario = :idUsuario " +
            "AND c.eliminada = false ORDER BY c.fechaInicio DESC")
    List<Conversacion> findUltimasConversaciones(@Param("idUsuario") Long idUsuario, Pageable pageable);
}