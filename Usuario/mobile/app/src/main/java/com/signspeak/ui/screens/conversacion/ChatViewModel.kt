package com.signspeak.ui.screens.conversacion

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.signspeak.domain.model.Mensaje
import com.signspeak.domain.repository.ConversacionRepository
import com.signspeak.domain.usecase.conversacion.SendMessageUseCase
import com.signspeak.util.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

// Definimos el estado completo que pide tu pantalla
data class ChatUiState(
    val isLoading: Boolean = false,
    val mensajes: List<Mensaje> = emptyList(),
    val textoInput: String = "",
    val isTranslating: Boolean = false, // Para cuando envías o usas cámara
    val esGuardada: Boolean = false,
    val tituloConversacion: String? = "Conversación"
)

@HiltViewModel
class ChatViewModel @Inject constructor(
    private val sendMessageUseCase: SendMessageUseCase,
    private val repository: ConversacionRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ChatUiState())
    val uiState: StateFlow<ChatUiState> = _uiState.asStateFlow()

    private var currentConversacionId: Long = 0

    fun cargarConversacion(id: Long) {
        currentConversacionId = id
        // Aquí llamarías al caso de uso GetConversacionUseCase
        // Por ahora simulamos carga o usamos repositorio directo
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            val result = repository.obtenerConversacionCompleta(id)

            when(result) {
                is Resource.Success -> {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            mensajes = result.data?.mensajes ?: emptyList(),
                            tituloConversacion = result.data?.titulo
                        )
                    }
                }
                is Resource.Error -> {
                    _uiState.update { it.copy(isLoading = false) }
                }
                else -> {}
            }
        }
    }

    fun onTextoInputChanged(texto: String) {
        _uiState.update { it.copy(textoInput = texto) }
    }

    fun enviarMensaje() {
        val texto = _uiState.value.textoInput
        if (texto.isBlank()) return

        // Limpiar input y mostrar estado de "Traduciendo..."
        _uiState.update { it.copy(textoInput = "", isTranslating = true) }

        // Agregar mensaje localmente (UI Optimista)
        val mensajeLocal = Mensaje(0, true, texto, null, "TEXTO", getHoraActualISO())
        agregarMensajeALista(mensajeLocal)

        viewModelScope.launch {
            sendMessageUseCase(currentConversacionId, texto).collect { result ->
                when(result) {
                    is Resource.Success -> {
                        _uiState.update { it.copy(isTranslating = false) }
                        // Si el backend responde algo (ej: traducción), lo agregamos
                        result.data?.let { msg -> if (!msg.esMio) agregarMensajeALista(msg) }
                    }
                    is Resource.Error -> {
                        _uiState.update { it.copy(isTranslating = false) }
                    }
                    else -> {}
                }
            }
        }
    }

    fun iniciarCaptura() {
        // Lógica futura para abrir cámara
        // Por ahora solo simulamos que traduce algo
        viewModelScope.launch {
            _uiState.update { it.copy(isTranslating = true) }
            // Simulación...
        }
    }

    fun toggleGuardarConversacion() {
        _uiState.update { it.copy(esGuardada = !it.esGuardada) }
        // Aquí llamarías al endpoint de guardar
    }

    private fun agregarMensajeALista(mensaje: Mensaje) {
        val listaActual = _uiState.value.mensajes.toMutableList()
        listaActual.add(mensaje)
        _uiState.update { it.copy(mensajes = listaActual) }
    }

    // Helper simple para la fecha
    private fun getHoraActualISO(): String = "2024-01-01T12:00:00"
}