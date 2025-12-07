package com.signspeak.domain.usecase.diccionario

import com.signspeak.domain.model.Sena
import com.signspeak.domain.repository.DiccionarioRepository
import com.signspeak.util.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

class GetSenasUseCase @Inject constructor(
    private val repository: DiccionarioRepository
) {
    operator fun invoke(pagina: Int = 0): Flow<Resource<List<Sena>>> = flow {
        emit(Resource.Loading())
        val result = repository.obtenerSenas(pagina)
        emit(result)
    }
}