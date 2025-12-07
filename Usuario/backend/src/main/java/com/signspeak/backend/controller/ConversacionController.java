package com.signspeak.backend.controller;

import com.signspeak.backend.dto.*;
import com.signspeak.backend.service.ConversacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/conversaciones")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ConversacionController {

    private final ConversacionService conversacionService;

    /**
     * Crear una nueva conversación
     * POST /api/conversaciones
     */
    @PostMapping
    public ResponseEntity<ConversacionDTO> crearConversacion(
            @Valid @RequestBody CrearConversacionRequest request) {
        log.info("POST /api/conversaciones - Crear nueva conversación");
        ConversacionDTO conversacion = conversacionService.crearConversacion(request);
        return new ResponseEntity<>(conversacion, HttpStatus.CREATED);
    }

    /**
     * Agregar mensaje a conversación
     * POST /api/conversaciones/{id}/mensajes
     */
    @PostMapping("/{id}/mensajes")
    public ResponseEntity<MensajeConversacionDTO> agregarMensaje(
            @PathVariable Long id,
            @Valid @RequestBody AgregarMensajeRequest request) {
        log.info("POST /api/conversaciones/{}/mensajes - Agregar mensaje", id);
        MensajeConversacionDTO mensaje = conversacionService.agregarMensaje(id, request);
        return new ResponseEntity<>(mensaje, HttpStatus.CREATED);
    }

    /**
     * Finalizar conversación
     * PUT /api/conversaciones/{id}/finalizar
     */
    @PutMapping("/{id}/finalizar")
    public ResponseEntity<ConversacionDTO> finalizarConversacion(
            @PathVariable Long id,
            @RequestBody(required = false) FinalizarConversacionRequest request) {
        log.info("PUT /api/conversaciones/{}/finalizar - Finalizar conversación", id);

        if (request == null) {
            request = new FinalizarConversacionRequest();
        }

        ConversacionDTO conversacion = conversacionService.finalizarConversacion(id, request);
        return ResponseEntity.ok(conversacion);
    }

    /**
     * Obtener conversación por ID
     * GET /api/conversaciones/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ConversacionDTO> obtenerConversacion(@PathVariable Long id) {
        log.info("GET /api/conversaciones/{} - Obtener conversación", id);
        ConversacionDTO conversacion = conversacionService.obtenerConversacion(id);
        return ResponseEntity.ok(conversacion);
    }

    /**
     * Obtener conversación con todos sus mensajes
     * GET /api/conversaciones/{id}/completa
     */
    @GetMapping("/{id}/completa")
    public ResponseEntity<ConversacionDTO> obtenerConversacionCompleta(@PathVariable Long id) {
        log.info("GET /api/conversaciones/{}/completa - Obtener conversación con mensajes", id);
        ConversacionDTO conversacion = conversacionService.obtenerConversacionConMensajes(id);
        return ResponseEntity.ok(conversacion);
    }

    /**
     * Listar conversaciones de un usuario
     * GET /api/conversaciones/usuario/{idUsuario}
     */
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<ConversacionDTO>> listarConversacionesPorUsuario(
            @PathVariable Long idUsuario) {
        log.info("GET /api/conversaciones/usuario/{} - Listar conversaciones", idUsuario);
        List<ConversacionDTO> conversaciones = conversacionService.listarConversacionesPorUsuario(idUsuario);
        return ResponseEntity.ok(conversaciones);
    }

    /**
     * Listar conversaciones con paginación
     * GET /api/conversaciones/usuario/{idUsuario}/paginado?page=0&size=10&sort=fechaInicio,desc
     */
    @GetMapping("/usuario/{idUsuario}/paginado")
    public ResponseEntity<Page<ConversacionDTO>> listarConversacionesPaginadas(
            @PathVariable Long idUsuario,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "fechaInicio") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        log.info("GET /api/conversaciones/usuario/{}/paginado - Página: {}, Tamaño: {}",
                idUsuario, page, size);

        Sort sort = sortDir.equalsIgnoreCase("ASC")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ConversacionDTO> conversaciones = conversacionService.listarConversacionesPaginadas(idUsuario, pageable);

        return ResponseEntity.ok(conversaciones);
    }

    /**
     * Listar conversaciones guardadas
     * GET /api/conversaciones/usuario/{idUsuario}/guardadas
     */
    @GetMapping("/usuario/{idUsuario}/guardadas")
    public ResponseEntity<List<ConversacionDTO>> listarConversacionesGuardadas(
            @PathVariable Long idUsuario) {
        log.info("GET /api/conversaciones/usuario/{}/guardadas - Listar guardadas", idUsuario);
        List<ConversacionDTO> conversaciones = conversacionService.listarConversacionesGuardadas(idUsuario);
        return ResponseEntity.ok(conversaciones);
    }

    /**
     * Buscar conversaciones por rango de fechas
     * GET /api/conversaciones/usuario/{idUsuario}/buscar?inicio=2024-01-01T00:00:00&fin=2024-12-31T23:59:59
     */
    @GetMapping("/usuario/{idUsuario}/buscar")
    public ResponseEntity<List<ConversacionDTO>> buscarPorRangoFechas(
            @PathVariable Long idUsuario,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {

        log.info("GET /api/conversaciones/usuario/{}/buscar - Rango: {} a {}",
                idUsuario, inicio, fin);

        List<ConversacionDTO> conversaciones = conversacionService.buscarPorRangoFechas(idUsuario, inicio, fin);
        return ResponseEntity.ok(conversaciones);
    }

    /**
     * Marcar/desmarcar conversación como guardada
     * PUT /api/conversaciones/{id}/guardar
     */
    @PutMapping("/{id}/guardar")
    public ResponseEntity<ConversacionDTO> marcarComoGuardada(
            @PathVariable Long id,
            @RequestParam Boolean guardada) {
        log.info("PUT /api/conversaciones/{}/guardar - Valor: {}", id, guardada);
        ConversacionDTO conversacion = conversacionService.marcarComoGuardada(id, guardada);
        return ResponseEntity.ok(conversacion);
    }

    /**
     * Eliminar conversación (soft delete)
     * DELETE /api/conversaciones/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarConversacion(@PathVariable Long id) {
        log.info("DELETE /api/conversaciones/{} - Eliminar conversación", id);
        conversacionService.eliminarConversacion(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Obtener solo los mensajes de una conversación
     * GET /api/conversaciones/{id}/mensajes
     */
    @GetMapping("/{id}/mensajes")
    public ResponseEntity<List<MensajeConversacionDTO>> obtenerMensajes(@PathVariable Long id) {
        log.info("GET /api/conversaciones/{}/mensajes - Obtener mensajes", id);
        List<MensajeConversacionDTO> mensajes = conversacionService.obtenerMensajes(id);
        return ResponseEntity.ok(mensajes);
    }

    /**
     * Contar conversaciones activas de un usuario
     * GET /api/conversaciones/usuario/{idUsuario}/count
     */
    @GetMapping("/usuario/{idUsuario}/count")
    public ResponseEntity<Long> contarConversacionesActivas(@PathVariable Long idUsuario) {
        log.info("GET /api/conversaciones/usuario/{}/count - Contar conversaciones", idUsuario);
        Long count = conversacionService.contarConversacionesActivas(idUsuario);
        return ResponseEntity.ok(count);
    }
}