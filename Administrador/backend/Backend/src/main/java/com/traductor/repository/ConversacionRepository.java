package com.traductor.repository;

import com.traductor.model.Conversacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversacionRepository extends JpaRepository<Conversacion, Long> {
    
    // Buscar conversaciones por usuario
    List<Conversacion> findByUsuario_IdUsuarioAndEliminadaFalseOrderByFechaInicioDesc(Long idUsuario);
    
    // Buscar solo conversaciones guardadas
    List<Conversacion> findByUsuario_IdUsuarioAndGuardadaTrueAndEliminadaFalseOrderByFechaInicioDesc(Long idUsuario);
    
    // Buscar conversaciones activas (sin finalizar)
    @Query("SELECT c FROM Conversacion c WHERE c.usuario.idUsuario = :idUsuario AND c.fechaFin IS NULL AND c.eliminada = false")
    List<Conversacion> findConversacionesActivasByUsuario(@Param("idUsuario") Long idUsuario);
    
    // Contar conversaciones de un usuario
    Long countByUsuario_IdUsuarioAndEliminadaFalse(Long idUsuario);
}