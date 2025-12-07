package com.signspeak.backend.repository;

import com.signspeak.backend.model.MensajeConversacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeConversacionRepository extends JpaRepository<MensajeConversacion, Long> {

    // Buscar mensajes por conversación
    List<MensajeConversacion> findByConversacionIdConversacionOrderByFechaHoraAsc(Long idConversacion);

    // Contar mensajes por conversación
    Long countByConversacionIdConversacion(Long idConversacion);

    // Buscar mensajes por tipo
    @Query("SELECT m FROM MensajeConversacion m WHERE m.conversacion.idConversacion = :idConversacion " +
            "AND m.tipoMensaje = :tipoMensaje ORDER BY m.fechaHora ASC")  // ✅ CAMBIADO de timestamp a fechaHora
    List<MensajeConversacion> findByConversacionAndTipo(
            @Param("idConversacion") Long idConversacion,
            @Param("tipoMensaje") MensajeConversacion.TipoMensaje tipoMensaje
    );

    // Buscar mensajes con baja confianza
    @Query("SELECT m FROM MensajeConversacion m WHERE m.conversacion.idConversacion = :idConversacion " +
            "AND m.confianzaDeteccion < :umbral ORDER BY m.fechaHora ASC")  // ✅ CAMBIADO de timestamp a fechaHora
    List<MensajeConversacion> findMensajesBajaConfianza(
            @Param("idConversacion") Long idConversacion,
            @Param("umbral") java.math.BigDecimal umbral
    );
}