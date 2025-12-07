package com.signspeak.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ConversacionDTO {

    private Long idConversacion;
    private Long idUsuario;
    private String nombreUsuario;
    private String titulo;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private Integer duracionTotalSegundos;
    private Integer numMensajes;
    private Boolean guardada;
    private Boolean eliminada;
    private Map<String, Object> metadata;
    private List<MensajeConversacionDTO> mensajes = new ArrayList<>();
}