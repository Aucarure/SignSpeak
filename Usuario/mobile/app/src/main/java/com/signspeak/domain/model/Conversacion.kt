package com.signspeak.domain.model

data class Conversacion(
    val id: Long,
    val titulo: String,
    val fechaInicio: String, // Podríamos usar LocalDateTime aquí luego
    val ultimoMensaje: String?,
    val mensajes: List<Mensaje> = emptyList()
)