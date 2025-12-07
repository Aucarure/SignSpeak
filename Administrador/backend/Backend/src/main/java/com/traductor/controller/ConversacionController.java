package com.traductor.controller;

import com.traductor.dto.ConversacionRequest;
import com.traductor.dto.ConversacionResponse;
import com.traductor.dto.MensajeRequest;
import com.traductor.service.ConversacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/conversaciones")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RequiredArgsConstructor
public class ConversacionController {

    private final ConversacionService conversacionService;

    // Crear nueva conversación
    @PostMapping
    public ResponseEntity<ConversacionResponse> crearConversacion(@RequestBody ConversacionRequest request) {
        try {
            ConversacionResponse conversacion = conversacionService.crearConversacion(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(conversacion);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Agregar mensaje a conversación
    @PostMapping("/mensaje")
    public ResponseEntity<ConversacionResponse> agregarMensaje(@RequestBody MensajeRequest request) {
        try {
            ConversacionResponse conversacion = conversacionService.agregarMensaje(request);
            return ResponseEntity.ok(conversacion);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Obtener conversación por ID
    @GetMapping("/{id}")
    public ResponseEntity<ConversacionResponse> obtenerConversacion(@PathVariable Long id) {
        try {
            ConversacionResponse conversacion = conversacionService.obtenerConversacion(id);
            return ResponseEntity.ok(conversacion);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Listar conversaciones de un usuario
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<ConversacionResponse>> listarConversaciones(@PathVariable Long idUsuario) {
        List<ConversacionResponse> conversaciones = conversacionService.listarConversaciones(idUsuario);
        return ResponseEntity.ok(conversaciones);
    }

    // Listar solo conversaciones guardadas
    @GetMapping("/usuario/{idUsuario}/guardadas")
    public ResponseEntity<List<ConversacionResponse>> listarConversacionesGuardadas(@PathVariable Long idUsuario) {
        List<ConversacionResponse> conversaciones = conversacionService.listarConversacionesGuardadas(idUsuario);
        return ResponseEntity.ok(conversaciones);
    }

    // Guardar conversación (CA-17)
    @PutMapping("/{id}/guardar")
    public ResponseEntity<ConversacionResponse> guardarConversacion(@PathVariable Long id) {
        try {
            ConversacionResponse conversacion = conversacionService.guardarConversacion(id);
            return ResponseEntity.ok(conversacion);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Finalizar conversación
    @PutMapping("/{id}/finalizar")
    public ResponseEntity<ConversacionResponse> finalizarConversacion(@PathVariable Long id) {
        try {
            ConversacionResponse conversacion = conversacionService.finalizarConversacion(id);
            return ResponseEntity.ok(conversacion);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Eliminar conversación (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarConversacion(@PathVariable Long id) {
        try {
            conversacionService.eliminarConversacion(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
