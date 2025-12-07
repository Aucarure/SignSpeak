package com.traductor.service;

import com.traductor.model.HistorialDeteccion;
import com.traductor.repository.HistorialDeteccionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HistorialDeteccionServiceImpl implements HistorialDeteccionService {

    private final HistorialDeteccionRepository repository;

    @Override
    @Transactional
    public HistorialDeteccion guardar(HistorialDeteccion deteccion) {
        return repository.save(deteccion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HistorialDeteccion> listarPorUsuario(Long idUsuario) {
        return repository.findByUsuario_IdUsuarioOrderByTimestampDesc(idUsuario);
    }

    @Override
    @Transactional
    public void eliminarPorUsuario(Long idUsuario) {
        repository.deleteByUsuarioId(idUsuario);
    }
}