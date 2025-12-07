package com.traductor.dto;

import com.traductor.model.Conversacion;
import com.traductor.model.MensajeConversacion;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
public class ConversacionResponse {
    private Long idConversacion;
    private String titulo;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private Integer duracionTotalSegundos;
    private Integer numMensajes;
    private Boolean guardada;
    private List<MensajeResponse> mensajes;

    // Constructor desde entidad
    public static ConversacionResponse fromEntity(Conversacion conversacion) {
        List<MensajeResponse> mensajesDto = conversacion.getMensajes().stream()
                .map(MensajeResponse::fromEntity)
                .collect(Collectors.toList());

        return new ConversacionResponse(
                conversacion.getIdConversacion(),
                conversacion.getTitulo(),
                conversacion.getFechaInicio(),
                conversacion.getFechaFin(),
                conversacion.getDuracionTotalSegundos(),
                conversacion.getNumMensajes(),
                conversacion.getGuardada(),
                mensajesDto
        );
    }
}