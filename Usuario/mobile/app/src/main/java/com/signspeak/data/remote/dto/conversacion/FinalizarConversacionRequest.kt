package com.signspeak.data.remote.dto.conversacion

data class FinalizarConversacionRequest(
    val guardar: Boolean = false,
    val resumenConversacion: String? = null
)
