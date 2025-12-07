package com.signspeak.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearConversacionRequest {

    @NotNull(message = "El ID de usuario es obligatorio")
    private Long idUsuario;

    @Size(max = 200, message = "El título no puede superar los 200 caracteres")
    private String tituloConversacion;  // ✅ CAMBIADO de "titulo" a "tituloConversacion"

    private Map<String, Object> metadata;
}