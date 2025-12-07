package com.signspeak.domain.repository

import com.signspeak.domain.model.Usuario
import com.signspeak.util.Resource

interface AuthRepository {
    suspend fun login(email: String, password: String): Resource<Usuario>
    suspend fun register(nombre: String, email: String, password: String): Resource<Usuario>
    suspend fun logout()
}
