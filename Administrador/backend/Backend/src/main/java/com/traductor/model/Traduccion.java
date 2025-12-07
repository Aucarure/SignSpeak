package com.traductor.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "traduccion")
public class Traduccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTraduccion;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String entrada;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String salida;

    @Column(nullable = false, length = 50)
    private String tipoTraduccion; // Ej: "texto-a-senias", "texto-a-voz", etc.

    @Column(length = 10)
    private String idiomaSenias; // Ej: "LSP", "ASL", etc.

    private String urlVoz;    // opcional, solo si generas audios
    private String urlSenias; // opcional, solo si generas videos

    @Column(nullable = false)
    private LocalDateTime fechaTraduccion = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    // --- Constructores ---
    public Traduccion() {}

    public Traduccion(String entrada, String salida, String tipoTraduccion, Usuario usuario) {
        this.entrada = entrada;
        this.salida = salida;
        this.tipoTraduccion = tipoTraduccion;
        this.usuario = usuario;
    }

    // --- Getters y Setters ---
    public Long getIdTraduccion() { return idTraduccion; }
    public void setIdTraduccion(Long idTraduccion) { this.idTraduccion = idTraduccion; }

    public String getEntrada() { return entrada; }
    public void setEntrada(String entrada) { this.entrada = entrada; }

    public String getSalida() { return salida; }
    public void setSalida(String salida) { this.salida = salida; }

    public String getTipoTraduccion() { return tipoTraduccion; }
    public void setTipoTraduccion(String tipoTraduccion) { this.tipoTraduccion = tipoTraduccion; }

    public String getIdiomaSenias() { return idiomaSenias; }
    public void setIdiomaSenias(String idiomaSenias) { this.idiomaSenias = idiomaSenias; }

    public String getUrlVoz() { return urlVoz; }
    public void setUrlVoz(String urlVoz) { this.urlVoz = urlVoz; }

    public String getUrlSenias() { return urlSenias; }
    public void setUrlSenias(String urlSenias) { this.urlSenias = urlSenias; }

    public LocalDateTime getFechaTraduccion() { return fechaTraduccion; }
    public void setFechaTraduccion(LocalDateTime fechaTraduccion) { this.fechaTraduccion = fechaTraduccion; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}
