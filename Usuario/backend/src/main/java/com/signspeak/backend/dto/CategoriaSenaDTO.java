package com.signspeak.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaSenaDTO {
    private Long idCategoria;
    private String nombre;
    private String descripcion;
    private String icono;
    private Integer orden;
    private Boolean activo;
}