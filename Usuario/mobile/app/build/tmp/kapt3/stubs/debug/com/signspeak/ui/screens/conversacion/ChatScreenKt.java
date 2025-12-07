package com.signspeak.ui.screens.conversacion;

@kotlin.Metadata(mv = {1, 9, 0}, k = 2, xi = 48, d1 = {"\u0000B\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0010\u000e\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000b\n\u0002\b\u0002\n\u0002\u0010\t\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0004\u001aH\u0010\u0000\u001a\u00020\u00012\u0006\u0010\u0002\u001a\u00020\u00032\u0012\u0010\u0004\u001a\u000e\u0012\u0004\u0012\u00020\u0003\u0012\u0004\u0012\u00020\u00010\u00052\f\u0010\u0006\u001a\b\u0012\u0004\u0012\u00020\u00010\u00072\f\u0010\b\u001a\b\u0012\u0004\u0012\u00020\u00010\u00072\u0006\u0010\t\u001a\u00020\nH\u0007\u001a6\u0010\u000b\u001a\u00020\u00012\b\b\u0002\u0010\f\u001a\u00020\r2\b\b\u0002\u0010\u000e\u001a\u00020\u000f2\u000e\b\u0002\u0010\u0010\u001a\b\u0012\u0004\u0012\u00020\u00010\u00072\b\b\u0002\u0010\u0011\u001a\u00020\u0012H\u0007\u001a\b\u0010\u0013\u001a\u00020\u0001H\u0007\u001a\u0010\u0010\u0014\u001a\u00020\u00012\u0006\u0010\u0015\u001a\u00020\u0016H\u0007\u001a\u0010\u0010\u0017\u001a\u00020\u00012\u0006\u0010\u0015\u001a\u00020\u0016H\u0007\u001a\u0010\u0010\u0018\u001a\u00020\u00032\b\u0010\u0019\u001a\u0004\u0018\u00010\u0003\u00a8\u0006\u001a"}, d2 = {"ChatInputBar", "", "texto", "", "onTextoChange", "Lkotlin/Function1;", "onEnviarClick", "Lkotlin/Function0;", "onCamaraClick", "isLoading", "", "ChatScreen", "conversacionId", "", "viewModel", "Lcom/signspeak/ui/screens/conversacion/ChatViewModel;", "onBackClick", "modifier", "Landroidx/compose/ui/Modifier;", "EmptyChatState", "MensajeChat", "mensaje", "Lcom/signspeak/domain/model/Mensaje;", "MensajeSistema", "extractTimeFromISO", "isoString", "app_debug"})
public final class ChatScreenKt {
    
    @kotlin.OptIn(markerClass = {androidx.compose.material3.ExperimentalMaterial3Api.class})
    @androidx.compose.runtime.Composable()
    public static final void ChatScreen(long conversacionId, @org.jetbrains.annotations.NotNull()
    com.signspeak.ui.screens.conversacion.ChatViewModel viewModel, @org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function0<kotlin.Unit> onBackClick, @org.jetbrains.annotations.NotNull()
    androidx.compose.ui.Modifier modifier) {
    }
    
    @androidx.compose.runtime.Composable()
    public static final void MensajeChat(@org.jetbrains.annotations.NotNull()
    com.signspeak.domain.model.Mensaje mensaje) {
    }
    
    @androidx.compose.runtime.Composable()
    public static final void MensajeSistema(@org.jetbrains.annotations.NotNull()
    com.signspeak.domain.model.Mensaje mensaje) {
    }
    
    @androidx.compose.runtime.Composable()
    public static final void ChatInputBar(@org.jetbrains.annotations.NotNull()
    java.lang.String texto, @org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function1<? super java.lang.String, kotlin.Unit> onTextoChange, @org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function0<kotlin.Unit> onEnviarClick, @org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function0<kotlin.Unit> onCamaraClick, boolean isLoading) {
    }
    
    @androidx.compose.runtime.Composable()
    public static final void EmptyChatState() {
    }
    
    @org.jetbrains.annotations.NotNull()
    public static final java.lang.String extractTimeFromISO(@org.jetbrains.annotations.Nullable()
    java.lang.String isoString) {
        return null;
    }
}