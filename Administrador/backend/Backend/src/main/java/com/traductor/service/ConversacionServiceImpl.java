package com.traductor.service;

import com.traductor.dto.ConversacionRequest;
import com.traductor.dto.ConversacionResponse;
import com.traductor.dto.MensajeRequest;
import com.traductor.model.Conversacion;
import com.traductor.model.MensajeConversacion;
import com.traductor.model.Usuario;
import com.traductor.repository.ConversacionRepository;
import com.traductor.repository.MensajeConversacionRepository;
import com.traductor.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConversacionServiceImpl implements ConversacionService {

    private final ConversacionRepository conversacionRepository;
    private final MensajeConversacionRepository mensajeRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public ConversacionResponse crearConversacion(ConversacionRequest request) {
        // Buscar usuario
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + request.getIdUsuario()));

        // Crear conversación
        Conversacion conversacion = Conversacion.builder()
                .usuario(usuario)
                .titulo(request.getTitulo() != null ? request.getTitulo() : "Conversación sin título")
                .fechaInicio(java.time.LocalDateTime.now())
                .numMensajes(0)
                .duracionTotalSegundos(0)
                .guardada(false)
                .eliminada(false)
                .build();

        Conversacion guardada = conversacionRepository.save(conversacion);
        return ConversacionResponse.fromEntity(guardada);
    }

    @Override
    @Transactional
    public ConversacionResponse agregarMensaje(MensajeRequest request) {
        // Buscar conversación
        Conversacion conversacion = conversacionRepository.findById(request.getIdConversacion())
                .orElseThrow(() -> new RuntimeException("Conversación no encontrada con ID: " + request.getIdConversacion()));

        // Crear mensaje
        MensajeConversacion mensaje = MensajeConversacion.builder()
                .conversacion(conversacion)
                .tipoMensaje(request.getTipoMensaje())
                .contenidoTexto(request.getContenidoTexto())
                .señaDetectada(request.getSeñaDetectada())
                .confianzaDeteccion(request.getConfianzaDeteccion())
                .timestamp(java.time.LocalDateTime.now())
                .esCorrecto(true)
                .build();

        // Agregar mensaje a conversación
        conversacion.agregarMensaje(mensaje);
        
        // Guardar
        mensajeRepository.save(mensaje);
        Conversacion actualizada = conversacionRepository.save(conversacion);

        return ConversacionResponse.fromEntity(actualizada);
    }

    @Override
    @Transactional(readOnly = true)
    public ConversacionResponse obtenerConversacion(Long idConversacion) {
        Conversacion conversacion = conversacionRepository.findById(idConversacion)
                .orElseThrow(() -> new RuntimeException("Conversación no encontrada con ID: " + idConversacion));
        
        return ConversacionResponse.fromEntity(conversacion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConversacionResponse> listarConversaciones(Long idUsuario) {
        List<Conversacion> conversaciones = conversacionRepository
                .findByUsuario_IdUsuarioAndEliminadaFalseOrderByFechaInicioDesc(idUsuario);
        
        return conversaciones.stream()
                .map(ConversacionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConversacionResponse> listarConversacionesGuardadas(Long idUsuario) {
        List<Conversacion> conversaciones = conversacionRepository
                .findByUsuario_IdUsuarioAndGuardadaTrueAndEliminadaFalseOrderByFechaInicioDesc(idUsuario);
        
        return conversaciones.stream()
                .map(ConversacionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ConversacionResponse guardarConversacion(Long idConversacion) {
        Conversacion conversacion = conversacionRepository.findById(idConversacion)
                .orElseThrow(() -> new RuntimeException("Conversación no encontrada con ID: " + idConversacion));
        
        conversacion.setGuardada(true);
        Conversacion guardada = conversacionRepository.save(conversacion);
        
        return ConversacionResponse.fromEntity(guardada);
    }

    @Override
    @Transactional
    public ConversacionResponse finalizarConversacion(Long idConversacion) {
        Conversacion conversacion = conversacionRepository.findById(idConversacion)
                .orElseThrow(() -> new RuntimeException("Conversación no encontrada con ID: " + idConversacion));
        
        conversacion.finalizar();
        Conversacion finalizada = conversacionRepository.save(conversacion);
        
        return ConversacionResponse.fromEntity(finalizada);
    }

    @Override
    @Transactional
    public void eliminarConversacion(Long idConversacion) {
        Conversacion conversacion = conversacionRepository.findById(idConversacion)
                .orElseThrow(() -> new RuntimeException("Conversación no encontrada con ID: " + idConversacion));
        
        conversacion.setEliminada(true);
        conversacionRepository.save(conversacion);
    }

    @Override
    @Transactional(readOnly = true)
    public Conversacion obtenerConversacionActiva(Long idUsuario) {
        List<Conversacion> activas = conversacionRepository.findConversacionesActivasByUsuario(idUsuario);
        
        if (activas.isEmpty()) {
            return null;
        }
        
        return activas.get(0); // Retorna la más reciente
    }
}