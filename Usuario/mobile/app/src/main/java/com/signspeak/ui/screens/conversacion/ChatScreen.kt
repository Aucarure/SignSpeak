package com.signspeak.ui.screens.conversacion

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.signspeak.domain.model.Mensaje

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChatScreen(
    conversacionId: Long = 0,
    viewModel: ChatViewModel = hiltViewModel(),
    onBackClick: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val state by viewModel.uiState.collectAsState()
    val listState = rememberLazyListState()

    LaunchedEffect(conversacionId) {
        if (conversacionId != 0L) viewModel.cargarConversacion(conversacionId)
    }

    LaunchedEffect(state.mensajes.size) {
        if (state.mensajes.isNotEmpty()) listState.animateScrollToItem(state.mensajes.size - 1)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(state.tituloConversacion ?: "Conversación", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                        Text(if (state.isTranslating) "Traduciendo..." else "${state.mensajes.size} mensajes", style = MaterialTheme.typography.bodySmall, color = Color(0xFF6B7280))
                    }
                },
                navigationIcon = { IconButton(onClick = onBackClick) { Icon(Icons.Default.ArrowBack, "Volver") } },
                actions = { IconButton(onClick = { viewModel.toggleGuardarConversacion() }) { Icon(if (state.esGuardada) Icons.Filled.Bookmark else Icons.Filled.BookmarkBorder, null, tint = if (state.esGuardada) Color(0xFF7C4DFF) else Color(0xFF9CA3AF)) } }
            )
        },
        containerColor = Color(0xFFF9FAFB)
    ) { padding ->
        Column(modifier = modifier.fillMaxSize().padding(padding)) {
            if (state.isLoading) {
                Box(Modifier.fillMaxWidth().weight(1f), contentAlignment = Alignment.Center) { CircularProgressIndicator() }
            } else if (state.mensajes.isEmpty()) {
                EmptyChatState()
            } else {
                LazyColumn(state = listState, modifier = Modifier.weight(1f).fillMaxWidth(), contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    items(state.mensajes) { mensaje ->
                        if (mensaje.tipo == "SISTEMA") MensajeSistema(mensaje) else MensajeChat(mensaje)
                    }
                }
            }
            ChatInputBar(state.textoInput, { viewModel.onTextoInputChanged(it) }, { viewModel.enviarMensaje() }, { viewModel.iniciarCaptura() }, state.isTranslating)
        }
    }
}

