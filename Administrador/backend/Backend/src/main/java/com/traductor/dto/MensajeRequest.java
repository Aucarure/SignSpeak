package com.traductor.dto;

import lombok.Data;

@Data
public class MensajeRequest {
    private Long idConversacion;
    private String tipoMensaje; // seña_detectada, texto, voz
    private String contenidoTexto;
    private String señaDetectada;
    private Double confianzaDeteccion;
}