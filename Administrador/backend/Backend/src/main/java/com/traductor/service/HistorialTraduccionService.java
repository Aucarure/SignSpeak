package com.traductor.service;

import com.traductor.model.HistorialTraduccion;
import java.util.List;

public interface HistorialTraduccionService {
    HistorialTraduccion guardar(HistorialTraduccion traduccion);
    List<HistorialTraduccion> listarPorUsuario(Long idUsuario);
    void eliminarPorUsuario(Long idUsuario);
}