package com.signspeak.data.remote.dto.conversacion

import com.google.gson.annotations.SerializedName
import java.math.BigDecimal

data class AgregarMensajeRequest(
    val tipoMensaje: TipoMensaje,
    val contenidoTexto: String? = null,
    val idSenaDetectada: Long? = null,
    val confianzaDeteccion: BigDecimal? = null,
    val esCorrecto: Boolean = true,
    @SerializedName("metadata")
    val metadata: Map<String, Any?>? = null
)