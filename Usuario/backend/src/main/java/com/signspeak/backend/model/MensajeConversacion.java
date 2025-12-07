package com.signspeak.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "mensajes_conversacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MensajeConversacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mensaje")
    private Long idMensaje;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_conversacion", nullable = false)
    @JsonBackReference
    private Conversacion conversacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_mensaje", nullable = false, length = 30)
    private TipoMensaje tipoMensaje;

    @Column(name = "contenido_texto", columnDefinition = "TEXT")
    private String contenidoTexto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sena_detectada")
    private DiccionarioSena senaDetectada;

    @Column(name = "confianza_deteccion", precision = 5, scale = 2)
    private BigDecimal confianzaDeteccion;

    @Column(name = "fecha_hora", nullable = false)  // ✅ CAMBIADO el name de la columna
    private LocalDateTime fechaHora;  // ✅ CAMBIADO de "timestamp" a "fechaHora"

    @Column(name = "es_correcto")
    private Boolean esCorrecto = true;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "metadata", columnDefinition = "jsonb")
    private Map<String, Object> metadata;

    @PrePersist
    protected void onCreate() {
        if (fechaHora == null) {  // ✅ CAMBIADO
            fechaHora = LocalDateTime.now();  // ✅ CAMBIADO
        }
    }

    public enum TipoMensaje {
        SENA_DETECTADA,
        TEXTO,
        VOZ,
        TRADUCCION
    }
}