package com.signspeak.domain.model

data class Mensaje(
    val id: Long,
    val esMio: Boolean,
    val texto: String?,       // Puede ser nulo si es solo una seña sin traducción
    val imagenSenaUrl: String?,
    val tipo: String,         // "TEXTO", "SENA_DETECTADA", "SISTEMA"
    val fecha: String,        // String ISO directo del backend

    // Nuevos campos para la UI avanzada
    val nombreSena: String? = null,
    val confianza: Double? = null // Usamos Double para facilitar el %
)