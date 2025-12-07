package com.signspeak.data.remote.dto.conversacion

import com.google.gson.annotations.SerializedName
import java.math.BigDecimal

data class MensajeConversacionDTO(
    val idMensaje: Long,
    val idConversacion: Long,
    val tipoMensaje: TipoMensaje,
    val contenidoTexto: String?,
    val idSenaDetectada: Long?,
    val palabraSena: String?,
    val nombreSena: String?,
    val confianzaDeteccion: BigDecimal?,
    val timestamp: String?,
    val fechaHora: String?,
    val esCorrecto: Boolean?,
    @SerializedName("metadata")
    val metadata: Map<String, Any?>? = null
)

enum class TipoMensaje {
    @SerializedName("TEXTO_USUARIO")
    TEXTO_USUARIO,

    @SerializedName("SENA_DETECTADA")
    SENA_DETECTADA,

    @SerializedName("TRADUCCION_A_TEXTO")
    TRADUCCION_A_TEXTO,

    @SerializedName("SISTEMA")
    SISTEMA,

    @SerializedName("ERROR")
    ERROR
}