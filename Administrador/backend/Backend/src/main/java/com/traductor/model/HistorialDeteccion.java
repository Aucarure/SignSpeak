package com.traductor.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "historial_detecciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistorialDeteccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_deteccion")
    private Long idDeteccion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "id_seña_detectada")
    private Long idSeñaDetectada; // Por ahora Long, luego FK a diccionario

    @Column(nullable = false)
    private Double confianza; // 0-100

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(length = 50, nullable = false)
    private String contexto; // ejercicio, conversacion, practica_libre, tutorial

    @Column(name = "id_contexto")
    private Long idContexto; // ID del ejercicio o conversación

    @Column(name = "duracion_ms")
    private Integer duracionMs;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}