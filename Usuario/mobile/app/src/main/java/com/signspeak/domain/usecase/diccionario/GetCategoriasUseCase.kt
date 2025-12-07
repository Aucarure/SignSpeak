package com.signspeak.domain.usecase.diccionario

import com.signspeak.domain.model.Categoria
import com.signspeak.domain.repository.DiccionarioRepository
import com.signspeak.util.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

class GetCategoriasUseCase @Inject constructor(
    private val repository: DiccionarioRepository
) {
    operator fun invoke(): Flow<Resource<List<Categoria>>> = flow {
        emit(Resource.Loading())
        val result = repository.obtenerCategorias()
        emit(result)
    }
}