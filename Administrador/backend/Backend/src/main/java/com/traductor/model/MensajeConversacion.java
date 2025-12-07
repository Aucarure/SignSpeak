package com.traductor.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "mensajes_conversacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MensajeConversacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mensaje")
    private Long idMensaje;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_conversacion", nullable = false)
    @JsonIgnore
    private Conversacion conversacion;

    @Column(name = "tipo_mensaje", length = 30, nullable = false)
    private String tipoMensaje; // seña_detectada, texto, voz, traduccion

    @Column(name = "contenido_texto", columnDefinition = "TEXT")
    private String contenidoTexto;

    @Column(name = "seña_detectada")
    private String señaDetectada; // Por ahora String, luego puede ser FK a diccionario

    @Column(name = "confianza_deteccion")
    private Double confianzaDeteccion;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "es_correcto")
    private Boolean esCorrecto;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
        if (esCorrecto == null) {
            esCorrecto = true;
        }
    }
}