package com.signspeak.ui.navigation

sealed class Screen(val route: String) {
    object Login : Screen("login_screen")
    object Register : Screen("register_screen")
    object Diccionario : Screen("diccionario_screen")
    object Conversacion : Screen("conversacion_screen")
    object Ajustes : Screen("ajustes_screen")

    // Para pasar argumentos (ej: detalle de seña), haríamos algo así:
    // object SenaDetail : Screen("sena_detail/{senaId}") {
    //     fun createRoute(senaId: Long) = "sena_detail/$senaId"
    // }
}