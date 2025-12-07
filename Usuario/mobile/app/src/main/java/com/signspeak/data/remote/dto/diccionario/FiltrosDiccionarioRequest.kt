package com.signspeak.data.remote.dto.diccionario

data class FiltrosDiccionarioRequest(
    val nombre: String? = null,
    val idCategoria: Long? = null,
    val dificultad: String? = null, // "FACIL", "MEDIO", "DIFICIL"
    val ordenar: String? = null, // "popularidad", "alfabetico", "reciente"
    val pagina: Int = 0,
    val tamanoPagina: Int = 20
)
