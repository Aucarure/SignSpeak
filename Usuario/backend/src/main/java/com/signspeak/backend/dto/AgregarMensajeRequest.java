package com.signspeak.backend.dto;

import com.signspeak.backend.model.MensajeConversacion;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgregarMensajeRequest {

    @NotNull(message = "El tipo de mensaje es obligatorio")
    private MensajeConversacion.TipoMensaje tipoMensaje;

    private String contenidoTexto;

    private Long idSenaDetectada;

    @DecimalMin(value = "0.0", message = "La confianza debe ser mayor o igual a 0")
    @DecimalMax(value = "100.0", message = "La confianza debe ser menor o igual a 100")
    private BigDecimal confianzaDeteccion;

    private Boolean esCorrecto = true;

    private Map<String, Object> metadata;
}