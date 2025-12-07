package com.signspeak.ui.navigation

import LoginScreen
import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.signspeak.ui.screens.diccionario.DiccionarioScreen

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    // Definimos la pantalla de inicio (Login por ahora)
    NavHost(
        navController = navController,
        startDestination = Screen.Login.route
    ) {
        // Pantalla Login
        composable(route = Screen.Login.route) {
            LoginScreen(navController = navController)
        }

        // Pantalla Diccionario
        composable(route = Screen.Diccionario.route) {
            DiccionarioScreen(
                onSenaClick = { senaId ->
                    // Aquí navegaremos al detalle en el futuro
                    // navController.navigate(Screen.SenaDetail.createRoute(senaId))
                }
            )
        }

        // Aquí agregaremos Conversacion, Ajustes, etc.
    }
}