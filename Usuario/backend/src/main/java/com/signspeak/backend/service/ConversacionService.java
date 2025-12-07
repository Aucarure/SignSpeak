package com.signspeak.backend.service;

import com.signspeak.backend.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface ConversacionService {

    // Crear nueva conversación
    ConversacionDTO crearConversacion(CrearConversacionRequest request);

    // Agregar mensaje a conversación
    MensajeConversacionDTO agregarMensaje(Long idConversacion, AgregarMensajeRequest request);

    // Finalizar conversación
    ConversacionDTO finalizarConversacion(Long idConversacion, FinalizarConversacionRequest request);

    // Obtener conversación por ID
    ConversacionDTO obtenerConversacion(Long idConversacion);

    // Obtener conversación con mensajes
    ConversacionDTO obtenerConversacionConMensajes(Long idConversacion);

    // Listar conversaciones de un usuario
    List<ConversacionDTO> listarConversacionesPorUsuario(Long idUsuario);

    // Listar conversaciones con paginación
    Page<ConversacionDTO> listarConversacionesPaginadas(Long idUsuario, Pageable pageable);

    // Listar conversaciones guardadas
    List<ConversacionDTO> listarConversacionesGuardadas(Long idUsuario);

    // Buscar conversaciones por rango de fechas
    List<ConversacionDTO> buscarPorRangoFechas(Long idUsuario, LocalDateTime inicio, LocalDateTime fin);

    // Marcar conversación como guardada
    ConversacionDTO marcarComoGuardada(Long idConversacion, Boolean guardada);

    // Eliminar conversación (soft delete)
    void eliminarConversacion(Long idConversacion);

    // Obtener mensajes de una conversación
    List<MensajeConversacionDTO> obtenerMensajes(Long idConversacion);

    // Contar conversaciones activas
    Long contarConversacionesActivas(Long idUsuario);
}