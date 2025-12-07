package com.signspeak.data.remote.dto.diccionario

data class CategoriaSenaDTO(
    val idCategoria: Long,
    val nombre: String,
    val descripcion: String?,
    val icono: String?,
    val orden: Int?,
    val activo: Boolean
)
