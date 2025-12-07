package com.signspeak.ui.screens.conversacion;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000F\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\t\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0010\u000e\n\u0002\b\u0005\b\u0007\u0018\u00002\u00020\u0001B\u0017\b\u0007\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u00a2\u0006\u0002\u0010\u0006J\u0010\u0010\u0010\u001a\u00020\u00112\u0006\u0010\u0012\u001a\u00020\u0013H\u0002J\u000e\u0010\u0014\u001a\u00020\u00112\u0006\u0010\u0015\u001a\u00020\u000bJ\u0006\u0010\u0016\u001a\u00020\u0011J\b\u0010\u0017\u001a\u00020\u0018H\u0002J\u0006\u0010\u0019\u001a\u00020\u0011J\u000e\u0010\u001a\u001a\u00020\u00112\u0006\u0010\u001b\u001a\u00020\u0018J\u0006\u0010\u001c\u001a\u00020\u0011R\u0014\u0010\u0007\u001a\b\u0012\u0004\u0012\u00020\t0\bX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\n\u001a\u00020\u000bX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0004\u001a\u00020\u0005X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0017\u0010\f\u001a\b\u0012\u0004\u0012\u00020\t0\r\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000e\u0010\u000f\u00a8\u0006\u001d"}, d2 = {"Lcom/signspeak/ui/screens/conversacion/ChatViewModel;", "Landroidx/lifecycle/ViewModel;", "sendMessageUseCase", "Lcom/signspeak/domain/usecase/conversacion/SendMessageUseCase;", "repository", "Lcom/signspeak/domain/repository/ConversacionRepository;", "(Lcom/signspeak/domain/usecase/conversacion/SendMessageUseCase;Lcom/signspeak/domain/repository/ConversacionRepository;)V", "_uiState", "Lkotlinx/coroutines/flow/MutableStateFlow;", "Lcom/signspeak/ui/screens/conversacion/ChatUiState;", "currentConversacionId", "", "uiState", "Lkotlinx/coroutines/flow/StateFlow;", "getUiState", "()Lkotlinx/coroutines/flow/StateFlow;", "agregarMensajeALista", "", "mensaje", "Lcom/signspeak/domain/model/Mensaje;", "cargarConversacion", "id", "enviarMensaje", "getHoraActualISO", "", "iniciarCaptura", "onTextoInputChanged", "texto", "toggleGuardarConversacion", "app_debug"})
@dagger.hilt.android.lifecycle.HiltViewModel()
public final class ChatViewModel extends androidx.lifecycle.ViewModel {
    @org.jetbrains.annotations.NotNull()
    private final com.signspeak.domain.usecase.conversacion.SendMessageUseCase sendMessageUseCase = null;
    @org.jetbrains.annotations.NotNull()
    private final com.signspeak.domain.repository.ConversacionRepository repository = null;
    @org.jetbrains.annotations.NotNull()
    private final kotlinx.coroutines.flow.MutableStateFlow<com.signspeak.ui.screens.conversacion.ChatUiState> _uiState = null;
    @org.jetbrains.annotations.NotNull()
    private final kotlinx.coroutines.flow.StateFlow<com.signspeak.ui.screens.conversacion.ChatUiState> uiState = null;
    private long currentConversacionId = 0L;
    
    @javax.inject.Inject()
    public ChatViewModel(@org.jetbrains.annotations.NotNull()
    com.signspeak.domain.usecase.conversacion.SendMessageUseCase sendMessageUseCase, @org.jetbrains.annotations.NotNull()
    com.signspeak.domain.repository.ConversacionRepository repository) {
        super();
    }
    
    @org.jetbrains.annotations.NotNull()
    public final kotlinx.coroutines.flow.StateFlow<com.signspeak.ui.screens.conversacion.ChatUiState> getUiState() {
        return null;
    }
    
    public final void cargarConversacion(long id) {
    }
    
    public final void onTextoInputChanged(@org.jetbrains.annotations.NotNull()
    java.lang.String texto) {
    }
    
    public final void enviarMensaje() {
    }
    
    public final void iniciarCaptura() {
    }
    
    public final void toggleGuardarConversacion() {
    }
    
    private final void agregarMensajeALista(com.signspeak.domain.model.Mensaje mensaje) {
    }
    
    private final java.lang.String getHoraActualISO() {
        return null;
    }
}