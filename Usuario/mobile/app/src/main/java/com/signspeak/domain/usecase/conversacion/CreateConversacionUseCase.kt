package com.signspeak.domain.usecase.conversacion

import com.signspeak.domain.model.Conversacion
import com.signspeak.domain.repository.ConversacionRepository
import com.signspeak.util.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

class CreateConversacionUseCase @Inject constructor(
    private val repository: ConversacionRepository
) {
    operator fun invoke(idUsuario: Long): Flow<Resource<Conversacion>> = flow {
        emit(Resource.Loading())
        val result = repository.crearConversacion(idUsuario)
        emit(result)
    }
}