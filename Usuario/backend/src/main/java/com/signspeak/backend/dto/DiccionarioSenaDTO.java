package com.signspeak.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiccionarioSenaDTO {
    private Long idSena;
    private String nombre;  // ✅ Cambiado de "palabra" a "nombre"
    private String descripcion;
    private CategoriaSenaDTO categoria;
    private String urlVideo;
    private String urlImagen;
    private String urlAnimacion;
    private Integer duracionVideoSegundos;
    private String dificultad;  // Será "FACIL", "MEDIO", "DIFICIL"
    private Integer popularidad;
    private Integer vecesPracticada;
    private Boolean activo;
}