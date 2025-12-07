package com.signspeak.ui.screens.ajustes

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.signspeak.data.local.SettingsManager
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class AjustesUiState(
    val modoOscuro: Boolean = false,
    val altoContraste: Boolean = false,
    val tamanoFuente: Float = 1.0f
)

@HiltViewModel
class AjustesViewModel @Inject constructor(
    private val settingsManager: SettingsManager
) : ViewModel() {

    private val _uiState = MutableStateFlow(AjustesUiState())
    val uiState: StateFlow<AjustesUiState> = _uiState.asStateFlow()

    init {
        // Observamos los cambios en la base de datos local
        viewModelScope.launch {
            settingsManager.settings.collectLatest { settings ->
                _uiState.update {
                    it.copy(
                        modoOscuro = settings.isDarkMode,
                        tamanoFuente = settings.fontSizeScale
                    )
                }
            }
        }
    }

    fun toggleModoOscuro() {
        viewModelScope.launch {
            // Guardamos el valor inverso al actual
            settingsManager.setDarkMode(!_uiState.value.modoOscuro)
        }
    }

    fun toggleAltoContraste() {
        // Este lo dejamos solo en memoria local por ahora (o podrías agregarlo a SettingsManager)
        _uiState.update { it.copy(altoContraste = !it.altoContraste) }
    }

    fun setTamanoFuente(nuevoValor: Float) {
        viewModelScope.launch {
            settingsManager.setFontSize(nuevoValor)
        }
    }
}