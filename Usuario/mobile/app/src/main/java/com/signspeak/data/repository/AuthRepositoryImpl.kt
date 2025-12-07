package com.signspeak.data.repository

import android.util.Log
import com.signspeak.data.local.TokenManager
import com.signspeak.data.mapper.toDomain
import com.signspeak.data.remote.api.AuthApi
import com.signspeak.data.remote.dto.auth.LoginRequest
import com.signspeak.data.remote.dto.auth.RegisterRequest
import com.signspeak.domain.model.Usuario
import com.signspeak.domain.repository.AuthRepository
import com.signspeak.util.Resource
import retrofit2.HttpException
import java.io.IOException
import javax.inject.Inject

class AuthRepositoryImpl @Inject constructor(
    private val api: AuthApi,
    private val tokenManager: TokenManager
) : AuthRepository {

    override suspend fun login(email: String, password: String): Resource<Usuario> {
        return try {
            Log.d("AUTH", "Intentando login para: $email")
            val request = LoginRequest(email, password)
            val response = api.login(request)

            // Si llegamos aquí, Retrofit no lanzó excepción (código 200-299)
            // Guardamos el token
            tokenManager.saveAuthToken(response.token, response.usuario.nombre)
            Log.d("AUTH", "Login exitoso. Token guardado.")

            Resource.Success(response.usuario.toDomain())

        } catch (e: HttpException) {
            Log.e("AUTH", "Error HTTP: ${e.code()}")
            val errorMsg = if (e.code() == 403 || e.code() == 401) {
                "Credenciales incorrectas"
            } else {
                "Error del servidor (${e.code()})"
            }
            Resource.Error(errorMsg)
        } catch (e: IOException) {
            Log.e("AUTH", "Error de red: ${e.message}")
            Resource.Error("No hay conexión a internet")
        } catch (e: Exception) {
            Log.e("AUTH", "Error desconocido: ${e.message}")
            Resource.Error("Ocurrió un error inesperado")
        }
    }

    override suspend fun register(nombre: String, email: String, password: String): Resource<Usuario> {
        return try {
            val request = RegisterRequest(nombre, email, password)
            val response = api.register(request)

            tokenManager.saveAuthToken(response.token, response.usuario.nombre)

            Resource.Success(response.usuario.toDomain())
        } catch (e: Exception) {
            Resource.Error("Error al registrarse: ${e.localizedMessage}")
        }
    }

    override suspend fun logout() {
        try {
            // Opcional: Avisar al backend
            // api.logout()
            tokenManager.clearAuthToken()
        } catch (e: Exception) {
            Log.e("AUTH", "Error en logout", e)
        }
    }
}