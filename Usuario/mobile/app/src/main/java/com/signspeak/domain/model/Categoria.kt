package com.signspeak.domain.model

data class Categoria(
    val id: Long,
    val nombre: String,
    val descripcion: String,
    val iconoUrl: String?,
    val activa: Boolean
)