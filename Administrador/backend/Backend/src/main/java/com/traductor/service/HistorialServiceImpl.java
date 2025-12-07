package com.traductor.service;

import com.traductor.model.HistorialDeteccion;
import com.traductor.repository.HistorialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HistorialServiceImpl implements HistorialService {

    private final HistorialRepository historialRepository;

    @Override
    @Transactional(readOnly = true)
    public List<HistorialDeteccion> listar(Long idUsuario) {
        return historialRepository.findByUsuario_IdUsuarioOrderByTimestampDesc(idUsuario);
    }

    @Override
    @Transactional
    public HistorialDeteccion guardar(HistorialDeteccion historial) {
        return historialRepository.save(historial);
    }

    @Override
    @Transactional
    public void limpiarHistorialUsuario(Long idUsuario) {
        historialRepository.deleteByUsuarioId(idUsuario);
    }
}