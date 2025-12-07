package com.traductor.service;

import com.traductor.model.HistorialDeteccion;
import java.util.List;

public interface HistorialDeteccionService {
    HistorialDeteccion guardar(HistorialDeteccion deteccion);
    List<HistorialDeteccion> listarPorUsuario(Long idUsuario);
    void eliminarPorUsuario(Long idUsuario);
}