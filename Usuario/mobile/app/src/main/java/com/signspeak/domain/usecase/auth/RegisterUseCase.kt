package com.signspeak.domain.usecase.auth

import com.signspeak.domain.model.Usuario
import com.signspeak.domain.repository.AuthRepository
import com.signspeak.util.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

class RegisterUseCase @Inject constructor(
    private val repository: AuthRepository
) {
    operator fun invoke(nombre: String, email: String, password: String): Flow<Resource<Usuario>> = flow {
        emit(Resource.Loading())
        val result = repository.register(nombre, email, password)
        emit(result)
    }
}