@Composable
fun MensajeChat(mensaje: Mensaje) {
    val esMio = mensaje.esMio
    val alignment = if (esMio) Alignment.End else Alignment.Start
    val backgroundColor = if (esMio) Color(0xFF7C4DFF) else Color.White
    val textColor = if (esMio) Color.White else Color(0xFF1F2937)

    Column(modifier = Modifier.fillMaxWidth(), horizontalAlignment = alignment) {
        Surface(
            color = backgroundColor,
            shape = RoundedCornerShape(16.dp, 16.dp, if (esMio) 4.dp else 16.dp, if (esMio) 16.dp else 4.dp),
            shadowElevation = 2.dp,
            modifier = Modifier.widthIn(max = 280.dp)
        ) {
            Column(modifier = Modifier.padding(12.dp)) {
                // CORRECCIÓN 1: Manejo de nulos (String? -> String)
                Text(text = mensaje.texto ?: "", style = MaterialTheme.typography.bodyMedium, color = textColor)

                if (mensaje.tipo == "SENA_DETECTADA" && mensaje.nombreSena != null) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Surface(color = if (esMio) Color(0xFF6200EA) else Color(0xFFF3F4F6), shape = RoundedCornerShape(8.dp)) {
                        Row(modifier = Modifier.padding(8.dp, 4.dp), verticalAlignment = Alignment.CenterVertically) {
                            // CORRECCIÓN 2: Reemplazo de Icons.Default.Sign (que no existe) por Info
                            Icon(Icons.Default.Info, null, modifier = Modifier.size(14.dp), tint = if (esMio) Color.White else Color(0xFF6B7280))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(text = mensaje.nombreSena ?: "", fontSize = 12.sp, color = if (esMio) Color.White else Color(0xFF6B7280))

                            mensaje.confianza?.let {
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(text = "${(it * 100).toInt()}%", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = if (esMio) Color.White.copy(alpha = 0.8f) else Color(0xFF10B981))
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(4.dp))
                // CORRECCIÓN 3: Uso de mensaje.fecha y helper manual en vez de timestamp/DateTimeFormatter
                Text(text = extractTimeFromISO(mensaje.fecha), style = MaterialTheme.typography.labelSmall, color = if (esMio) Color.White.copy(alpha = 0.7f) else Color(0xFF9CA3AF), fontSize = 11.sp)
            }
        }
    }
}

@Composable
fun MensajeSistema(mensaje: Mensaje) {
    Row(Modifier.fillMaxWidth().padding(vertical = 8.dp), horizontalArrangement = Arrangement.Center) {
        Surface(color = Color(0xFFE5E7EB), shape = RoundedCornerShape(12.dp)) {
            Text(text = mensaje.texto ?: "", style = MaterialTheme.typography.labelMedium, color = Color(0xFF6B7280), modifier = Modifier.padding(12.dp, 6.dp), textAlign = TextAlign.Center)
        }
    }
}

@Composable
fun ChatInputBar(texto: String, onTextoChange: (String) -> Unit, onEnviarClick: () -> Unit, onCamaraClick: () -> Unit, isLoading: Boolean) {
    Surface(color = Color.White, shadowElevation = 8.dp) {
        Row(Modifier.fillMaxWidth().padding(12.dp, 8.dp), verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onCamaraClick, modifier = Modifier.size(40.dp).clip(CircleShape).background(Color(0xFFF3F4F6))) {
                Icon(Icons.Default.CameraAlt, "Capturar", tint = Color(0xFF7C4DFF))
            }
            Spacer(Modifier.width(8.dp))
            OutlinedTextField(
                value = texto, onValueChange = onTextoChange,
                placeholder = { Text("Escribe...", color = Color(0xFFBDBDBD)) },
                modifier = Modifier.weight(1f).heightIn(min = 48.dp, max = 120.dp),
                shape = RoundedCornerShape(24.dp),
                colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Color(0xFF7C4DFF), unfocusedBorderColor = Color(0xFFE5E7EB))
            )
            Spacer(Modifier.width(8.dp))
            FloatingActionButton(onClick = onEnviarClick, modifier = Modifier.size(48.dp), containerColor = if (texto.isNotBlank() && !isLoading) Color(0xFF7C4DFF) else Color(0xFFE5E7EB), elevation = FloatingActionButtonDefaults.elevation(0.dp, 2.dp)) {
                if (isLoading) CircularProgressIndicator(Modifier.size(24.dp), color = Color.White, strokeWidth = 2.dp) else Icon(Icons.Default.Send, "Enviar", tint = if (texto.isNotBlank()) Color.White else Color(0xFF9CA3AF))
            }
        }
    }
}

@Composable
fun EmptyChatState() {
    Column(Modifier.fillMaxSize().padding(32.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
        Box(Modifier.size(80.dp).clip(CircleShape).background(Color(0xFFE8DEF8)), contentAlignment = Alignment.Center) {
            Icon(Icons.Default.Email, null, tint = Color(0xFF7C4DFF), modifier = Modifier.size(40.dp))
        }
        Spacer(Modifier.height(16.dp))
        Text("Inicia una conversación", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
        Text("Escribe un mensaje para comenzar", style = MaterialTheme.typography.bodyMedium, color = Color.Gray, textAlign = TextAlign.Center)
    }
}

// CORRECCIÓN 4: Función helper para extraer la hora sin crashear en APIs viejas
fun extractTimeFromISO(isoString: String?): String {
    if (isoString.isNullOrEmpty()) return ""
    return try {
        if (isoString.contains("T")) isoString.split("T")[1].take(5) else isoString
    } catch (e: Exception) { "" }
}