package com.signspeak.data.repository

import android.util.Log
import com.signspeak.data.mapper.toDomain
import com.signspeak.data.remote.api.DiccionarioApi
import com.signspeak.domain.model.Categoria
import com.signspeak.domain.model.Sena
import com.signspeak.domain.repository.DiccionarioRepository
import com.signspeak.util.Resource
import javax.inject.Inject

class DiccionarioRepositoryImpl @Inject constructor(
    private val api: DiccionarioApi
) : DiccionarioRepository {

    override suspend fun obtenerSenas(pagina: Int): Resource<List<Sena>> {
        return try {
            Log.d("API_TEST", "Intentando pedir señas...") // Log de inicio

            val response = api.obtenerSenas(pagina = pagina)

            Log.d("API_TEST", "Respuesta recibida: ${response.success}") // Log de éxito conexión

            if (response.success && response.data != null) {
                val senas = response.data.content.map { it.toDomain() }
                Log.d("API_TEST", "Señas mapeadas: ${senas.size}") // Log de cantidad
                Resource.Success(senas)
            } else {
                Log.e("API_TEST", "Error backend: ${response.message}")
                Resource.Error(response.message)
            }
        } catch (e: Exception) {
            Log.e("API_TEST", "EXCEPCIÓN CRÍTICA: ${e.message}")
            e.printStackTrace()
            Resource.Error("Error: ${e.message}")
        }
    }

    override suspend fun obtenerCategorias(): Resource<List<Categoria>> {
        return try {
            val response = api.obtenerCategorias()
            if (response.success && response.data != null) {
                Resource.Success(response.data.map { it.toDomain() })
            } else {
                Resource.Error(response.message)
            }
        } catch (e: Exception) {
            Log.e("API_TEST", "Error Categorias: ${e.message}")
            Resource.Error("Error")
        }
    }

    override suspend fun buscarSenas(query: String): Resource<List<Sena>> { return Resource.Success(emptyList()) } // Simplificado para el ejemplo
    override suspend fun obtenerSenaPorId(id: Long): Resource<Sena> { throw Exception("No impl") }
}
