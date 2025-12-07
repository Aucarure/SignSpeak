package com.signspeak.data.remote.dto.conversacion

import com.google.gson.annotations.SerializedName

data class CrearConversacionRequest(
    val idUsuario: Long,
    val tituloConversacion: String? = null,
    @SerializedName("metadata")
    val metadata: Map<String, Any?>? = null
)