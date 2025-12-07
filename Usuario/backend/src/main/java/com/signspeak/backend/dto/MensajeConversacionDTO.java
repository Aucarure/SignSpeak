package com.signspeak.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.signspeak.backend.model.MensajeConversacion;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MensajeConversacionDTO {

    private Long idMensaje;
    private Long idConversacion;
    private MensajeConversacion.TipoMensaje tipoMensaje;
    private String contenidoTexto;
    private Long idSenaDetectada;
    private String palabraSena;
    private String nombreSena;  // ✅ AGREGADO - para setNombreSena()
    private BigDecimal confianzaDeteccion;
    private LocalDateTime timestamp;
    private LocalDateTime fechaHora;  // ✅ AGREGADO - para setFechaHora()
    private Boolean esCorrecto;
    private Map<String, Object> metadata;
}