package com.signspeak.domain.usecase.auth

import com.signspeak.domain.model.Usuario
import com.signspeak.domain.repository.AuthRepository
import com.signspeak.util.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

class LoginUseCase @Inject constructor(
    private val repository: AuthRepository
) {
    // Sobrecargamos el operador invoke para llamar a la clase como si fuera una función
    operator fun invoke(email: String, password: String): Flow<Resource<Usuario>> = flow {
        emit(Resource.Loading()) // 1. Emitimos estado de carga
        val result = repository.login(email, password) // 2. Llamamos a la API
        emit(result) // 3. Emitimos el resultado (Éxito o Error)
    }
}