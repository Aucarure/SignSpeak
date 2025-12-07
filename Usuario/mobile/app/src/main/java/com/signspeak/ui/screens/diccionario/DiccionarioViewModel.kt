package com.signspeak.ui.screens.diccionario

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.signspeak.domain.model.Categoria
import com.signspeak.domain.model.Sena
import com.signspeak.domain.usecase.diccionario.GetCategoriasUseCase
import com.signspeak.domain.usecase.diccionario.GetSenasUseCase
import com.signspeak.domain.usecase.diccionario.SearchSenasUseCase
import com.signspeak.util.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class DiccionarioUiState(
    val isLoading: Boolean = false,
    val senas: List<Sena> = emptyList(),
    val categorias: List<Categoria> = emptyList(),
    val categoriaSeleccionada: Categoria? = null,
    val query: String = "",
    val error: String? = null
)

@HiltViewModel
class DiccionarioViewModel @Inject constructor(
    private val getSenasUseCase: GetSenasUseCase,
    private val getCategoriasUseCase: GetCategoriasUseCase,
    private val searchSenasUseCase: SearchSenasUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(DiccionarioUiState())
    val uiState: StateFlow<DiccionarioUiState> = _uiState.asStateFlow()

    private var searchJob: Job? = null

    // Caché local con todas las señas cargadas al inicio
    private var senaCacheInicial: List<Sena> = emptyList()

    init {
        cargarDatosIniciales()
    }

    private fun cargarDatosIniciales() {
        viewModelScope.launch {
            // 1. Cargar Categorías
            getCategoriasUseCase().collect { result ->
                if (result is Resource.Success) {
                    _uiState.update { it.copy(categorias = result.data ?: emptyList()) }
                }
            }
        }

        viewModelScope.launch {
            // 2. Cargar Señas
            getSenasUseCase().collect { result ->
                when(result) {
                    is Resource.Loading -> _uiState.update { it.copy(isLoading = true) }
                    is Resource.Success -> {
                        val senas = result.data ?: emptyList()
                        // Guardamos la lista completa en memoria para filtrar rápido después
                        senaCacheInicial = senas
                        _uiState.update { it.copy(isLoading = false, senas = senas) }
                    }
                    is Resource.Error -> {
                        _uiState.update { it.copy(isLoading = false, error = result.message) }
                    }
                }
            }
        }
    }

    fun onSearchQueryChanged(newQuery: String) {
        _uiState.update { it.copy(query = newQuery) }

        searchJob?.cancel()
        searchJob = viewModelScope.launch {
            // Pequeña pausa para no filtrar en cada tecla pulsada
            delay(300L)

            Log.d("SEARCH_DEBUG", "Filtrando localmente: '$newQuery'")

            // ESTRATEGIA HÍBRIDA:
            // 1. Filtramos primero la lista que ya tenemos en memoria (senaCacheInicial).
            //    Esto es instantáneo y funciona aunque el backend falle o sea estricto.
            val resultadosLocales = if (newQuery.isBlank()) {
                senaCacheInicial
            } else {
                senaCacheInicial.filter { sena ->
                    sena.nombre.contains(newQuery, ignoreCase = true) ||
                            sena.descripcion.contains(newQuery, ignoreCase = true)
                }
            }

            // Aplicamos también el filtro de categoría si hay una seleccionada
            aplicarFiltrosLocales(resultadosLocales)

            /* NOTA: Si en el futuro necesitas buscar en servidor (porque tienes paginación
               y no todos los datos están en memoria), puedes descomentar esto:

               if (newQuery.isNotBlank() && resultadosLocales.isEmpty()) {
                   buscarEnApi(newQuery)
               }
            */
        }
    }

    fun onCategoriaSeleccionada(categoria: Categoria?) {
        _uiState.update { it.copy(categoriaSeleccionada = categoria) }

        // Al cambiar categoría, reaplicamos la búsqueda actual sobre la caché
        val queryActual = _uiState.value.query
        onSearchQueryChanged(queryActual)
    }

    // Aplica el filtro de categoría a una lista de resultados (ya sean de búsqueda o totales)
    private fun aplicarFiltrosLocales(listaBase: List<Sena>) {
        val cat = _uiState.value.categoriaSeleccionada

        val listaFiltrada = if (cat == null) {
            listaBase
        } else {
            listaBase.filter { it.categoriaNombre == cat.nombre }
        }

        Log.d("SEARCH_DEBUG", "Mostrando ${listaFiltrada.size} resultados")
        _uiState.update { it.copy(senas = listaFiltrada, isLoading = false) }
    }

    // Se mantiene por si decides reactivar la búsqueda en servidor
    private suspend fun buscarEnApi(query: String) {
        searchSenasUseCase(query).collect { result ->
            when(result) {
                is Resource.Loading -> _uiState.update { it.copy(isLoading = true) }
                is Resource.Success -> {
                    val resultadosApi = result.data ?: emptyList()
                    aplicarFiltrosLocales(resultadosApi)
                }
                is Resource.Error -> {
                    _uiState.update { it.copy(isLoading = false, error = result.message) }
                }
            }
        }
    }
}