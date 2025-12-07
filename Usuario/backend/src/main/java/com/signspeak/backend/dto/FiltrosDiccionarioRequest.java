package com.signspeak.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FiltrosDiccionarioRequest {
    private String nombre;  // ✅ Cambiado de "palabra" a "nombre"
    private Long idCategoria;
    private String dificultad;  // "FACIL", "MEDIO", "DIFICIL"
    private String ordenar; // "popularidad", "alfabetico", "reciente"
    private Integer pagina;
    private Integer tamanoPagina;
}