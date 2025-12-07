package com.traductor.service;

import com.traductor.dto.ConversacionRequest;
import com.traductor.dto.ConversacionResponse;
import com.traductor.dto.MensajeRequest;
import com.traductor.model.Conversacion;

import java.util.List;

public interface ConversacionService {
    
    // Crear nueva conversación
    ConversacionResponse crearConversacion(ConversacionRequest request);
    
    // Agregar mensaje a conversación
    ConversacionResponse agregarMensaje(MensajeRequest request);
    
    // Obtener conversación por ID
    ConversacionResponse obtenerConversacion(Long idConversacion);
    
    // Listar todas las conversaciones de un usuario
    List<ConversacionResponse> listarConversaciones(Long idUsuario);
    
    // Listar solo conversaciones guardadas
    List<ConversacionResponse> listarConversacionesGuardadas(Long idUsuario);
    
    // Guardar conversación (marcar como importante)
    ConversacionResponse guardarConversacion(Long idConversacion);
    
    // Finalizar conversación
    ConversacionResponse finalizarConversacion(Long idConversacion);
    
    // Eliminar conversación (soft delete)
    void eliminarConversacion(Long idConversacion);
    
    // Obtener conversación activa de un usuario
    Conversacion obtenerConversacionActiva(Long idUsuario);
}