package com.signspeak.data.repository;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000@\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\t\n\u0002\b\u0003\n\u0002\u0010\b\n\u0002\b\u0002\u0018\u00002\u00020\u0001B\u000f\b\u0007\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004J\"\u0010\u0005\u001a\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\b0\u00070\u00062\u0006\u0010\t\u001a\u00020\nH\u0096@\u00a2\u0006\u0002\u0010\u000bJ\u001a\u0010\f\u001a\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\r0\u00070\u0006H\u0096@\u00a2\u0006\u0002\u0010\u000eJ\u001c\u0010\u000f\u001a\b\u0012\u0004\u0012\u00020\b0\u00062\u0006\u0010\u0010\u001a\u00020\u0011H\u0096@\u00a2\u0006\u0002\u0010\u0012J\"\u0010\u0013\u001a\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\b0\u00070\u00062\u0006\u0010\u0014\u001a\u00020\u0015H\u0096@\u00a2\u0006\u0002\u0010\u0016R\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0017"}, d2 = {"Lcom/signspeak/data/repository/DiccionarioRepositoryImpl;", "Lcom/signspeak/domain/repository/DiccionarioRepository;", "api", "Lcom/signspeak/data/remote/api/DiccionarioApi;", "(Lcom/signspeak/data/remote/api/DiccionarioApi;)V", "buscarSenas", "Lcom/signspeak/util/Resource;", "", "Lcom/signspeak/domain/model/Sena;", "query", "", "(Ljava/lang/String;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "obtenerCategorias", "Lcom/signspeak/domain/model/Categoria;", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "obtenerSenaPorId", "id", "", "(JLkotlin/coroutines/Continuation;)Ljava/lang/Object;", "obtenerSenas", "pagina", "", "(ILkotlin/coroutines/Continuation;)Ljava/lang/Object;", "app_debug"})
public final class DiccionarioRepositoryImpl implements com.signspeak.domain.repository.DiccionarioRepository {
    @org.jetbrains.annotations.NotNull()
    private final com.signspeak.data.remote.api.DiccionarioApi api = null;
    
    @javax.inject.Inject()
    public DiccionarioRepositoryImpl(@org.jetbrains.annotations.NotNull()
    com.signspeak.data.remote.api.DiccionarioApi api) {
        super();
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.Nullable()
    public java.lang.Object obtenerSenas(int pagina, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.util.Resource<java.util.List<com.signspeak.domain.model.Sena>>> $completion) {
        return null;
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.Nullable()
    public java.lang.Object obtenerCategorias(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.util.Resource<java.util.List<com.signspeak.domain.model.Categoria>>> $completion) {
        return null;
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.Nullable()
    public java.lang.Object buscarSenas(@org.jetbrains.annotations.NotNull()
    java.lang.String query, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.util.Resource<java.util.List<com.signspeak.domain.model.Sena>>> $completion) {
        return null;
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.Nullable()
    public java.lang.Object obtenerSenaPorId(long id, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.util.Resource<com.signspeak.domain.model.Sena>> $completion) {
        return null;
    }
}