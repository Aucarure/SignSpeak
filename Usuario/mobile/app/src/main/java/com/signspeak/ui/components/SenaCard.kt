package com.signspeak.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.signspeak.domain.model.Sena

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SenaCard(
    sena: Sena,
    onClick: () -> Unit,
    onBookmarkClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .height(140.dp),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        onClick = onClick
    ) {
        Row(modifier = Modifier.fillMaxSize()) {
            // 1. Imagen y Badge de Dificultad (Izquierda)
            Box(
                modifier = Modifier
                    .weight(0.35f)
                    .fillMaxHeight()
                    .padding(12.dp)
            ) {
                AsyncImage(
                    model = sena.urlImagen ?: "https://via.placeholder.com/150",
                    contentDescription = sena.nombre,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .fillMaxSize()
                        .clip(RoundedCornerShape(16.dp))
                )

                // Badge de Dificultad (Verde/Naranja)
                val badgeColor = when(sena.dificultad.uppercase()) {
                    "FACIL" -> Color(0xFF00C853) // Verde
                    "MEDIO" -> Color(0xFFFFAB00) // Naranja
                    else -> Color(0xFFD50000) // Rojo
                }

                Surface(
                    color = badgeColor,
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .padding(8.dp)
                ) {
                    Text(
                        text = sena.dificultad.capitalize(),
                        color = Color.White,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }

            // 2. Contenido (Centro/Derecha)
            Column(
                modifier = Modifier
                    .weight(0.65f)
                    .fillMaxHeight()
                    .padding(top = 16.dp, end = 16.dp, bottom = 16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Top
                ) {
                    // Título
                    Text(
                        text = sena.nombre,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1F2937)
                    )

                    // Botón Favorito
                    Icon(
                        imageVector = Icons.Default.BookmarkBorder,
                        contentDescription = "Guardar",
                        tint = Color(0xFFE5E7EB),
                        modifier = Modifier.size(24.dp)
                    )
                }

                Spacer(modifier = Modifier.height(4.dp))

                // Descripción
                Text(
                    text = sena.descripcion,
                    style = MaterialTheme.typography.bodySmall,
                    color = Color.Gray,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(modifier = Modifier.weight(1f))

                // Fila inferior: Categoría y Botón Ver
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Chip de Categoría (Color dinámico)
                    val catColor = when(sena.categoriaNombre?.uppercase()) {
                        "SALUDOS" -> Color(0xFFFF4081) // Rosa
                        "CORTESÍA" -> Color(0xFFFFAB00) // Amarillo
                        "FAMILIA", "PERSONAS" -> Color(0xFF2196F3) // Azul
                        else -> Color(0xFF9E9E9E)
                    }

                    Surface(
                        color = catColor,
                        shape = RoundedCornerShape(16.dp)
                    ) {
                        Text(
                            text = sena.categoriaNombre ?: "General",
                            color = Color.White,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                        )
                    }

                    // Botón "Ver señal"
                    Surface(
                        color = Color(0xFFF3F4F6),
                        shape = RoundedCornerShape(20.dp),
                        modifier = Modifier.clickable { onClick() }
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Visibility,
                                contentDescription = null,
                                tint = Color(0xFF4B5563),
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "Ver señal",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Medium,
                                color = Color(0xFF4B5563)
                            )
                        }
                    }
                }
            }
        }
    }
}

// Extensión simple para capitalizar textos (para Java 17/Kotlin antiguo)
private fun String.capitalize(): String {
    return this.lowercase().replaceFirstChar { it.uppercase() }
}