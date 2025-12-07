package com.traductor.service;

import com.traductor.model.HistorialDeteccion;

import java.util.List;

public interface HistorialService {
    List<HistorialDeteccion> listar(Long idUsuario);
    HistorialDeteccion guardar(HistorialDeteccion historial);
    void limpiarHistorialUsuario(Long idUsuario);
}