package com.signspeak.backend.service.impl;

import com.signspeak.backend.dto.*;
import com.signspeak.backend.exception.ResourceNotFoundException;
import com.signspeak.backend.model.Conversacion;
import com.signspeak.backend.model.MensajeConversacion;
import com.signspeak.backend.model.Usuario;
import com.signspeak.backend.model.DiccionarioSena;
import com.signspeak.backend.repository.ConversacionRepository;
import com.signspeak.backend.repository.UsuarioRepository;
import com.signspeak.backend.repository.DiccionarioSenaRepository;
import com.signspeak.backend.service.ConversacionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ConversacionServiceImpl implements ConversacionService {

    private final ConversacionRepository conversacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final DiccionarioSenaRepository diccionarioSenaRepository;

    @Override
    public ConversacionDTO crearConversacion(CrearConversacionRequest request) {
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Conversacion conversacion = new Conversacion();
        conversacion.setUsuario(usuario);
        conversacion.setTitulo(request.getTituloConversacion());
        conversacion.setFechaInicio(LocalDateTime.now());
        conversacion.setGuardada(false);
        conversacion.setEliminada(false);
        conversacion.setNumMensajes(0);

        conversacion = conversacionRepository.save(conversacion);
        log.info("Conversación creada: {}", conversacion.getIdConversacion());

        return convertirADTO(conversacion, false);
    }

    @Override
    public MensajeConversacionDTO agregarMensaje(Long idConversacion, AgregarMensajeRequest request) {
        Conversacion conversacion = conversacionRepository.findById(idConversacion)
                .orElseThrow(() -> new ResourceNotFoundException("Conversación no encontrada"));

        MensajeConversacion mensaje = new MensajeConversacion();
        mensaje.setConversacion(conversacion);
        mensaje.setTipoMensaje(request.getTipoMensaje());
        mensaje.setContenidoTexto(request.getContenidoTexto());
        mensaje.setConfianzaDeteccion(request.getConfianzaDeteccion());
        mensaje.setFechaHora(LocalDateTime.now());

        if (request.getIdSenaDetectada() != null) {
            DiccionarioSena sena = diccionarioSenaRepository.findById(request.getIdSenaDetectada())
                    .orElse(null);
            mensaje.setSenaDetectada(sena);
        }

        conversacion.agregarMensaje(mensaje);
        conversacionRepository.save(conversacion);

        return convertirMensajeADTO(mensaje);
    }

    @Override
    public ConversacionDTO finalizarConversacion(Long idConversacion, FinalizarConversacionRequest request) {
        Conversacion conversacion = conversacionRepository.findById(idConversacion)
                .orElseThrow(() -> new ResourceNotFoundException("Conversación no encontrada"));

        conversacion.setFechaFin(LocalDateTime.now());
        conversacion.calcularDuracion();

        if (request != null && request.getResumenConversacion() != null) {
            if (conversacion.getMetadata() != null) {
                conversacion.getMetadata().put("resumen", request.getResumenConversacion());
            }
        }

        conversacion = conversacionRepository.save(conversacion);
        log.info("Conversación finalizada: {}", conversacion.getIdConversacion());

        return convertirADTO(conversacion, false);
    }

    @Override
    @Transactional(readOnly = true)
    public ConversacionDTO obtenerConversacion(Long idConversacion) {
        Conversacion conversacion = conversacionRepository.findById(idConversacion)
                .orElseThrow(() -> new ResourceNotFoundException("Conversación no encontrada"));
        return convertirADTO(conversacion, false);
    }

    @Override
    @Transactional(readOnly = true)
    public ConversacionDTO obtenerConversacionConMensajes(Long idConversacion) {
        Conversacion conversacion = conversacionRepository.findById(idConversacion)
                .orElseThrow(() -> new ResourceNotFoundException("Conversación no encontrada"));
        return convertirADTO(conversacion, true);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConversacionDTO> listarConversacionesPorUsuario(Long idUsuario) {
        List<Conversacion> conversaciones = conversacionRepository
                .findByUsuarioIdUsuarioAndEliminadaFalseOrderByFechaInicioDesc(idUsuario);
        return conversaciones.stream()
                .map(c -> convertirADTO(c, false))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ConversacionDTO> listarConversacionesPaginadas(Long idUsuario, Pageable pageable) {
        Page<Conversacion> page = conversacionRepository
                .findByUsuarioIdUsuarioAndEliminadaFalse(idUsuario, pageable);
        return page.map(c -> convertirADTO(c, false));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConversacionDTO> listarConversacionesGuardadas(Long idUsuario) {
        List<Conversacion> conversaciones = conversacionRepository
                .findByUsuarioIdUsuarioAndGuardadaTrueAndEliminadaFalseOrderByFechaInicioDesc(idUsuario);
        return conversaciones.stream()
                .map(c -> convertirADTO(c, false))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConversacionDTO> buscarPorRangoFechas(Long idUsuario, LocalDateTime inicio, LocalDateTime fin) {
        List<Conversacion> conversaciones = conversacionRepository
                .findByUsuarioIdUsuarioAndFechaInicioBetweenAndEliminadaFalse(idUsuario, inicio, fin);
        return conversaciones.stream()
                .map(c -> convertirADTO(c, false))
                .collect(Collectors.toList());
    }

    @Override
    public ConversacionDTO marcarComoGuardada(Long idConversacion, Boolean guardada) {
        Conversacion conversacion = conversacionRepository.findById(idConversacion)
                .orElseThrow(() -> new ResourceNotFoundException("Conversación no encontrada"));

        conversacion.setGuardada(guardada);
        conversacion = conversacionRepository.save(conversacion);

        log.info("Conversación {} marcada como guardada: {}", idConversacion, guardada);

        return convertirADTO(conversacion, false);
    }

    @Override
    public void eliminarConversacion(Long idConversacion) {
        Conversacion conversacion = conversacionRepository.findById(idConversacion)
                .orElseThrow(() -> new ResourceNotFoundException("Conversación no encontrada"));

        conversacion.setEliminada(true);
        conversacionRepository.save(conversacion);
        log.info("Conversación eliminada (soft delete): {}", idConversacion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MensajeConversacionDTO> obtenerMensajes(Long idConversacion) {
        Conversacion conversacion = conversacionRepository.findById(idConversacion)
                .orElseThrow(() -> new ResourceNotFoundException("Conversación no encontrada"));

        return conversacion.getMensajes().stream()
                .map(this::convertirMensajeADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Long contarConversacionesActivas(Long idUsuario) {
        return conversacionRepository.countByUsuarioIdUsuarioAndEliminadaFalse(idUsuario);
    }

    // ===== MÉTODOS AUXILIARES DE CONVERSIÓN =====

    private ConversacionDTO convertirADTO(Conversacion conversacion, boolean incluirMensajes) {
        ConversacionDTO dto = new ConversacionDTO();
        dto.setIdConversacion(conversacion.getIdConversacion());
        dto.setIdUsuario(conversacion.getUsuario().getIdUsuario());
        dto.setNombreUsuario(conversacion.getUsuario().getNombre());
        dto.setTitulo(conversacion.getTitulo());
        dto.setFechaInicio(conversacion.getFechaInicio());
        dto.setFechaFin(conversacion.getFechaFin());
        dto.setDuracionTotalSegundos(conversacion.getDuracionTotalSegundos());
        dto.setNumMensajes(conversacion.getNumMensajes());
        dto.setGuardada(conversacion.getGuardada());
        dto.setEliminada(conversacion.getEliminada());
        dto.setMetadata(conversacion.getMetadata());

        if (incluirMensajes && conversacion.getMensajes() != null) {
            dto.setMensajes(conversacion.getMensajes().stream()
                    .map(this::convertirMensajeADTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private MensajeConversacionDTO convertirMensajeADTO(MensajeConversacion mensaje) {
        MensajeConversacionDTO dto = new MensajeConversacionDTO();
        dto.setIdMensaje(mensaje.getIdMensaje());
        dto.setTipoMensaje(mensaje.getTipoMensaje());
        dto.setContenidoTexto(mensaje.getContenidoTexto());
        dto.setFechaHora(mensaje.getFechaHora());
        dto.setConfianzaDeteccion(mensaje.getConfianzaDeteccion());

        if (mensaje.getSenaDetectada() != null) {
            dto.setIdSenaDetectada(mensaje.getSenaDetectada().getIdSena());
            dto.setNombreSena(mensaje.getSenaDetectada().getPalabra());
        }

        return dto;
    }
}