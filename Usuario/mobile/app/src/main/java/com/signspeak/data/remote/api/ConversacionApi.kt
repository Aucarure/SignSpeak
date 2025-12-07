package com.signspeak.data.remote.api

import com.signspeak.data.remote.dto.conversacion.*
import com.signspeak.data.remote.dto.diccionario.PageResponse
import retrofit2.http.*

interface ConversacionApi {
    @POST("api/conversaciones")
    suspend fun crearConversacion(
        @Body request: CrearConversacionRequest
    ): ConversacionDTO

    @POST("api/conversaciones/{id}/mensajes")
    suspend fun agregarMensaje(
        @Path("id") id: Long,
        @Body request: AgregarMensajeRequest
    ): MensajeConversacionDTO

    @PUT("api/conversaciones/{id}/finalizar")
    suspend fun finalizarConversacion(
        @Path("id") id: Long,
        @Body request: FinalizarConversacionRequest? = null
    ): ConversacionDTO

    @GET("api/conversaciones/{id}")
    suspend fun obtenerConversacion(
        @Path("id") id: Long
    ): ConversacionDTO

    @GET("api/conversaciones/{id}/completa")
    suspend fun obtenerConversacionCompleta(
        @Path("id") id: Long
    ): ConversacionDTO

    @GET("api/conversaciones/usuario/{idUsuario}")
    suspend fun listarConversacionesPorUsuario(
        @Path("idUsuario") idUsuario: Long
    ): List<ConversacionDTO>

    @GET("api/conversaciones/usuario/{idUsuario}/paginado")
    suspend fun listarConversacionesPaginadas(
        @Path("idUsuario") idUsuario: Long,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 10,
        @Query("sortBy") sortBy: String = "fechaInicio",
        @Query("sortDir") sortDir: String = "DESC"
    ): PageResponse<ConversacionDTO>

    @GET("api/conversaciones/usuario/{idUsuario}/guardadas")
    suspend fun listarConversacionesGuardadas(
        @Path("idUsuario") idUsuario: Long
    ): List<ConversacionDTO>

    @GET("api/conversaciones/usuario/{idUsuario}/buscar")
    suspend fun buscarPorRangoFechas(
        @Path("idUsuario") idUsuario: Long,
        @Query("inicio") inicio: String, // LocalDateTime en formato ISO
        @Query("fin") fin: String // LocalDateTime en formato ISO
    ): List<ConversacionDTO>

    @PUT("api/conversaciones/{id}/guardar")
    suspend fun marcarComoGuardada(
        @Path("id") id: Long,
        @Query("guardada") guardada: Boolean
    ): ConversacionDTO

    @DELETE("api/conversaciones/{id}")
    suspend fun eliminarConversacion(
        @Path("id") id: Long
    )

    @GET("api/conversaciones/{id}/mensajes")
    suspend fun obtenerMensajes(
        @Path("id") id: Long
    ): List<MensajeConversacionDTO>

    @GET("api/conversaciones/usuario/{idUsuario}/count")
    suspend fun contarConversacionesActivas(
        @Path("idUsuario") idUsuario: Long
    ): Long
}