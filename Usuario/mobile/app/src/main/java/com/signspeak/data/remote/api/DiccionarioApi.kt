package com.signspeak.data.remote.api

import com.signspeak.data.remote.dto.diccionario.*
import retrofit2.http.*

interface DiccionarioApi {
    @GET("api/diccionario/categorias")
    suspend fun obtenerCategorias(
        @Query("soloActivas") soloActivas: Boolean = true
    ): ApiResponse<List<CategoriaSenaDTO>>

    @GET("api/diccionario/categorias/{id}")
    suspend fun obtenerCategoriaPorId(
        @Path("id") id: Long
    ): ApiResponse<CategoriaSenaDTO>

    @GET("api/diccionario/senas")
    suspend fun obtenerSenas(
        @Query("pagina") pagina: Int = 0,
        @Query("tamanoPagina") tamanoPagina: Int = 20
    ): ApiResponse<PageResponse<DiccionarioSenaDTO>>

    @GET("api/diccionario/senas/{id}")
    suspend fun obtenerSenaPorId(
        @Path("id") id: Long
    ): ApiResponse<DiccionarioSenaDTO>

    @GET("api/diccionario/senas/nombre/{nombre}")
    suspend fun obtenerSenaPorNombre(
        @Path("nombre") nombre: String
    ): ApiResponse<DiccionarioSenaDTO>

    @GET("api/diccionario/buscar")
    suspend fun buscarSenas(
        @Query("q") query: String,
        @Query("pagina") pagina: Int = 0,
        @Query("tamanoPagina") tamanoPagina: Int = 20
    ): ApiResponse<PageResponse<DiccionarioSenaDTO>>

    @POST("api/diccionario/filtrar")
    suspend fun filtrarSenas(
        @Body filtros: FiltrosDiccionarioRequest
    ): ApiResponse<PageResponse<DiccionarioSenaDTO>>

    @GET("api/diccionario/populares")
    suspend fun obtenerSenasPopulares(
        @Query("limite") limite: Int = 10
    ): ApiResponse<List<DiccionarioSenaDTO>>

    @GET("api/diccionario/mas-practicadas")
    suspend fun obtenerSenasMasPracticadas(
        @Query("limite") limite: Int = 10
    ): ApiResponse<List<DiccionarioSenaDTO>>

    @GET("api/diccionario/estadisticas")
    suspend fun obtenerEstadisticas(): ApiResponse<Map<String, Any?>>
}