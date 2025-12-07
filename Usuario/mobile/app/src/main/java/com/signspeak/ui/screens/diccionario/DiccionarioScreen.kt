package com.signspeak.ui.screens.diccionario

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.signspeak.ui.components.SenaCard
// Asegúrate de importar tu modelo Categoria correctamente
import com.signspeak.domain.model.Categoria

@Composable
fun DiccionarioScreen(
    viewModel: DiccionarioViewModel = hiltViewModel(),
    onSenaClick: (Long) -> Unit
) {
    val state by viewModel.uiState.collectAsState()

    // Degradado del header (Morado a Azul)
    val headerGradient = Brush.verticalGradient(
        colors = listOf(
            Color(0xFF7C4DFF), // Morado
            Color(0xFF536DFE)  // Azul
        )
    )

    Scaffold(
        containerColor = Color(0xFFF5F5F5)
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // ========== HEADER CON DEGRADADO ==========
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(headerGradient)
                    .padding(horizontal = 20.dp, vertical = 24.dp)
            ) {
                Column {
                    // Título con emoji
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "✨",
                            fontSize = 28.sp
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Diccionario de\nSeñas",
                            style = MaterialTheme.typography.headlineSmall,
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                            lineHeight = 32.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Subtítulo
                    Text(
                        text = "Explora ${state.senas.size} palabras y practica en\ncualquier momento",
                        color = Color.White.copy(alpha = 0.9f),
                        style = MaterialTheme.typography.bodyMedium,
                        lineHeight = 20.sp
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Estadísticas: Favoritas y Resultados
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        // Favoritas
                        Icon(
                            Icons.Default.Star,
                            contentDescription = null,
                            tint = Color(0xFFFFC107),
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            "2 Favoritas",
                            color = Color.White,
                            style = MaterialTheme.typography.labelMedium
                        )

                        Spacer(modifier = Modifier.width(16.dp))

                        // Resultados (punto verde)
                        Text(
                            "●",
                            color = Color(0xFF4CAF50),
                            fontSize = 12.sp
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            "${state.senas.size} Resultados",
                            color = Color.White,
                            style = MaterialTheme.typography.labelMedium
                        )
                    }
                }
            }

            // ========== BUSCADOR FLOTANTE ==========
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .offset(y = (-20).dp)
                    .padding(horizontal = 20.dp),
                shape = RoundedCornerShape(16.dp),
                shadowElevation = 4.dp,
                color = Color.White
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .padding(horizontal = 16.dp, vertical = 4.dp)
                        .height(48.dp)
                ) {
                    Icon(
                        Icons.Default.Search,
                        contentDescription = null,
                        tint = Color(0xFF9E9E9E)
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    TextField(
                        value = state.query,
                        onValueChange = { viewModel.onSearchQueryChanged(it) },
                        placeholder = {
                            Text(
                                "Buscar palabra mágica... ✨",
                                color = Color(0xFFBDBDBD)
                            )
                        },
                        colors = TextFieldDefaults.colors(
                            focusedContainerColor = Color.Transparent,
                            unfocusedContainerColor = Color.Transparent,
                            focusedIndicatorColor = Color.Transparent,
                            unfocusedIndicatorColor = Color.Transparent
                        ),
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // ========== FILTROS DE CATEGORÍAS ==========
            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Chip "Todos"
                item {
                    CategoryChip(
                        text = "✨ Todos (${state.senas.size})",
                        isSelected = state.categoriaSeleccionada == null,
                        onClick = { viewModel.onCategoriaSeleccionada(null) }
                    )
                }

                // Chips de categorías (Iteramos sobre la lista)
                items(state.categorias) { categoria ->
                    val count = state.senas.count { it.categoriaNombre == categoria.nombre }
                    // Lógica simple para emoji
                    val emoji = when {
                        categoria.nombre.contains("saludo", ignoreCase = true) -> "👋"
                        categoria.nombre.contains("cortesía", ignoreCase = true) -> "🙏"
                        categoria.nombre.contains("familia", ignoreCase = true) -> "👨‍👩‍👧‍👦"
                        categoria.nombre.contains("persona", ignoreCase = true) -> "👤"
                        else -> "📋"
                    }

                    CategoryChip(
                        text = "$emoji ${categoria.nombre} ($count)",
                        isSelected = state.categoriaSeleccionada?.id == categoria.id,
                        onClick = { viewModel.onCategoriaSeleccionada(categoria) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // ========== LISTA DE SEÑAS ==========
            LazyColumn(
                // Corrección PaddingValues: No se puede mezclar horizontal con bottom
                contentPadding = PaddingValues(start = 20.dp, end = 20.dp, bottom = 80.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier
                    .fillMaxSize()
                    .weight(1f) // IMPORTANTE: Para que funcione dentro del Column
            ) {
                if (state.isLoading) {
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(32.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            CircularProgressIndicator()
                        }
                    }
                } else if (state.senas.isEmpty()) {
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(32.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                "No se encontraron señas",
                                color = Color.Gray,
                                style = MaterialTheme.typography.bodyLarge
                            )
                        }
                    }
                } else {
                    items(state.senas) { sena ->
                        SenaCard(
                            sena = sena,
                            onClick = { onSenaClick(sena.id) },
                            onBookmarkClick = { /* TODO: Implementar favoritos */ }
                        )
                    }
                }
            }
        }
    }
}

// ========== COMPONENTES AUXILIARES ==========
// Esta función debe estar FUERA de DiccionarioScreen
@Composable
fun CategoryChip(
    text: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Surface(
        color = if (isSelected) Color(0xFF7C4DFF) else Color.White,
        contentColor = if (isSelected) Color.White else Color(0xFF424242),
        shape = RoundedCornerShape(20.dp),
        shadowElevation = if (isSelected) 4.dp else 1.dp,
        modifier = Modifier.clickable { onClick() }
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelLarge,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
        )
    }
}