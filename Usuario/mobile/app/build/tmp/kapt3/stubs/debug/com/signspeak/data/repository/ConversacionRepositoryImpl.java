package com.signspeak.data.repository;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000<\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\t\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0010 \n\u0002\b\u0002\u0018\u00002\u00020\u0001B\u000f\b\u0007\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004J\u001c\u0010\u0005\u001a\b\u0012\u0004\u0012\u00020\u00070\u00062\u0006\u0010\b\u001a\u00020\tH\u0096@\u00a2\u0006\u0002\u0010\nJ$\u0010\u000b\u001a\b\u0012\u0004\u0012\u00020\f0\u00062\u0006\u0010\r\u001a\u00020\t2\u0006\u0010\u000e\u001a\u00020\u000fH\u0096@\u00a2\u0006\u0002\u0010\u0010J\"\u0010\u0011\u001a\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\u00070\u00120\u00062\u0006\u0010\b\u001a\u00020\tH\u0096@\u00a2\u0006\u0002\u0010\nJ\u001c\u0010\u0013\u001a\b\u0012\u0004\u0012\u00020\u00070\u00062\u0006\u0010\r\u001a\u00020\tH\u0096@\u00a2\u0006\u0002\u0010\nR\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0014"}, d2 = {"Lcom/signspeak/data/repository/ConversacionRepositoryImpl;", "Lcom/signspeak/domain/repository/ConversacionRepository;", "api", "Lcom/signspeak/data/remote/api/ConversacionApi;", "(Lcom/signspeak/data/remote/api/ConversacionApi;)V", "crearConversacion", "Lcom/signspeak/util/Resource;", "Lcom/signspeak/domain/model/Conversacion;", "idUsuario", "", "(JLkotlin/coroutines/Continuation;)Ljava/lang/Object;", "enviarMensaje", "Lcom/signspeak/domain/model/Mensaje;", "idConversacion", "texto", "", "(JLjava/lang/String;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "listarConversaciones", "", "obtenerConversacionCompleta", "app_debug"})
public final class ConversacionRepositoryImpl implements com.signspeak.domain.repository.ConversacionRepository {
    @org.jetbrains.annotations.NotNull()
    private final com.signspeak.data.remote.api.ConversacionApi api = null;
    
    @javax.inject.Inject()
    public ConversacionRepositoryImpl(@org.jetbrains.annotations.NotNull()
    com.signspeak.data.remote.api.ConversacionApi api) {
        super();
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.Nullable()
    public java.lang.Object crearConversacion(long idUsuario, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.util.Resource<com.signspeak.domain.model.Conversacion>> $completion) {
        return null;
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.Nullable()
    public java.lang.Object enviarMensaje(long idConversacion, @org.jetbrains.annotations.NotNull()
    java.lang.String texto, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.util.Resource<com.signspeak.domain.model.Mensaje>> $completion) {
        return null;
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.Nullable()
    public java.lang.Object listarConversaciones(long idUsuario, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.util.Resource<java.util.List<com.signspeak.domain.model.Conversacion>>> $completion) {
        return null;
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.Nullable()
    public java.lang.Object obtenerConversacionCompleta(long idConversacion, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.util.Resource<com.signspeak.domain.model.Conversacion>> $completion) {
        return null;
    }
}