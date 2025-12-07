package com.signspeak.data.repository

import android.util.Log
import com.signspeak.data.mapper.toDomain
import com.signspeak.data.remote.api.ConversacionApi
import com.signspeak.data.remote.dto.conversacion.AgregarMensajeRequest
import com.signspeak.data.remote.dto.conversacion.CrearConversacionRequest
import com.signspeak.data.remote.dto.conversacion.TipoMensaje
import com.signspeak.domain.model.Conversacion
import com.signspeak.domain.model.Mensaje
import com.signspeak.domain.repository.ConversacionRepository
import com.signspeak.util.Resource
import javax.inject.Inject

class ConversacionRepositoryImpl @Inject constructor(
    private val api: ConversacionApi
) : ConversacionRepository {

    override suspend fun crearConversacion(idUsuario: Long): Resource<Conversacion> {
        return try {
            val request = CrearConversacionRequest(idUsuario = idUsuario, tituloConversacion = "Nueva Charla")
            val response = api.crearConversacion(request)
            Resource.Success(response.toDomain())
        } catch (e: Exception) {
            Log.e("CHAT_REPO", "Error al crear: ${e.message}")
            Resource.Error("Error al iniciar chat")
        }
    }

    override suspend fun enviarMensaje(idConversacion: Long, texto: String): Resource<Mensaje> {
        return try {
            // Mapeamos el texto a tu Request del Backend
            val request = AgregarMensajeRequest(
                tipoMensaje = TipoMensaje.TEXTO_USUARIO,
                contenidoTexto = texto,
                esCorrecto = true
            )
            val response = api.agregarMensaje(id = idConversacion, request = request)
            Resource.Success(response.toDomain())
        } catch (e: Exception) {
            Log.e("CHAT_REPO", "Error al enviar: ${e.message}")
            Resource.Error("No se pudo enviar el mensaje")
        }
    }

    override suspend fun listarConversaciones(idUsuario: Long): Resource<List<Conversacion>> {
        return try {
            val response = api.listarConversacionesPorUsuario(idUsuario)
            val dominio = response.map { it.toDomain() }
            Resource.Success(dominio)
        } catch (e: Exception) {
            Resource.Error("Error al cargar historial")
        }
    }

    override suspend fun obtenerConversacionCompleta(idConversacion: Long): Resource<Conversacion> {
        return try {
            val response = api.obtenerConversacionCompleta(idConversacion)
            Resource.Success(response.toDomain())
        } catch (e: Exception) {
            Resource.Error("Error al cargar chat")
        }
    }
}