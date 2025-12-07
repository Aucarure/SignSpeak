package com.signspeak.data.mapper

import com.signspeak.data.remote.dto.auth.UsuarioDTO
import com.signspeak.data.remote.dto.conversacion.ConversacionDTO
import com.signspeak.data.remote.dto.conversacion.MensajeConversacionDTO
import com.signspeak.data.remote.dto.conversacion.TipoMensaje
import com.signspeak.data.remote.dto.diccionario.CategoriaSenaDTO
import com.signspeak.data.remote.dto.diccionario.DiccionarioSenaDTO
import com.signspeak.domain.model.Categoria
import com.signspeak.domain.model.Conversacion
import com.signspeak.domain.model.Mensaje
import com.signspeak.domain.model.Sena
import com.signspeak.domain.model.Usuario

// --- Auth Mappers ---
fun UsuarioDTO.toDomain(): Usuario {
    return Usuario(
        id = idUsuario,
        nombre = nombre,
        email = email
    )
}

// --- Diccionario Mappers ---
fun CategoriaSenaDTO.toDomain(): Categoria {
    return Categoria(
        id = idCategoria,
        nombre = nombre,
        descripcion = descripcion ?: "",
        iconoUrl = icono,
        activa = activo
    )
}

fun DiccionarioSenaDTO.toDomain(): Sena {
    return Sena(
        id = idSena,
        nombre = nombre,
        descripcion = descripcion ?: "Sin descripción",
        categoriaNombre = categoria?.nombre,
        urlVideo = urlVideo,
        urlImagen = urlImagen,
        dificultad = dificultad ?: "FACIL",
        esFavorita = false // Por defecto, luego esto vendría de base de datos local
    )
}

// --- Conversacion Mappers ---
fun ConversacionDTO.toDomain(): Conversacion {
    return Conversacion(
        id = idConversacion,
        titulo = titulo ?: "Conversación sin título",
        fechaInicio = fechaInicio,
        ultimoMensaje = mensajes.lastOrNull()?.contenidoTexto ?: "Sin mensajes",
        mensajes = mensajes.map { it.toDomain() }
    )
}

fun MensajeConversacionDTO.toDomain(): Mensaje {
    return Mensaje(
        id = idMensaje,
        esMio = tipoMensaje == TipoMensaje.TEXTO_USUARIO, // Asumimos que si es texto usuario, es mío
        texto = contenidoTexto,
        imagenSenaUrl = null, // Aquí podrías mapear la URL si viniera en el DTO
        tipo = tipoMensaje.name,
        fecha = timestamp ?: ""
    )
}