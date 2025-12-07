package com.signspeak.domain.usecase.diccionario

import com.signspeak.domain.model.Sena
import com.signspeak.domain.repository.DiccionarioRepository
import com.signspeak.util.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

class SearchSenasUseCase @Inject constructor(
    private val repository: DiccionarioRepository
) {
    operator fun invoke(query: String): Flow<Resource<List<Sena>>> = flow {
        // Validación simple: no buscar si el texto está vacío
        if(query.isBlank()) {
            emit(Resource.Success(emptyList()))
            return@flow
        }

        emit(Resource.Loading())
        val result = repository.buscarSenas(query)
        emit(result)
    }
}