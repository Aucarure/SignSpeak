package com.signspeak.backend.controller;

import com.signspeak.backend.dto.*;
import com.signspeak.backend.service.DiccionarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/diccionario")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DiccionarioController {

    private final DiccionarioService diccionarioService;

    // ============ CATEGORÍAS ============

    @GetMapping("/categorias")
    public ResponseEntity<ApiResponse<List<CategoriaSenaDTO>>> obtenerCategorias(
            @RequestParam(defaultValue = "true") boolean soloActivas
    ) {
        List<CategoriaSenaDTO> categorias = soloActivas
                ? diccionarioService.obtenerCategoriasActivas()
                : diccionarioService.obtenerTodasCategorias();

        return ResponseEntity.ok(ApiResponse.success(
                categorias,
                "Categorías obtenidas exitosamente"
        ));
    }

    @GetMapping("/categorias/{id}")
    public ResponseEntity<ApiResponse<CategoriaSenaDTO>> obtenerCategoriaPorId(
            @PathVariable Long id
    ) {
        CategoriaSenaDTO categoria = diccionarioService.obtenerCategoriaPorId(id);
        return ResponseEntity.ok(ApiResponse.success(
                categoria,
                "Categoría encontrada"
        ));
    }

    // ============ SEÑAS ============

    @GetMapping("/senas")
    public ResponseEntity<ApiResponse<Page<DiccionarioSenaDTO>>> obtenerSenas(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "20") int tamanoPagina
    ) {
        Page<DiccionarioSenaDTO> senas = diccionarioService.obtenerTodasSenas(pagina, tamanoPagina);
        return ResponseEntity.ok(ApiResponse.success(
                senas,
                "Señas obtenidas exitosamente"
        ));
    }

    @GetMapping("/senas/{id}")
    public ResponseEntity<ApiResponse<DiccionarioSenaDTO>> obtenerSenaPorId(
            @PathVariable Long id
    ) {
        DiccionarioSenaDTO sena = diccionarioService.obtenerSenaPorId(id);
        return ResponseEntity.ok(ApiResponse.success(
                sena,
                "Seña encontrada"
        ));
    }

    @GetMapping("/senas/nombre/{nombre}")
    public ResponseEntity<ApiResponse<DiccionarioSenaDTO>> obtenerSenaPorNombre(
            @PathVariable String nombre
    ) {
        DiccionarioSenaDTO sena = diccionarioService.obtenerSenaPorNombre(nombre);
        return ResponseEntity.ok(ApiResponse.success(
                sena,
                "Seña encontrada"
        ));
    }

    // ============ BÚSQUEDA ============

    @GetMapping("/buscar")
    public ResponseEntity<ApiResponse<Page<DiccionarioSenaDTO>>> buscarSenas(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "20") int tamanoPagina
    ) {
        Page<DiccionarioSenaDTO> senas = diccionarioService.buscarSenas(q, pagina, tamanoPagina);
        return ResponseEntity.ok(ApiResponse.success(
                senas,
                "Búsqueda completada"
        ));
    }

    @PostMapping("/filtrar")
    public ResponseEntity<ApiResponse<Page<DiccionarioSenaDTO>>> filtrarSenas(
            @RequestBody FiltrosDiccionarioRequest filtros
    ) {
        Page<DiccionarioSenaDTO> senas = diccionarioService.filtrarSenas(filtros);
        return ResponseEntity.ok(ApiResponse.success(
                senas,
                "Filtros aplicados exitosamente"
        ));
    }

    // ============ DESTACADAS ============

    @GetMapping("/populares")
    public ResponseEntity<ApiResponse<List<DiccionarioSenaDTO>>> obtenerSenasPopulares(
            @RequestParam(defaultValue = "10") int limite
    ) {
        List<DiccionarioSenaDTO> senas = diccionarioService.obtenerSenasPopulares(limite);
        return ResponseEntity.ok(ApiResponse.success(
                senas,
                "Señas populares obtenidas"
        ));
    }

    @GetMapping("/mas-practicadas")
    public ResponseEntity<ApiResponse<List<DiccionarioSenaDTO>>> obtenerSenasMasPracticadas(
            @RequestParam(defaultValue = "10") int limite
    ) {
        List<DiccionarioSenaDTO> senas = diccionarioService.obtenerSenasMasPracticadas(limite);
        return ResponseEntity.ok(ApiResponse.success(
                senas,
                "Señas más practicadas obtenidas"
        ));
    }

    // ============ ESTADÍSTICAS ============

    @GetMapping("/estadisticas")
    public ResponseEntity<ApiResponse<Map<String, Object>>> obtenerEstadisticas() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalSenas", diccionarioService.obtenerTodasSenas(0, Integer.MAX_VALUE).getTotalElements());
        stats.put("totalCategorias", diccionarioService.obtenerCategoriasActivas().size());

        return ResponseEntity.ok(ApiResponse.success(
                stats,
                "Estadísticas obtenidas"
        ));
    }
}