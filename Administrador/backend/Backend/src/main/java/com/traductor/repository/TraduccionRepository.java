package com.traductor.repository;

import com.traductor.model.Traduccion;
import com.traductor.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TraduccionRepository extends JpaRepository<Traduccion, Long> {
    List<Traduccion> findByUsuario_IdUsuarioOrderByFechaTraduccionDesc(Long idUsuario);
}
