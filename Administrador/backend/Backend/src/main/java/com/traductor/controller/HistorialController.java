package com.traductor.controller;

import com.traductor.model.HistorialDeteccion;
import com.traductor.service.HistorialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/historial")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class HistorialController {

    private final HistorialService historialService;

    @GetMapping("/{idUsuario}")
    public List<HistorialDeteccion> listar(@PathVariable Long idUsuario) {
        return historialService.listar(idUsuario);
    }

    @PostMapping
    public HistorialDeteccion guardar(@RequestBody HistorialDeteccion historial) {
        return historialService.guardar(historial);
    }

    @DeleteMapping("/usuario/{idUsuario}")
    public ResponseEntity<Void> limpiarHistorial(@PathVariable Long idUsuario) {
        historialService.limpiarHistorialUsuario(idUsuario);
        return ResponseEntity.noContent().build();
    }
}