package com.signspeak.domain.usecase.conversacion

import com.signspeak.domain.model.Mensaje
import com.signspeak.domain.repository.ConversacionRepository
import com.signspeak.util.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

class SendMessageUseCase @Inject constructor(
    private val repository: ConversacionRepository
) {
    operator fun invoke(idConversacion: Long, texto: String): Flow<Resource<Mensaje>> = flow {
        emit(Resource.Loading())
        val result = repository.enviarMensaje(idConversacion, texto)
        emit(result)
    }
}