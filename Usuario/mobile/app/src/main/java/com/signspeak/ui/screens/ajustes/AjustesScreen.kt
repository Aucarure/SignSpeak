package com.signspeak.ui.screens.ajustes

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel

@Composable
fun AjustesScreen(
    viewModel: AjustesViewModel = hiltViewModel(),
    onPerfilClick: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val state by viewModel.uiState.collectAsState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFFF9FAFB))
            .verticalScroll(rememberScrollState())
            .padding(bottom = 80.dp)
    ) {
        // ========== HEADER ==========
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White)
                .padding(horizontal = 20.dp, vertical = 24.dp)
        ) {
            Text(
                text = "Configuración",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
            Text(
                text = "Personaliza tu experiencia de aprendizaje",
                style = MaterialTheme.typography.bodyMedium,
                color = Color(0xFF6B7280)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // ========== SECCIÓN: APARIENCIA ==========
        SettingsSection(
            icon = Icons.Default.Palette,
            iconColor = Color(0xFF7C4DFF),
            iconBackground = Color(0xFFE8DEF8),
            title = "Apariencia"
        ) {
            // Modo Oscuro
            SettingToggleItem(
                icon = Icons.Default.DarkMode,
                iconColor = Color(0xFFFFA726),
                iconBackground = Color(0xFFFFF3E0),
                title = "Modo Oscuro",
                subtitle = "Reduce el brillo de la pantalla",
                checked = state.modoOscuro,
                onCheckedChange = { viewModel.toggleModoOscuro() }
            )

            Divider(
                modifier = Modifier.padding(start = 56.dp),
                color = Color(0xFFE5E7EB)
            )

            // Alto Contraste
            SettingToggleItem(
                icon = Icons.Default.Contrast,
                iconColor = Color(0xFF424242),
                iconBackground = Color(0xFFEEEEEE),
                title = "Alto Contraste",
                subtitle = "Mejora la visibilidad del texto",
                checked = state.altoContraste,
                onCheckedChange = { viewModel.toggleAltoContraste() }
            )

            Divider(
                modifier = Modifier.padding(start = 56.dp),
                color = Color(0xFFE5E7EB)
            )

            // Tamaño de Fuente
            SettingSliderItem(
                icon = Icons.Default.TextFields,
                iconColor = Color(0xFF1F2937),
                iconBackground = Color(0xFFF3F4F6),
                title = "Tamaño de Fuente",
                subtitle = "${when {
                    state.tamanoFuente <= 0.85f -> "Pequeño"
                    state.tamanoFuente >= 1.15f -> "Grande"
                    else -> "Normal"
                }} - ${(state.tamanoFuente * 16).toInt()}px",
                value = state.tamanoFuente,
                onValueChange = { viewModel.setTamanoFuente(it) },
                valueRange = 0.8f..1.3f,
                steps = 4
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // ========== BOTÓN: MI PERFIL ==========
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp)
                .clickable(onClick = onPerfilClick),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(Color(0xFFDCFCE7)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = null,
                        tint = Color(0xFF10B981),
                        modifier = Modifier.size(24.dp)
                    )
                }

                Spacer(modifier = Modifier.width(16.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Mi Perfil",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF1F2937)
                    )
                    Text(
                        text = "Ver y editar información personal",
                        style = MaterialTheme.typography.bodySmall,
                        color = Color(0xFF6B7280)
                    )
                }

                Icon(
                    imageVector = Icons.Default.ChevronRight,
                    contentDescription = null,
                    tint = Color(0xFF9CA3AF)
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))
    }
}

// ========== COMPONENTE: SECCIÓN DE AJUSTES ==========
@Composable
fun SettingsSection(
    icon: ImageVector,
    iconColor: Color,
    iconBackground: Color,
    title: String,
    content: @Composable ColumnScope.() -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            // Header de la sección
            Row(
                modifier = Modifier.padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .clip(CircleShape)
                        .background(iconBackground),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = iconColor,
                        modifier = Modifier.size(18.dp)
                    )
                }

                Spacer(modifier = Modifier.width(12.dp))

                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF1F2937)
                )
            }

            // Contenido
            content()
        }
    }
}

// ========== COMPONENTE: TOGGLE ITEM ==========
@Composable
fun SettingToggleItem(
    icon: ImageVector,
    iconColor: Color,
    iconBackground: Color,
    title: String,
    subtitle: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onCheckedChange(!checked) }
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .clip(CircleShape)
                .background(iconBackground),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = iconColor,
                modifier = Modifier.size(22.dp)
            )
        }

        Spacer(modifier = Modifier.width(16.dp))

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.Medium,
                color = Color(0xFF1F2937)
            )
            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodySmall,
                color = Color(0xFF6B7280),
                fontSize = 13.sp
            )
        }

        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color.White,
                checkedTrackColor = Color(0xFF7C4DFF),
                uncheckedThumbColor = Color.White,
                uncheckedTrackColor = Color(0xFFD1D5DB)
            )
        )
    }
}

// ========== COMPONENTE: SLIDER ITEM ==========
@Composable
fun SettingSliderItem(
    icon: ImageVector,
    iconColor: Color,
    iconBackground: Color,
    title: String,
    subtitle: String,
    value: Float,
    onValueChange: (Float) -> Unit,
    valueRange: ClosedFloatingPointRange<Float>,
    steps: Int
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(iconBackground),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = iconColor,
                    modifier = Modifier.size(22.dp)
                )
            }

            Spacer(modifier = Modifier.width(16.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Medium,
                    color = Color(0xFF1F2937)
                )
                Text(
                    text = subtitle,
                    style = MaterialTheme.typography.bodySmall,
                    color = Color(0xFF6B7280),
                    fontSize = 13.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Slider con etiquetas
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "A",
                fontSize = 14.sp,
                color = Color(0xFF6B7280)
            )

            Slider(
                value = value,
                onValueChange = onValueChange,
                valueRange = valueRange,
                steps = steps,
                modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = 12.dp),
                colors = SliderDefaults.colors(
                    thumbColor = Color(0xFF7C4DFF),
                    activeTrackColor = Color(0xFF7C4DFF),
                    inactiveTrackColor = Color(0xFFE5E7EB)
                )
            )

            Text(
                text = "A",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
        }

        // Opciones rápidas
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 56.dp, top = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            QuickSizeButton("Pequeño", value < 0.95f) { onValueChange(0.8f) }
            QuickSizeButton("Normal", value in 0.95f..1.05f) { onValueChange(1f) }
            QuickSizeButton("Grande", value > 1.05f) { onValueChange(1.2f) }
        }
    }
}

@Composable
fun QuickSizeButton(
    text: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Surface(
        color = if (isSelected) Color(0xFF7C4DFF) else Color(0xFFF3F4F6),
        contentColor = if (isSelected) Color.White else Color(0xFF6B7280),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier.clickable(onClick = onClick)
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelMedium,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
        )
    }
}