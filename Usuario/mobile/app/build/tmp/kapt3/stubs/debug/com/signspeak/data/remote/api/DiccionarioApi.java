package com.signspeak.data.remote.api;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000R\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0000\n\u0002\u0010\b\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\t\n\u0002\b\u0002\n\u0002\u0010 \n\u0000\n\u0002\u0010\u000b\n\u0002\b\u0002\n\u0002\u0010$\n\u0002\b\f\bf\u0018\u00002\u00020\u0001J8\u0010\u0002\u001a\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\u00050\u00040\u00032\b\b\u0001\u0010\u0006\u001a\u00020\u00072\b\b\u0003\u0010\b\u001a\u00020\t2\b\b\u0003\u0010\n\u001a\u00020\tH\u00a7@\u00a2\u0006\u0002\u0010\u000bJ$\u0010\f\u001a\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\u00050\u00040\u00032\b\b\u0001\u0010\r\u001a\u00020\u000eH\u00a7@\u00a2\u0006\u0002\u0010\u000fJ\u001e\u0010\u0010\u001a\b\u0012\u0004\u0012\u00020\u00110\u00032\b\b\u0001\u0010\u0012\u001a\u00020\u0013H\u00a7@\u00a2\u0006\u0002\u0010\u0014J$\u0010\u0015\u001a\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\u00110\u00160\u00032\b\b\u0003\u0010\u0017\u001a\u00020\u0018H\u00a7@\u00a2\u0006\u0002\u0010\u0019J\"\u0010\u001a\u001a\u0016\u0012\u0012\u0012\u0010\u0012\u0004\u0012\u00020\u0007\u0012\u0006\u0012\u0004\u0018\u00010\u00010\u001b0\u0003H\u00a7@\u00a2\u0006\u0002\u0010\u001cJ\u001e\u0010\u001d\u001a\b\u0012\u0004\u0012\u00020\u00050\u00032\b\b\u0001\u0010\u0012\u001a\u00020\u0013H\u00a7@\u00a2\u0006\u0002\u0010\u0014J\u001e\u0010\u001e\u001a\b\u0012\u0004\u0012\u00020\u00050\u00032\b\b\u0001\u0010\u001f\u001a\u00020\u0007H\u00a7@\u00a2\u0006\u0002\u0010 J.\u0010!\u001a\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\u00050\u00040\u00032\b\b\u0003\u0010\b\u001a\u00020\t2\b\b\u0003\u0010\n\u001a\u00020\tH\u00a7@\u00a2\u0006\u0002\u0010\"J$\u0010#\u001a\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\u00050\u00160\u00032\b\b\u0003\u0010$\u001a\u00020\tH\u00a7@\u00a2\u0006\u0002\u0010%J$\u0010&\u001a\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\u00050\u00160\u00032\b\b\u0003\u0010$\u001a\u00020\tH\u00a7@\u00a2\u0006\u0002\u0010%\u00a8\u0006\'"}, d2 = {"Lcom/signspeak/data/remote/api/DiccionarioApi;", "", "buscarSenas", "Lcom/signspeak/data/remote/dto/diccionario/ApiResponse;", "Lcom/signspeak/data/remote/dto/diccionario/PageResponse;", "Lcom/signspeak/data/remote/dto/diccionario/DiccionarioSenaDTO;", "query", "", "pagina", "", "tamanoPagina", "(Ljava/lang/String;IILkotlin/coroutines/Continuation;)Ljava/lang/Object;", "filtrarSenas", "filtros", "Lcom/signspeak/data/remote/dto/diccionario/FiltrosDiccionarioRequest;", "(Lcom/signspeak/data/remote/dto/diccionario/FiltrosDiccionarioRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "obtenerCategoriaPorId", "Lcom/signspeak/data/remote/dto/diccionario/CategoriaSenaDTO;", "id", "", "(JLkotlin/coroutines/Continuation;)Ljava/lang/Object;", "obtenerCategorias", "", "soloActivas", "", "(ZLkotlin/coroutines/Continuation;)Ljava/lang/Object;", "obtenerEstadisticas", "", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "obtenerSenaPorId", "obtenerSenaPorNombre", "nombre", "(Ljava/lang/String;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "obtenerSenas", "(IILkotlin/coroutines/Continuation;)Ljava/lang/Object;", "obtenerSenasMasPracticadas", "limite", "(ILkotlin/coroutines/Continuation;)Ljava/lang/Object;", "obtenerSenasPopulares", "app_debug"})
public abstract interface DiccionarioApi {
    
