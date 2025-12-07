package com.signspeak

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import com.signspeak.data.local.SettingsManager
import com.signspeak.ui.navigation.MainScaffold
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    @Inject
    lateinit var settingsManager: SettingsManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            // Escuchamos la configuración global en tiempo real
            val settings by settingsManager.settings.collectAsState(initial = null)

            // Determinamos si usar modo oscuro:
            // 1. Si ya cargó la config (settings != null), usamos la preferencia del usuario.
            // 2. Si no ha cargado (null), usamos la configuración del sistema por defecto.
            val isDark = settings?.isDarkMode ?: isSystemInDarkTheme()

            // Aplicamos un tema básico dinámico
            MaterialTheme(
                colorScheme = if (isDark) darkColorScheme() else lightColorScheme()
            ) {
                Surface {
                    // Llamamos a la estructura principal de navegación
                    MainScaffold()
                }
            }
        }
    }
}