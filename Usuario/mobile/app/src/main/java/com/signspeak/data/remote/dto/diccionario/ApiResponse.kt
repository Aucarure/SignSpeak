package com.signspeak.data.remote.dto.diccionario

data class ApiResponse<T>(
    val success: Boolean,
    val message: String,
    val data: T?,
    val timestamp: String // LocalDateTime en formato ISO string del backend
)
