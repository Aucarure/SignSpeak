package com.signspeak.domain.model

data class Sena(
    val id: Long,
    val nombre: String,
    val descripcion: String,
    val categoriaNombre: String?,
    val urlVideo: String?,
    val urlImagen: String?,
    val dificultad: String,
    val esFavorita: Boolean = false // Campo útil para la UI
)