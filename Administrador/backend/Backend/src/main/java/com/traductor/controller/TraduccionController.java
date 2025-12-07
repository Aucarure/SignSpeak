package com.traductor.controller;

import com.traductor.dto.TraduccionRequest;
import com.traductor.model.HistorialDeteccion;
import com.traductor.model.HistorialTraduccion;
import com.traductor.model.Usuario;
import com.traductor.repository.UsuarioRepository;
import com.traductor.service.HistorialDeteccionService;
import com.traductor.service.HistorialTraduccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/traducciones")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}) // ✅ Ambos puertos
public class TraduccionController {

    private final HistorialTraduccionService historialTraduccionService;
    private final HistorialDeteccionService historialDeteccionService;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public TraduccionController(
            HistorialTraduccionService historialTraduccionService,
            HistorialDeteccionService historialDeteccionService,
            UsuarioRepository usuarioRepository) {
        this.historialTraduccionService = historialTraduccionService;
        this.historialDeteccionService = historialDeteccionService;
        this.usuarioRepository = usuarioRepository;
    }

    // ============================================
    // TEXTO/VOZ → SEÑAS (Guarda en historial_traducciones)
    // ============================================

    @PostMapping("/texto-a-señas")
    public ResponseEntity<Map<String, Object>> textoASeñas(@RequestBody TraduccionRequest request) {
        try {
            Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Crear historial de traducción
            HistorialTraduccion traduccion = HistorialTraduccion.builder()
                    .usuario(usuario)
                    .tipoEntrada("texto")
                    .textoOriginal(request.getMensaje() != null ? request.getMensaje() : request.getEntrada())
                    .textoTraducido("🤟 Traducción simulada de texto a señas")
                    .timestamp(LocalDateTime.now())
                    .exitoso(true)
                    .build();

            historialTraduccionService.guardar(traduccion);

            Map<String, Object> response = new HashMap<>();
            response.put("idTraduccion", traduccion.getIdTraduccion());
            response.put("entrada", traduccion.getTextoOriginal());
            response.put("resultado", traduccion.getTextoTraducido());
            response.put("timestamp", traduccion.getTimestamp());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/voz-a-señas")
    public ResponseEntity<Map<String, Object>> vozASeñas(@RequestBody TraduccionRequest request) {
        try {
            Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            HistorialTraduccion traduccion = HistorialTraduccion.builder()
                    .usuario(usuario)
                    .tipoEntrada("voz")
                    .textoOriginal(request.getMensaje() != null ? request.getMensaje() : request.getEntrada())
                    .textoTraducido("🗣️ Traducción simulada de voz a señas")
                    .timestamp(LocalDateTime.now())
                    .exitoso(true)
                    .build();

            historialTraduccionService.guardar(traduccion);

            Map<String, Object> response = new HashMap<>();
            response.put("idTraduccion", traduccion.getIdTraduccion());
            response.put("entrada", traduccion.getTextoOriginal());
            response.put("resultado", traduccion.getTextoTraducido());
            response.put("timestamp", traduccion.getTimestamp());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // ============================================
    // HISTORIAL DE TRADUCCIONES
    // ============================================

    @GetMapping("/historial/{idUsuario}")
    public ResponseEntity<List<HistorialTraduccion>> obtenerHistorialTraducciones(@PathVariable Long idUsuario) {
        List<HistorialTraduccion> historial = historialTraduccionService.listarPorUsuario(idUsuario);
        return ResponseEntity.ok(historial);
    }

    // ============================================
    // SEÑAS → TEXTO (Guarda en historial_detecciones)
    // ============================================

    @PostMapping("/señas-a-texto")
    public ResponseEntity<Map<String, Object>> señasATexto(@RequestBody TraduccionRequest request) {
        try {
            Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Esto vendría de tu Python backend (detección)
            HistorialDeteccion deteccion = HistorialDeteccion.builder()
                    .usuario(usuario)
                    .idSeñaDetectada(1L) // Simulado
                    .confianza(85.0)
                    .timestamp(LocalDateTime.now())
                    .contexto("practica_libre")
                    .build();

            historialDeteccionService.guardar(deteccion);

            Map<String, Object> response = new HashMap<>();
            response.put("idDeteccion", deteccion.getIdDeteccion());
            response.put("señaDetectada", "hola"); // Simulado
            response.put("confianza", deteccion.getConfianza());
            response.put("timestamp", deteccion.getTimestamp());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // ============================================
    // ENDPOINT GENÉRICO (Compatibilidad)
    // ============================================

    @PostMapping
    public ResponseEntity<Map<String, Object>> traducir(@RequestBody TraduccionRequest request) {
        try {
            // Redirigir según tipo
            if ("texto".equals(request.getTipoTraduccion())) {
                return textoASeñas(request);
            } else if ("voz".equals(request.getTipoTraduccion())) {
                return vozASeñas(request);
            } else if ("seña".equals(request.getTipoTraduccion())) {
                return señasATexto(request);
            }

            Map<String, Object> error = new HashMap<>();
            error.put("error", "Tipo de traducción desconocido");
            return ResponseEntity.badRequest().body(error);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}