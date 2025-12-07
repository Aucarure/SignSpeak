package com.traductor.repository;

import com.traductor.model.HistorialTraduccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistorialTraduccionRepository extends JpaRepository<HistorialTraduccion, Long> {

    List<HistorialTraduccion> findByUsuario_IdUsuarioOrderByTimestampDesc(Long idUsuario);

    @Modifying
    @Query("DELETE FROM HistorialTraduccion h WHERE h.usuario.idUsuario = :idUsuario")
    void deleteByUsuarioId(@Param("idUsuario") Long idUsuario);
}