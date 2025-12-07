package com.traductor.service;

import com.traductor.model.HistorialTraduccion;
import com.traductor.repository.HistorialTraduccionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HistorialTraduccionServiceImpl implements HistorialTraduccionService {

    private final HistorialTraduccionRepository repository;

    @Override
    @Transactional
    public HistorialTraduccion guardar(HistorialTraduccion traduccion) {
        return repository.save(traduccion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HistorialTraduccion> listarPorUsuario(Long idUsuario) {
        return repository.findByUsuario_IdUsuarioOrderByTimestampDesc(idUsuario);
    }

    @Override
    @Transactional
    public void eliminarPorUsuario(Long idUsuario) {
        repository.deleteByUsuarioId(idUsuario);
    }
}