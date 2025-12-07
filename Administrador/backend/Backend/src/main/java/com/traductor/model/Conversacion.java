package com.traductor.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "conversaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conversacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_conversacion")
    private Long idConversacion;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonIgnore
    private Usuario usuario;

    @Column(length = 200)
    private String titulo;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    @Column(name = "duracion_total_segundos")
    private Integer duracionTotalSegundos;

    @Column(name = "num_mensajes")
    private Integer numMensajes;

    @Column(nullable = false)
    private Boolean guardada;

    @Column(nullable = false)
    private Boolean eliminada;

    @OneToMany(mappedBy = "conversacion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MensajeConversacion> mensajes = new ArrayList<>();

    // Constructor personalizado para crear nueva conversación
    public Conversacion(Usuario usuario, String titulo) {
        this.usuario = usuario;
        this.titulo = titulo;
        this.fechaInicio = LocalDateTime.now();
        this.numMensajes = 0;
        this.duracionTotalSegundos = 0;
        this.guardada = false;
        this.eliminada = false;
        this.mensajes = new ArrayList<>();
    }

    // Método helper para agregar mensaje
    public void agregarMensaje(MensajeConversacion mensaje) {
        mensajes.add(mensaje);
        mensaje.setConversacion(this);
        this.numMensajes = mensajes.size();
    }

    // Método para finalizar conversación
    public void finalizar() {
        this.fechaFin = LocalDateTime.now();
        if (this.fechaInicio != null) {
            long segundos = java.time.Duration.between(this.fechaInicio, this.fechaFin).getSeconds();
            this.duracionTotalSegundos = (int) segundos;
        }
    }
}