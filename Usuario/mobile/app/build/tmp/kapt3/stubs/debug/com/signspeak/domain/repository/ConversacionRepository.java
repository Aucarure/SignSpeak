package com.signspeak.domain.repository;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u00004\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\t\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0010 \n\u0002\b\u0002\bf\u0018\u00002\u00020\u0001J\u001c\u0010\u0002\u001a\b\u0012\u0004\u0012\u00020\u00040\u00032\u0006\u0010\u0005\u001a\u00020\u0006H\u00a6@\u00a2\u0006\u0002\u0010\u0007J$\u0010\b\u001a\b\u0012\u0004\u0012\u00020\t0\u00032\u0006\u0010\n\u001a\u00020\u00062\u0006\u0010\u000b\u001a\u00020\fH\u00a6@\u00a2\u0006\u0002\u0010\rJ\"\u0010\u000e\u001a\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\u00040\u000f0\u00032\u0006\u0010\u0005\u001a\u00020\u0006H\u00a6@\u00a2\u0006\u0002\u0010\u0007J\u001c\u0010\u0010\u001a\b\u0012\u0004\u0012\u00020\u00040\u00032\u0006\u0010\n\u001a\u00020\u0006H\u00a6@\u00a2\u0006\u0002\u0010\u0007\u00a8\u0006\u0011"}, d2 = {"Lcom/signspeak/domain/repository/ConversacionRepository;", "", "crearConversacion", "Lcom/signspeak/util/Resource;", "Lcom/signspeak/domain/model/Conversacion;", "idUsuario", "", "(JLkotlin/coroutines/Continuation;)Ljava/lang/Object;", "enviarMensaje", "Lcom/signspeak/domain/model/Mensaje;", "idConversacion", "texto", "", "(JLjava/lang/String;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "listarConversaciones", "", "obtenerConversacionCompleta", "app_debug"})
public abstract interface ConversacionRepository {
    
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object crearConversacion(long idUsuario, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.util.Resource<com.signspeak.domain.model.Conversacion>> $completion);
    
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object enviarMensaje(long idConversacion, @org.jetbrains.annotations.NotNull()
    java.lang.String texto, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.util.Resource<com.signspeak.domain.model.Mensaje>> $completion);
    
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object listarConversaciones(long idUsuario, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.util.Resource<java.util.List<com.signspeak.domain.model.Conversacion>>> $completion);
    
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object obtenerConversacionCompleta(long idConversacion, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.util.Resource<com.signspeak.domain.model.Conversacion>> $completion);
}