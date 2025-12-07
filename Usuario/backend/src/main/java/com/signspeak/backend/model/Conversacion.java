package com.signspeak.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "conversaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Conversacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_conversacion")
    private Long idConversacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "titulo", length = 200)
    private String titulo;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    @Column(name = "duracion_total_segundos")
    private Integer duracionTotalSegundos = 0;

    @Column(name = "num_mensajes")
    private Integer numMensajes = 0;

    @Column(name = "guardada")
    private Boolean guardada = false;

    @Column(name = "eliminada")
    private Boolean eliminada = false;

    // Cambiar la anotación para compatibilidad
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "metadata", columnDefinition = "jsonb")
    private Map<String, Object> metadata;

    @OneToMany(mappedBy = "conversacion", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<MensajeConversacion> mensajes = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (fechaInicio == null) {
            fechaInicio = LocalDateTime.now();
        }
    }

    public void agregarMensaje(MensajeConversacion mensaje) {
        mensajes.add(mensaje);
        mensaje.setConversacion(this);
        this.numMensajes = mensajes.size();
    }

    public void calcularDuracion() {
        if (fechaInicio != null && fechaFin != null) {
            this.duracionTotalSegundos = (int) java.time.Duration.between(fechaInicio, fechaFin).getSeconds();
        }
    }
}