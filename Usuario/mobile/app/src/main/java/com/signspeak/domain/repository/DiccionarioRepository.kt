package com.signspeak.domain.repository

import com.signspeak.domain.model.Categoria
import com.signspeak.domain.model.Sena
import com.signspeak.util.Resource

interface DiccionarioRepository {
    suspend fun obtenerCategorias(): Resource<List<Categoria>>
    suspend fun obtenerSenas(pagina: Int): Resource<List<Sena>>
    suspend fun buscarSenas(query: String): Resource<List<Sena>>
    suspend fun obtenerSenaPorId(id: Long): Resource<Sena>
}