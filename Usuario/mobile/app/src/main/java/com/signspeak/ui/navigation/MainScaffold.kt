package com.signspeak.ui.navigation

import LoginScreen
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Translate
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.signspeak.ui.screens.ajustes.AjustesScreen
import com.signspeak.ui.screens.conversacion.ChatScreen
import com.signspeak.ui.screens.diccionario.DiccionarioScreen
import com.signspeak.ui.screens.traductor.TraductorScreen

@Composable
fun MainScaffold() {
    val navController = rememberNavController()

    // Obtenemos la ruta actual para saber si mostrar o no la barra inferior
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    // Ocultar barra en Login, Registro y en el Historial de Chat
    val showBottomBar = currentRoute != Screen.Login.route &&
            currentRoute != Screen.Register.route &&
            currentRoute != "chat_history"

    Scaffold(
        bottomBar = {
            if (showBottomBar) {
                BottomNavigationBar(navController = navController)
            }
        }
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = Screen.Login.route,
            modifier = Modifier.padding(paddingValues)
        ) {
            // 1. Pantalla de Login
            composable(Screen.Login.route) {
                LoginScreen(navController = navController)
            }

            // 2. Pantalla de Diccionario
            composable(Screen.Diccionario.route) {
                DiccionarioScreen(
                    onSenaClick = { /* TODO: Navegar a detalle */ }
                )
            }

            // 3. Pantalla de Traductor (Pestaña Central)
            composable(Screen.Conversacion.route) {
                // Si esta pantalla sale en blanco, verifica que TraductorScreen.kt exista en la carpeta correcta
                TraductorScreen(
                    onHistorialClick = {
                        // Navegamos al historial (antiguo ChatScreen)
                        navController.navigate("chat_history")
                    }
                )
            }

            // 4. Pantalla de Ajustes
            composable(Screen.Ajustes.route) {
                AjustesScreen()
            }

            // 5. Historial de Conversaciones
            composable("chat_history") {
                ChatScreen(
                    onBackClick = {
                        navController.popBackStack()
                    }
                )
            }

            // 6. Registro (Placeholder)
            composable(Screen.Register.route) {
                Text("Pantalla de Registro pendiente")
            }
        }
    }
}

@Composable
fun BottomNavigationBar(navController: NavHostController) {
    val items = listOf(
        BottomNavItem.Diccionario,
        BottomNavItem.Traductor, // Ítem central actualizado
        BottomNavItem.Ajustes
    )

    NavigationBar {
        val navBackStackEntry by navController.currentBackStackEntryAsState()
        val currentDestination = navBackStackEntry?.destination

        items.forEach { item ->
            val isSelected = currentDestination?.hierarchy?.any { it.route == item.route } == true

            NavigationBarItem(
                icon = { Icon(item.icon, contentDescription = item.title) },
                label = { Text(item.title) },
                selected = isSelected,
                onClick = {
                    navController.navigate(item.route) {
                        popUpTo(navController.graph.findStartDestination().id) {
                            saveState = true
                        }
                        launchSingleTop = true
                        restoreState = true
                    }
                }
            )
        }
    }
}

// Clase sellada para definir los ítems del menú inferior
sealed class BottomNavItem(val route: String, val title: String, val icon: ImageVector) {
    object Diccionario : BottomNavItem(Screen.Diccionario.route, "Diccionario", Icons.Default.Book)
    object Traductor : BottomNavItem(Screen.Conversacion.route, "Traductor", Icons.Default.Translate)
    object Ajustes : BottomNavItem(Screen.Ajustes.route, "Ajustes", Icons.Default.Settings)
}