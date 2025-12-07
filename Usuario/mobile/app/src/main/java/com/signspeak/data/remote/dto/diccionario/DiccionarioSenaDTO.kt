package com.signspeak.data.remote.dto.diccionario

data class DiccionarioSenaDTO(
    val idSena: Long,
    val nombre: String,
    val descripcion: String?,
    val categoria: CategoriaSenaDTO?,
    val urlVideo: String?,
    val urlImagen: String?,
    val urlAnimacion: String?,
    val duracionVideoSegundos: Int?,
    val dificultad: String?, // "FACIL", "MEDIO", "DIFICIL"
    val popularidad: Int?,
    val vecesPracticada: Int?,
    val activo: Boolean
)