    @retrofit2.http.GET(value = "api/diccionario/categorias")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object obtenerCategorias(@retrofit2.http.Query(value = "soloActivas")
    boolean soloActivas, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.data.remote.dto.diccionario.ApiResponse<java.util.List<com.signspeak.data.remote.dto.diccionario.CategoriaSenaDTO>>> $completion);
    
    @retrofit2.http.GET(value = "api/diccionario/categorias/{id}")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object obtenerCategoriaPorId(@retrofit2.http.Path(value = "id")
    long id, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.data.remote.dto.diccionario.ApiResponse<com.signspeak.data.remote.dto.diccionario.CategoriaSenaDTO>> $completion);
    
    @retrofit2.http.GET(value = "api/diccionario/senas")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object obtenerSenas(@retrofit2.http.Query(value = "pagina")
    int pagina, @retrofit2.http.Query(value = "tamanoPagina")
    int tamanoPagina, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.data.remote.dto.diccionario.ApiResponse<com.signspeak.data.remote.dto.diccionario.PageResponse<com.signspeak.data.remote.dto.diccionario.DiccionarioSenaDTO>>> $completion);
    
    @retrofit2.http.GET(value = "api/diccionario/senas/{id}")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object obtenerSenaPorId(@retrofit2.http.Path(value = "id")
    long id, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.data.remote.dto.diccionario.ApiResponse<com.signspeak.data.remote.dto.diccionario.DiccionarioSenaDTO>> $completion);
    
    @retrofit2.http.GET(value = "api/diccionario/senas/nombre/{nombre}")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object obtenerSenaPorNombre(@retrofit2.http.Path(value = "nombre")
    @org.jetbrains.annotations.NotNull()
    java.lang.String nombre, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.data.remote.dto.diccionario.ApiResponse<com.signspeak.data.remote.dto.diccionario.DiccionarioSenaDTO>> $completion);
    
    @retrofit2.http.GET(value = "api/diccionario/buscar")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object buscarSenas(@retrofit2.http.Query(value = "q")
    @org.jetbrains.annotations.NotNull()
    java.lang.String query, @retrofit2.http.Query(value = "pagina")
    int pagina, @retrofit2.http.Query(value = "tamanoPagina")
    int tamanoPagina, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.data.remote.dto.diccionario.ApiResponse<com.signspeak.data.remote.dto.diccionario.PageResponse<com.signspeak.data.remote.dto.diccionario.DiccionarioSenaDTO>>> $completion);
    
    @retrofit2.http.POST(value = "api/diccionario/filtrar")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object filtrarSenas(@retrofit2.http.Body()
    @org.jetbrains.annotations.NotNull()
    com.signspeak.data.remote.dto.diccionario.FiltrosDiccionarioRequest filtros, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.data.remote.dto.diccionario.ApiResponse<com.signspeak.data.remote.dto.diccionario.PageResponse<com.signspeak.data.remote.dto.diccionario.DiccionarioSenaDTO>>> $completion);
    
    @retrofit2.http.GET(value = "api/diccionario/populares")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object obtenerSenasPopulares(@retrofit2.http.Query(value = "limite")
    int limite, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.data.remote.dto.diccionario.ApiResponse<java.util.List<com.signspeak.data.remote.dto.diccionario.DiccionarioSenaDTO>>> $completion);
    
    @retrofit2.http.GET(value = "api/diccionario/mas-practicadas")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object obtenerSenasMasPracticadas(@retrofit2.http.Query(value = "limite")
    int limite, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.data.remote.dto.diccionario.ApiResponse<java.util.List<com.signspeak.data.remote.dto.diccionario.DiccionarioSenaDTO>>> $completion);
    
    @retrofit2.http.GET(value = "api/diccionario/estadisticas")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object obtenerEstadisticas(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.data.remote.dto.diccionario.ApiResponse<java.util.Map<java.lang.String, java.lang.Object>>> $completion);
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 3, xi = 48)
    public static final class DefaultImpls {
    }
}