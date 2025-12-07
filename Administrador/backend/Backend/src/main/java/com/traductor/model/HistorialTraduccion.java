package com.traductor.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "historial_traducciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistorialTraduccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_traduccion")
    private Long idTraduccion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "tipo_entrada", length = 20, nullable = false)
    private String tipoEntrada; // voz, texto

    @Column(name = "texto_original", columnDefinition = "TEXT", nullable = false)
    private String textoOriginal;

    @Column(name = "texto_traducido", columnDefinition = "TEXT")
    private String textoTraducido;

    @Column(name = "señas_generadas", columnDefinition = "jsonb")
    private String señasGeneradas; // JSON como String

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "duracion_segundos")
    private Integer duracionSegundos;

    @Column(name = "idioma_origen", length = 10)
    private String idiomaOrigen = "es";

    @Column(nullable = false)
    private Boolean exitoso = true;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}