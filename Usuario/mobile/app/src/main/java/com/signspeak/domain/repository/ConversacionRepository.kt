package com.signspeak.domain.repository

import com.signspeak.domain.model.Conversacion
import com.signspeak.domain.model.Mensaje
import com.signspeak.util.Resource

interface ConversacionRepository {
    // Crear una nueva charla
    suspend fun crearConversacion(idUsuario: Long): Resource<Conversacion>

    // Enviar un mensaje (texto o seña)
    suspend fun enviarMensaje(idConversacion: Long, texto: String): Resource<Mensaje>

    // Obtener el historial de chats del usuario
    suspend fun listarConversaciones(idUsuario: Long): Resource<List<Conversacion>>

    // Obtener el detalle completo de un chat (mensajes)
    suspend fun obtenerConversacionCompleta(idConversacion: Long): Resource<Conversacion>
}