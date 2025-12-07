package com.traductor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "usuarios") // ✅ CAMBIO: era "usuario"
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 150, unique = true)
    private String email;

    @Column(name = "contraseña", nullable = false, length = 255) // ✅ CAMBIO: era "passwordHash"
    private String contraseña;

    // ✅ NUEVO: Campo según tu BD
    @Column(name = "tipo_usuario", length = 20)
    private String tipoUsuario; // oyente, sordo, mudo, sordomudo

    // ✅ NUEVO: Campo según tu BD
    @Column(name = "foto_perfil", columnDefinition = "TEXT")
    private String fotoPerfil;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDateTime fechaRegistro;

    @Column(name = "ultimo_acceso")
    private LocalDateTime ultimoAcceso;

    // ✅ NUEVO: Campos según tu BD
    @Column(nullable = false)
    private Boolean activo = true;

    @Column(nullable = false)
    private Boolean eliminado = false;

    @Column(name = "fecha_eliminacion")
    private LocalDateTime fechaEliminacion;

    // Relaciones
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private List<Conversacion> conversaciones;

    @PrePersist
    protected void onCreate() {
        if (fechaRegistro == null) {
            fechaRegistro = LocalDateTime.now();
        }
        if (activo == null) {
            activo = true;
        }
        if (eliminado == null) {
            eliminado = false;
        }
    }
}