package com.traductor.repository;

import com.traductor.model.MensajeConversacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeConversacionRepository extends JpaRepository<MensajeConversacion, Long> {
    
    // Obtener mensajes de una conversación
    List<MensajeConversacion> findByConversacion_IdConversacionOrderByTimestampAsc(Long idConversacion);
    
    // Contar mensajes por tipo
    Long countByConversacion_IdConversacionAndTipoMensaje(Long idConversacion, String tipoMensaje);
}