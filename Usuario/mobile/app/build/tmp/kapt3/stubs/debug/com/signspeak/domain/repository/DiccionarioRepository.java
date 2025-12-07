package com.signspeak.domain.repository;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u00008\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\t\n\u0002\b\u0003\n\u0002\u0010\b\n\u0002\b\u0002\bf\u0018\u00002\u00020\u0001J\"\u0010\u0002\u001a\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\u00050\u00040\u00032\u0006\u0010\u0006\u001a\u00020\u0007H\u00a6@\u00a2\u0006\u0002\u0010\bJ\u001a\u0010\t\u001a\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\n0\u00040\u0003H\u00a6@\u00a2\u0006\u0002\u0010\u000bJ\u001c\u0010\f\u001a\b\u0012\u0004\u0012\u00020\u00050\u00032\u0006\u0010\r\u001a\u00020\u000eH\u00a6@\u00a2\u0006\u0002\u0010\u000fJ\"\u0010\u0010\u001a\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\u00050\u00040\u00032\u0006\u0010\u0011\u001a\u00020\u0012H\u00a6@\u00a2\u0006\u0002\u0010\u0013\u00a8\u0006\u0014"}, d2 = {"Lcom/signspeak/domain/repository/DiccionarioRepository;", "", "buscarSenas", "Lcom/signspeak/util/Resource;", "", "Lcom/signspeak/domain/model/Sena;", "query", "", "(Ljava/lang/String;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "obtenerCategorias", "Lcom/signspeak/domain/model/Categoria;", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "obtenerSenaPorId", "id", "", "(JLkotlin/coroutines/Continuation;)Ljava/lang/Object;", "obtenerSenas", "pagina", "", "(ILkotlin/coroutines/Continuation;)Ljava/lang/Object;", "app_debug"})
public abstract interface DiccionarioRepository {
    
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object obtenerCategorias(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.util.Resource<java.util.List<com.signspeak.domain.model.Categoria>>> $completion);
    
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object obtenerSenas(int pagina, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.util.Resource<java.util.List<com.signspeak.domain.model.Sena>>> $completion);
    
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object buscarSenas(@org.jetbrains.annotations.NotNull()
    java.lang.String query, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.util.Resource<java.util.List<com.signspeak.domain.model.Sena>>> $completion);
    
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object obtenerSenaPorId(long id, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.util.Resource<com.signspeak.domain.model.Sena>> $completion);
}