package com.signspeak.backend.service;

import com.signspeak.backend.dto.*;
import org.springframework.data.domain.Page;
import java.util.List;

public interface DiccionarioService {

    // Categorías
    List<CategoriaSenaDTO> obtenerTodasCategorias();
    List<CategoriaSenaDTO> obtenerCategoriasActivas();
    CategoriaSenaDTO obtenerCategoriaPorId(Long id);

    // Señas
    Page<DiccionarioSenaDTO> obtenerTodasSenas(int pagina, int tamanoPagina);
    DiccionarioSenaDTO obtenerSenaPorId(Long id);
    DiccionarioSenaDTO obtenerSenaPorNombre(String nombre);  // ✅ Cambiado

    // Búsqueda y filtros
    Page<DiccionarioSenaDTO> buscarSenas(String busqueda, int pagina, int tamanoPagina);
    Page<DiccionarioSenaDTO> filtrarSenas(FiltrosDiccionarioRequest filtros);

    // Señas populares/destacadas
    List<DiccionarioSenaDTO> obtenerSenasPopulares(int limite);
    List<DiccionarioSenaDTO> obtenerSenasMasPracticadas(int limite);

    // Estadísticas
    Long contarSenasPorCategoria(Long idCategoria);
    Long contarSenasPorDificultad(String dificultad);
}