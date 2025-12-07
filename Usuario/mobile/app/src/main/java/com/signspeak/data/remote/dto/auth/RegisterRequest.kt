package com.signspeak.data.remote.dto.auth

data class RegisterRequest(
    val nombre: String,
    val email: String,
    val password: String
)