package com.signspeak.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "diccionario_senas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiccionarioSena {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sena")
    private Long idSena;

    @Column(name = "nombre", nullable = false, length = 100)  // ✅ CAMBIADO DE "palabra" A "nombre"
    private String palabra;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria")
    private CategoriaSena categoria;

    @Column(name = "url_video", columnDefinition = "TEXT")
    private String urlVideo;

    @Column(name = "url_imagen", columnDefinition = "TEXT")
    private String urlImagen;

    @Column(name = "url_animacion", columnDefinition = "TEXT")
    private String urlAnimacion;

    @Column(name = "duracion_video_segundos")
    private Integer duracionVideoSegundos;

    @Enumerated(EnumType.STRING)
    @Column(name = "dificultad", length = 20)
    private Dificultad dificultad = Dificultad.medio;

    @Column(name = "popularidad")
    private Integer popularidad = 0;

    @Column(name = "veces_practicada")
    private Integer vecesPracticada = 0;

    @Column(name = "activo")
    private Boolean activo = true;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @PrePersist
    protected void onCreate() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
        fechaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }

    public enum Dificultad {
        facil,
        medio,
        dificil
    }
}