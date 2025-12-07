package com.signspeak.data.remote.dto.auth

data class AuthResponse(
    val token: String,
    val usuario: UsuarioDTO
)

data class UsuarioDTO(
    val idUsuario: Long,
    val nombre: String,
    val email: String
)
