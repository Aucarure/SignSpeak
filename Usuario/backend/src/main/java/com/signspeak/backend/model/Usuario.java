package com.signspeak.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "contrasena", nullable = true, length = 255)  // ✅ CAMBIADO a nullable = true temporalmente
    private String contrasena;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_usuario", nullable = false, length = 20)
    private TipoUsuario tipoUsuario;

    @Column(name = "foto_perfil", columnDefinition = "TEXT")
    private String fotoPerfil;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @Column(name = "ultimo_acceso")
    private LocalDateTime ultimoAcceso;

    @Column(name = "activo")
    private Boolean activo = true;

    @Column(name = "eliminado")
    private Boolean eliminado = false;

    @Column(name = "fecha_eliminacion")
    private LocalDateTime fechaEliminacion;

    @PrePersist
    protected void onCreate() {
        if (fechaRegistro == null) {
            fechaRegistro = LocalDateTime.now();
        }
    }

    public enum TipoUsuario {
        oyente,    // ← en minúsculas
        sordo,     // ← en minúsculas
        mudo,      // ← en minúsculas
        sordomudo; // ← en minúsculas

        // Opcional: método para obtener el valor legible
        public String getValor() {
            return this.name();
        }
    }
}