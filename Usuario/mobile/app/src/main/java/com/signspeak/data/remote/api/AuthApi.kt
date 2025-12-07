package com.signspeak.data.remote.api

import com.signspeak.data.remote.dto.auth.*
import retrofit2.http.*

interface AuthApi {
    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): AuthResponse

    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): AuthResponse

    @POST("api/auth/logout")
    suspend fun logout()

    @GET("api/auth/validate")
    suspend fun validateToken()
}