package com.signspeak.backend.service.impl;

import com.signspeak.backend.dto.*;
import com.signspeak.backend.exception.ResourceNotFoundException;
import com.signspeak.backend.model.CategoriaSena;
import com.signspeak.backend.model.DiccionarioSena;
import com.signspeak.backend.repository.CategoriaSenaRepository;
import com.signspeak.backend.repository.DiccionarioSenaRepository;
import com.signspeak.backend.service.DiccionarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DiccionarioServiceImpl implements DiccionarioService {

    private final DiccionarioSenaRepository diccionarioRepository;
    private final CategoriaSenaRepository categoriaRepository;

    // ============ CATEGORÍAS ============

    @Override
    public List<CategoriaSenaDTO> obtenerTodasCategorias() {
        return categoriaRepository.findAll().stream()
                .map(this::convertirCategoriaADTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoriaSenaDTO> obtenerCategoriasActivas() {
        return categoriaRepository.findByActivoTrueOrderByOrdenAsc().stream()
                .map(this::convertirCategoriaADTO)
                .collect(Collectors.toList());
    }

    @Override
    public CategoriaSenaDTO obtenerCategoriaPorId(Long id) {
        CategoriaSena categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con id: " + id));
        return convertirCategoriaADTO(categoria);
    }

    // ============ SEÑAS ============

    @Override
    public Page<DiccionarioSenaDTO> obtenerTodasSenas(int pagina, int tamanoPagina) {
        Pageable pageable = PageRequest.of(pagina, tamanoPagina, Sort.by("palabra").ascending());  // ✅ CAMBIADO
        Page<DiccionarioSena> senas = diccionarioRepository.findAll(pageable);
        return senas.map(this::convertirSenaADTO);
    }

    @Override
    public DiccionarioSenaDTO obtenerSenaPorId(Long id) {
        DiccionarioSena sena = diccionarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seña no encontrada con id: " + id));
        return convertirSenaADTO(sena);
    }

    @Override
    public DiccionarioSenaDTO obtenerSenaPorNombre(String nombre) {
        DiccionarioSena sena = diccionarioRepository.findByPalabraIgnoreCase(nombre)
                .orElseThrow(() -> new ResourceNotFoundException("Seña no encontrada con nombre: " + nombre));
        return convertirSenaADTO(sena);
    }

    // ============ BÚSQUEDA Y FILTROS ============

    @Override
    public Page<DiccionarioSenaDTO> buscarSenas(String busqueda, int pagina, int tamanoPagina) {
        Pageable pageable = PageRequest.of(pagina, tamanoPagina);
        Page<DiccionarioSena> senas = diccionarioRepository.buscarSenas(busqueda, pageable);
        return senas.map(this::convertirSenaADTO);
    }

    @Override
    public Page<DiccionarioSenaDTO> filtrarSenas(FiltrosDiccionarioRequest filtros) {
        int pagina = filtros.getPagina() != null ? filtros.getPagina() : 0;
        int tamanoPagina = filtros.getTamanoPagina() != null ? filtros.getTamanoPagina() : 20;

        // Determinar ordenamiento
        Sort sort = Sort.by("palabra").ascending();  // ✅ CAMBIADO
        if (filtros.getOrdenar() != null) {
            switch (filtros.getOrdenar().toLowerCase()) {
                case "popularidad":
                    sort = Sort.by("popularidad").descending();
                    break;
                case "reciente":
                    sort = Sort.by("fechaCreacion").descending();
                    break;
                case "practicada":
                    sort = Sort.by("vecesPracticada").descending();
                    break;
                default:
                    sort = Sort.by("palabra").ascending();  // ✅ CAMBIADO
            }
        }

        Pageable pageable = PageRequest.of(pagina, tamanoPagina, sort);

        // Convertir string a enum si existe
        DiccionarioSena.Dificultad dificultadEnum = null;
        if (filtros.getDificultad() != null) {
            try {
                dificultadEnum = DiccionarioSena.Dificultad.valueOf(filtros.getDificultad().toLowerCase());
            } catch (IllegalArgumentException e) {
                // Ignorar si el valor no es válido
            }
        }

        Page<DiccionarioSena> senas = diccionarioRepository.buscarConFiltros(
                filtros.getNombre(),
                filtros.getIdCategoria(),
                dificultadEnum,
                pageable
        );

        return senas.map(this::convertirSenaADTO);
    }

    // ============ POPULARES/DESTACADAS ============

    @Override
    public List<DiccionarioSenaDTO> obtenerSenasPopulares(int limite) {
        List<DiccionarioSena> senas = diccionarioRepository.findTop10ByActivoTrueOrderByPopularidadDesc();
        return senas.stream()
                .limit(limite)
                .map(this::convertirSenaADTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<DiccionarioSenaDTO> obtenerSenasMasPracticadas(int limite) {
        List<DiccionarioSena> senas = diccionarioRepository.findTop10ByActivoTrueOrderByVecesPracticadaDesc();
        return senas.stream()
                .limit(limite)
                .map(this::convertirSenaADTO)
                .collect(Collectors.toList());
    }

    // ============ ESTADÍSTICAS ============

    @Override
    public Long contarSenasPorCategoria(Long idCategoria) {
        return diccionarioRepository.findByActivoTrueAndCategoriaIdCategoria(
                idCategoria,
                Pageable.unpaged()
        ).getTotalElements();
    }

    @Override
    public Long contarSenasPorDificultad(String dificultad) {
        try {
            DiccionarioSena.Dificultad dificultadEnum = DiccionarioSena.Dificultad.valueOf(dificultad.toLowerCase());
            return diccionarioRepository.findByActivoTrueAndDificultad(
                    dificultadEnum,
                    Pageable.unpaged()
            ).getTotalElements();
        } catch (IllegalArgumentException e) {
            return 0L;
        }
    }

    // ============ CONVERSORES ============

    private DiccionarioSenaDTO convertirSenaADTO(DiccionarioSena sena) {
        DiccionarioSenaDTO dto = new DiccionarioSenaDTO();
        dto.setIdSena(sena.getIdSena());
        dto.setNombre(sena.getPalabra());
        dto.setDescripcion(sena.getDescripcion());
        dto.setCategoria(sena.getCategoria() != null ? convertirCategoriaADTO(sena.getCategoria()) : null);
        dto.setUrlVideo(sena.getUrlVideo());
        dto.setUrlImagen(sena.getUrlImagen());
        dto.setUrlAnimacion(sena.getUrlAnimacion());
        dto.setDuracionVideoSegundos(sena.getDuracionVideoSegundos());
        dto.setDificultad(sena.getDificultad() != null ? sena.getDificultad().name() : null);
        dto.setPopularidad(sena.getPopularidad());
        dto.setVecesPracticada(sena.getVecesPracticada());
        dto.setActivo(sena.getActivo());
        return dto;
    }

    private CategoriaSenaDTO convertirCategoriaADTO(CategoriaSena categoria) {
        CategoriaSenaDTO dto = new CategoriaSenaDTO();
        dto.setIdCategoria(categoria.getIdCategoria());
        dto.setNombre(categoria.getNombre());
        dto.setDescripcion(categoria.getDescripcion());
        dto.setIcono(categoria.getIcono());
        dto.setOrden(categoria.getOrden());
        dto.setActivo(categoria.getActivo());
        return dto;
    }
}