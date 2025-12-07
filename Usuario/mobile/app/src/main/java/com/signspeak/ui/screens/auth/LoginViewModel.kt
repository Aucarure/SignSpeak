package com.signspeak.ui.screens.auth

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.signspeak.domain.usecase.auth.LoginUseCase
import com.signspeak.util.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val loginUseCase: LoginUseCase
) : ViewModel() {

    // Estado del formulario
    var email by mutableStateOf("")
    var password by mutableStateOf("")
    var isLoading by mutableStateOf(false)

    // Canal para eventos de una sola vez (Navegación, Toast de error)
    private val _uiEvent = Channel<LoginUiEvent>()
    val uiEvent = _uiEvent.receiveAsFlow()

    fun onLoginClick() {
        if (email.isBlank() || password.isBlank()) {
            sendEvent(LoginUiEvent.ShowError("Por favor completa todos los campos"))
            return
        }

        viewModelScope.launch {
            loginUseCase(email, password).collect { result ->
                when(result) {
                    is Resource.Loading -> {
                        isLoading = true
                    }
                    is Resource.Success -> {
                        isLoading = false
                        sendEvent(LoginUiEvent.NavigateToHome)
                    }
                    is Resource.Error -> {
                        isLoading = false
                        sendEvent(LoginUiEvent.ShowError(result.message ?: "Error desconocido"))
                    }
                }
            }
        }
    }

    private fun sendEvent(event: LoginUiEvent) {
        viewModelScope.launch {
            _uiEvent.send(event)
        }
    }
}

sealed class LoginUiEvent {
    object NavigateToHome : LoginUiEvent()
    data class ShowError(val message: String) : LoginUiEvent()
}