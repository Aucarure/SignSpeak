package com.signspeak.data.remote.dto.conversacion

import com.google.gson.annotations.SerializedName

data class ConversacionDTO(
    val idConversacion: Long,
    val idUsuario: Long,
    val nombreUsuario: String?,
    val titulo: String?,
    val fechaInicio: String,
    val fechaFin: String?,
    val duracionTotalSegundos: Int?,
    val numMensajes: Int?,
    val guardada: Boolean,
    val eliminada: Boolean,
    @SerializedName("metadata")
    val metadata: Map<String, Any?>? = null,
    val mensajes: List<MensajeConversacionDTO> = emptyList()
)