package com.signspeak.ui.screens.diccionario;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000X\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\u0002\n\u0002\b\u0003\n\u0002\u0010\u000e\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\u0003\b\u0007\u0018\u00002\u00020\u0001B\u001f\b\u0007\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u0012\u0006\u0010\u0006\u001a\u00020\u0007\u00a2\u0006\u0002\u0010\bJ\u0016\u0010\u0015\u001a\u00020\u00162\f\u0010\u0017\u001a\b\u0012\u0004\u0012\u00020\u00100\u000fH\u0002J\u0016\u0010\u0018\u001a\u00020\u00162\u0006\u0010\u0019\u001a\u00020\u001aH\u0082@\u00a2\u0006\u0002\u0010\u001bJ\b\u0010\u001c\u001a\u00020\u0016H\u0002J\u0010\u0010\u001d\u001a\u00020\u00162\b\u0010\u001e\u001a\u0004\u0018\u00010\u001fJ\u000e\u0010 \u001a\u00020\u00162\u0006\u0010!\u001a\u00020\u001aR\u0014\u0010\t\u001a\b\u0012\u0004\u0012\u00020\u000b0\nX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0004\u001a\u00020\u0005X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0010\u0010\f\u001a\u0004\u0018\u00010\rX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0006\u001a\u00020\u0007X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0014\u0010\u000e\u001a\b\u0012\u0004\u0012\u00020\u00100\u000fX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u0017\u0010\u0011\u001a\b\u0012\u0004\u0012\u00020\u000b0\u0012\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0013\u0010\u0014\u00a8\u0006\""}, d2 = {"Lcom/signspeak/ui/screens/diccionario/DiccionarioViewModel;", "Landroidx/lifecycle/ViewModel;", "getSenasUseCase", "Lcom/signspeak/domain/usecase/diccionario/GetSenasUseCase;", "getCategoriasUseCase", "Lcom/signspeak/domain/usecase/diccionario/GetCategoriasUseCase;", "searchSenasUseCase", "Lcom/signspeak/domain/usecase/diccionario/SearchSenasUseCase;", "(Lcom/signspeak/domain/usecase/diccionario/GetSenasUseCase;Lcom/signspeak/domain/usecase/diccionario/GetCategoriasUseCase;Lcom/signspeak/domain/usecase/diccionario/SearchSenasUseCase;)V", "_uiState", "Lkotlinx/coroutines/flow/MutableStateFlow;", "Lcom/signspeak/ui/screens/diccionario/DiccionarioUiState;", "searchJob", "Lkotlinx/coroutines/Job;", "senaCacheInicial", "", "Lcom/signspeak/domain/model/Sena;", "uiState", "Lkotlinx/coroutines/flow/StateFlow;", "getUiState", "()Lkotlinx/coroutines/flow/StateFlow;", "aplicarFiltrosLocales", "", "listaBase", "buscarEnApi", "query", "", "(Ljava/lang/String;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "cargarDatosIniciales", "onCategoriaSeleccionada", "categoria", "Lcom/signspeak/domain/model/Categoria;", "onSearchQueryChanged", "newQuery", "app_debug"})
@dagger.hilt.android.lifecycle.HiltViewModel()
public final class DiccionarioViewModel extends androidx.lifecycle.ViewModel {
    @org.jetbrains.annotations.NotNull()
    private final com.signspeak.domain.usecase.diccionario.GetSenasUseCase getSenasUseCase = null;
    @org.jetbrains.annotations.NotNull()
    private final com.signspeak.domain.usecase.diccionario.GetCategoriasUseCase getCategoriasUseCase = null;
    @org.jetbrains.annotations.NotNull()
    private final com.signspeak.domain.usecase.diccionario.SearchSenasUseCase searchSenasUseCase = null;
    @org.jetbrains.annotations.NotNull()
    private final kotlinx.coroutines.flow.MutableStateFlow<com.signspeak.ui.screens.diccionario.DiccionarioUiState> _uiState = null;
    @org.jetbrains.annotations.NotNull()
    private final kotlinx.coroutines.flow.StateFlow<com.signspeak.ui.screens.diccionario.DiccionarioUiState> uiState = null;
    @org.jetbrains.annotations.Nullable()
    private kotlinx.coroutines.Job searchJob;
    @org.jetbrains.annotations.NotNull()
    private java.util.List<com.signspeak.domain.model.Sena> senaCacheInicial;
    
    @javax.inject.Inject()
    public DiccionarioViewModel(@org.jetbrains.annotations.NotNull()
    com.signspeak.domain.usecase.diccionario.GetSenasUseCase getSenasUseCase, @org.jetbrains.annotations.NotNull()
    com.signspeak.domain.usecase.diccionario.GetCategoriasUseCase getCategoriasUseCase, @org.jetbrains.annotations.NotNull()
    com.signspeak.domain.usecase.diccionario.SearchSenasUseCase searchSenasUseCase) {
        super();
    }
    
    @org.jetbrains.annotations.NotNull()
    public final kotlinx.coroutines.flow.StateFlow<com.signspeak.ui.screens.diccionario.DiccionarioUiState> getUiState() {
        return null;
    }
    
    private final void cargarDatosIniciales() {
    }
    
    public final void onSearchQueryChanged(@org.jetbrains.annotations.NotNull()
    java.lang.String newQuery) {
    }
    
    public final void onCategoriaSeleccionada(@org.jetbrains.annotations.Nullable()
    com.signspeak.domain.model.Categoria categoria) {
    }
    
    private final void aplicarFiltrosLocales(java.util.List<com.signspeak.domain.model.Sena> listaBase) {
    }
    
    private final java.lang.Object buscarEnApi(java.lang.String query, kotlin.coroutines.Continuation<? super kotlin.Unit> $completion) {
        return null;
    }
}