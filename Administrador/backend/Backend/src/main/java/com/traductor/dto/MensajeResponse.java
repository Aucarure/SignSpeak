package com.traductor.dto;

import com.traductor.model.MensajeConversacion;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class MensajeResponse {
    private Long idMensaje;
    private String tipoMensaje;
    private String contenidoTexto;
    private String señaDetectada;
    private Double confianzaDeteccion;
    private LocalDateTime timestamp;
    private Boolean esCorrecto;

    public static MensajeResponse fromEntity(MensajeConversacion mensaje) {
        return new MensajeResponse(
                mensaje.getIdMensaje(),
                mensaje.getTipoMensaje(),
                mensaje.getContenidoTexto(),
                mensaje.getSeñaDetectada(),
                mensaje.getConfianzaDeteccion(),
                mensaje.getTimestamp(),
                mensaje.getEsCorrecto()
        );
    }
}