package com.traductor.service;

import com.traductor.dto.TraduccionRequest;
import com.traductor.model.Traduccion;

import java.util.List;

public interface TraduccionService {
    String procesarTraduccion(String texto, Long idUsuario);
    String procesarTraduccion(TraduccionRequest request);
    List<Traduccion> obtenerHistorialPorUsuario(Long idUsuario);
}
