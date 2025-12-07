package com.signspeak.ui.screens.diccionario;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u00002\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\u000b\n\u0000\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0002\b\u0015\n\u0002\u0010\b\n\u0002\b\u0002\b\u0086\b\u0018\u00002\u00020\u0001BQ\u0012\b\b\u0002\u0010\u0002\u001a\u00020\u0003\u0012\u000e\b\u0002\u0010\u0004\u001a\b\u0012\u0004\u0012\u00020\u00060\u0005\u0012\u000e\b\u0002\u0010\u0007\u001a\b\u0012\u0004\u0012\u00020\b0\u0005\u0012\n\b\u0002\u0010\t\u001a\u0004\u0018\u00010\b\u0012\b\b\u0002\u0010\n\u001a\u00020\u000b\u0012\n\b\u0002\u0010\f\u001a\u0004\u0018\u00010\u000b\u00a2\u0006\u0002\u0010\rJ\t\u0010\u0017\u001a\u00020\u0003H\u00c6\u0003J\u000f\u0010\u0018\u001a\b\u0012\u0004\u0012\u00020\u00060\u0005H\u00c6\u0003J\u000f\u0010\u0019\u001a\b\u0012\u0004\u0012\u00020\b0\u0005H\u00c6\u0003J\u000b\u0010\u001a\u001a\u0004\u0018\u00010\bH\u00c6\u0003J\t\u0010\u001b\u001a\u00020\u000bH\u00c6\u0003J\u000b\u0010\u001c\u001a\u0004\u0018\u00010\u000bH\u00c6\u0003JU\u0010\u001d\u001a\u00020\u00002\b\b\u0002\u0010\u0002\u001a\u00020\u00032\u000e\b\u0002\u0010\u0004\u001a\b\u0012\u0004\u0012\u00020\u00060\u00052\u000e\b\u0002\u0010\u0007\u001a\b\u0012\u0004\u0012\u00020\b0\u00052\n\b\u0002\u0010\t\u001a\u0004\u0018\u00010\b2\b\b\u0002\u0010\n\u001a\u00020\u000b2\n\b\u0002\u0010\f\u001a\u0004\u0018\u00010\u000bH\u00c6\u0001J\u0013\u0010\u001e\u001a\u00020\u00032\b\u0010\u001f\u001a\u0004\u0018\u00010\u0001H\u00d6\u0003J\t\u0010 \u001a\u00020!H\u00d6\u0001J\t\u0010\"\u001a\u00020\u000bH\u00d6\u0001R\u0013\u0010\t\u001a\u0004\u0018\u00010\b\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000e\u0010\u000fR\u0017\u0010\u0007\u001a\b\u0012\u0004\u0012\u00020\b0\u0005\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0010\u0010\u0011R\u0013\u0010\f\u001a\u0004\u0018\u00010\u000b\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0012\u0010\u0013R\u0011\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0002\u0010\u0014R\u0011\u0010\n\u001a\u00020\u000b\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0015\u0010\u0013R\u0017\u0010\u0004\u001a\b\u0012\u0004\u0012\u00020\u00060\u0005\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0016\u0010\u0011\u00a8\u0006#"}, d2 = {"Lcom/signspeak/ui/screens/diccionario/DiccionarioUiState;", "", "isLoading", "", "senas", "", "Lcom/signspeak/domain/model/Sena;", "categorias", "Lcom/signspeak/domain/model/Categoria;", "categoriaSeleccionada", "query", "", "error", "(ZLjava/util/List;Ljava/util/List;Lcom/signspeak/domain/model/Categoria;Ljava/lang/String;Ljava/lang/String;)V", "getCategoriaSeleccionada", "()Lcom/signspeak/domain/model/Categoria;", "getCategorias", "()Ljava/util/List;", "getError", "()Ljava/lang/String;", "()Z", "getQuery", "getSenas", "component1", "component2", "component3", "component4", "component5", "component6", "copy", "equals", "other", "hashCode", "", "toString", "app_debug"})
public final class DiccionarioUiState {
    private final boolean isLoading = false;
    @org.jetbrains.annotations.NotNull()
    private final java.util.List<com.signspeak.domain.model.Sena> senas = null;
    @org.jetbrains.annotations.NotNull()
    private final java.util.List<com.signspeak.domain.model.Categoria> categorias = null;
    @org.jetbrains.annotations.Nullable()
    private final com.signspeak.domain.model.Categoria categoriaSeleccionada = null;
    @org.jetbrains.annotations.NotNull()
    private final java.lang.String query = null;
    @org.jetbrains.annotations.Nullable()
    private final java.lang.String error = null;
    
    public DiccionarioUiState(boolean isLoading, @org.jetbrains.annotations.NotNull()
    java.util.List<com.signspeak.domain.model.Sena> senas, @org.jetbrains.annotations.NotNull()
    java.util.List<com.signspeak.domain.model.Categoria> categorias, @org.jetbrains.annotations.Nullable()
    com.signspeak.domain.model.Categoria categoriaSeleccionada, @org.jetbrains.annotations.NotNull()
    java.lang.String query, @org.jetbrains.annotations.Nullable()
    java.lang.String error) {
        super();
    }
    
    public final boolean isLoading() {
        return false;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.List<com.signspeak.domain.model.Sena> getSenas() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.List<com.signspeak.domain.model.Categoria> getCategorias() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final com.signspeak.domain.model.Categoria getCategoriaSeleccionada() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.lang.String getQuery() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String getError() {
        return null;
    }
    
    public DiccionarioUiState() {
        super();
    }
    
    public final boolean component1() {
        return false;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.List<com.signspeak.domain.model.Sena> component2() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.List<com.signspeak.domain.model.Categoria> component3() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final com.signspeak.domain.model.Categoria component4() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.lang.String component5() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String component6() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.signspeak.ui.screens.diccionario.DiccionarioUiState copy(boolean isLoading, @org.jetbrains.annotations.NotNull()
    java.util.List<com.signspeak.domain.model.Sena> senas, @org.jetbrains.annotations.NotNull()
    java.util.List<com.signspeak.domain.model.Categoria> categorias, @org.jetbrains.annotations.Nullable()
    com.signspeak.domain.model.Categoria categoriaSeleccionada, @org.jetbrains.annotations.NotNull()
    java.lang.String query, @org.jetbrains.annotations.Nullable()
    java.lang.String error) {
        return null;
    }
    
    @java.lang.Override()
    public boolean equals(@org.jetbrains.annotations.Nullable()
    java.lang.Object other) {
        return false;
    }
    
    @java.lang.Override()
    public int hashCode() {
        return 0;
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.NotNull()
    public java.lang.String toString() {
        return null;
    }
}