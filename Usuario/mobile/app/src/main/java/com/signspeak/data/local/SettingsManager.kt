package com.signspeak.data.local

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.floatPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

// Creamos un DataStore separado para configuraciones
private val Context.settingsDataStore by preferencesDataStore("settings_prefs")

// Modelo de datos simple para pasar los valores juntos
data class UserSettings(
    val isDarkMode: Boolean,
    val fontSizeScale: Float
)

@Singleton
class SettingsManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    companion object {
        private val DARK_MODE_KEY = booleanPreferencesKey("dark_mode")
        private val FONT_SIZE_KEY = floatPreferencesKey("font_size")
    }

    // Flujo de datos: Emite la configuración cada vez que cambia
    val settings: Flow<UserSettings> = context.settingsDataStore.data.map { prefs ->
        UserSettings(
            isDarkMode = prefs[DARK_MODE_KEY] ?: false, // Por defecto: Claro
            fontSizeScale = prefs[FONT_SIZE_KEY] ?: 1.0f // Por defecto: Normal (1.0)
        )
    }

    // Funciones para guardar cambios
    suspend fun setDarkMode(enabled: Boolean) {
        context.settingsDataStore.edit { prefs ->
            prefs[DARK_MODE_KEY] = enabled
        }
    }

    suspend fun setFontSize(scale: Float) {
        context.settingsDataStore.edit { prefs ->
            prefs[FONT_SIZE_KEY] = scale
        }
    }
}