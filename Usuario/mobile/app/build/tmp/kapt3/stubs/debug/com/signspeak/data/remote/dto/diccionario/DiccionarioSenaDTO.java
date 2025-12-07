package com.signspeak.data.remote.dto.diccionario;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u00000\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\t\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0010\b\n\u0002\b\u0004\n\u0002\u0010\u000b\n\u0002\b&\b\u0086\b\u0018\u00002\u00020\u0001Bw\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u0012\b\u0010\u0006\u001a\u0004\u0018\u00010\u0005\u0012\b\u0010\u0007\u001a\u0004\u0018\u00010\b\u0012\b\u0010\t\u001a\u0004\u0018\u00010\u0005\u0012\b\u0010\n\u001a\u0004\u0018\u00010\u0005\u0012\b\u0010\u000b\u001a\u0004\u0018\u00010\u0005\u0012\b\u0010\f\u001a\u0004\u0018\u00010\r\u0012\b\u0010\u000e\u001a\u0004\u0018\u00010\u0005\u0012\b\u0010\u000f\u001a\u0004\u0018\u00010\r\u0012\b\u0010\u0010\u001a\u0004\u0018\u00010\r\u0012\u0006\u0010\u0011\u001a\u00020\u0012\u00a2\u0006\u0002\u0010\u0013J\t\u0010&\u001a\u00020\u0003H\u00c6\u0003J\u0010\u0010\'\u001a\u0004\u0018\u00010\rH\u00c6\u0003\u00a2\u0006\u0002\u0010\u001cJ\u0010\u0010(\u001a\u0004\u0018\u00010\rH\u00c6\u0003\u00a2\u0006\u0002\u0010\u001cJ\t\u0010)\u001a\u00020\u0012H\u00c6\u0003J\t\u0010*\u001a\u00020\u0005H\u00c6\u0003J\u000b\u0010+\u001a\u0004\u0018\u00010\u0005H\u00c6\u0003J\u000b\u0010,\u001a\u0004\u0018\u00010\bH\u00c6\u0003J\u000b\u0010-\u001a\u0004\u0018\u00010\u0005H\u00c6\u0003J\u000b\u0010.\u001a\u0004\u0018\u00010\u0005H\u00c6\u0003J\u000b\u0010/\u001a\u0004\u0018\u00010\u0005H\u00c6\u0003J\u0010\u00100\u001a\u0004\u0018\u00010\rH\u00c6\u0003\u00a2\u0006\u0002\u0010\u001cJ\u000b\u00101\u001a\u0004\u0018\u00010\u0005H\u00c6\u0003J\u0098\u0001\u00102\u001a\u00020\u00002\b\b\u0002\u0010\u0002\u001a\u00020\u00032\b\b\u0002\u0010\u0004\u001a\u00020\u00052\n\b\u0002\u0010\u0006\u001a\u0004\u0018\u00010\u00052\n\b\u0002\u0010\u0007\u001a\u0004\u0018\u00010\b2\n\b\u0002\u0010\t\u001a\u0004\u0018\u00010\u00052\n\b\u0002\u0010\n\u001a\u0004\u0018\u00010\u00052\n\b\u0002\u0010\u000b\u001a\u0004\u0018\u00010\u00052\n\b\u0002\u0010\f\u001a\u0004\u0018\u00010\r2\n\b\u0002\u0010\u000e\u001a\u0004\u0018\u00010\u00052\n\b\u0002\u0010\u000f\u001a\u0004\u0018\u00010\r2\n\b\u0002\u0010\u0010\u001a\u0004\u0018\u00010\r2\b\b\u0002\u0010\u0011\u001a\u00020\u0012H\u00c6\u0001\u00a2\u0006\u0002\u00103J\u0013\u00104\u001a\u00020\u00122\b\u00105\u001a\u0004\u0018\u00010\u0001H\u00d6\u0003J\t\u00106\u001a\u00020\rH\u00d6\u0001J\t\u00107\u001a\u00020\u0005H\u00d6\u0001R\u0011\u0010\u0011\u001a\u00020\u0012\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0014\u0010\u0015R\u0013\u0010\u0007\u001a\u0004\u0018\u00010\b\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0016\u0010\u0017R\u0013\u0010\u0006\u001a\u0004\u0018\u00010\u0005\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0018\u0010\u0019R\u0013\u0010\u000e\u001a\u0004\u0018\u00010\u0005\u00a2\u0006\b\n\u0000\u001a\u0004\b\u001a\u0010\u0019R\u0015\u0010\f\u001a\u0004\u0018\u00010\r\u00a2\u0006\n\n\u0002\u0010\u001d\u001a\u0004\b\u001b\u0010\u001cR\u0011\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u001e\u0010\u001fR\u0011\u0010\u0004\u001a\u00020\u0005\u00a2\u0006\b\n\u0000\u001a\u0004\b \u0010\u0019R\u0015\u0010\u000f\u001a\u0004\u0018\u00010\r\u00a2\u0006\n\n\u0002\u0010\u001d\u001a\u0004\b!\u0010\u001cR\u0013\u0010\u000b\u001a\u0004\u0018\u00010\u0005\u00a2\u0006\b\n\u0000\u001a\u0004\b\"\u0010\u0019R\u0013\u0010\n\u001a\u0004\u0018\u00010\u0005\u00a2\u0006\b\n\u0000\u001a\u0004\b#\u0010\u0019R\u0013\u0010\t\u001a\u0004\u0018\u00010\u0005\u00a2\u0006\b\n\u0000\u001a\u0004\b$\u0010\u0019R\u0015\u0010\u0010\u001a\u0004\u0018\u00010\r\u00a2\u0006\n\n\u0002\u0010\u001d\u001a\u0004\b%\u0010\u001c\u00a8\u00068"}, d2 = {"Lcom/signspeak/data/remote/dto/diccionario/DiccionarioSenaDTO;", "", "idSena", "", "nombre", "", "descripcion", "categoria", "Lcom/signspeak/data/remote/dto/diccionario/CategoriaSenaDTO;", "urlVideo", "urlImagen", "urlAnimacion", "duracionVideoSegundos", "", "dificultad", "popularidad", "vecesPracticada", "activo", "", "(JLjava/lang/String;Ljava/lang/String;Lcom/signspeak/data/remote/dto/diccionario/CategoriaSenaDTO;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/Integer;Ljava/lang/String;Ljava/lang/Integer;Ljava/lang/Integer;Z)V", "getActivo", "()Z", "getCategoria", "()Lcom/signspeak/data/remote/dto/diccionario/CategoriaSenaDTO;", "getDescripcion", "()Ljava/lang/String;", "getDificultad", "getDuracionVideoSegundos", "()Ljava/lang/Integer;", "Ljava/lang/Integer;", "getIdSena", "()J", "getNombre", "getPopularidad", "getUrlAnimacion", "getUrlImagen", "getUrlVideo", "getVecesPracticada", "component1", "component10", "component11", "component12", "component2", "component3", "component4", "component5", "component6", "component7", "component8", "component9", "copy", "(JLjava/lang/String;Ljava/lang/String;Lcom/signspeak/data/remote/dto/diccionario/CategoriaSenaDTO;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/Integer;Ljava/lang/String;Ljava/lang/Integer;Ljava/lang/Integer;Z)Lcom/signspeak/data/remote/dto/diccionario/DiccionarioSenaDTO;", "equals", "other", "hashCode", "toString", "app_debug"})
public final class DiccionarioSenaDTO {
    private final long idSena = 0L;
    @org.jetbrains.annotations.NotNull()
    private final java.lang.String nombre = null;
    @org.jetbrains.annotations.Nullable()
    private final java.lang.String descripcion = null;
    @org.jetbrains.annotations.Nullable()
    private final com.signspeak.data.remote.dto.diccionario.CategoriaSenaDTO categoria = null;
    @org.jetbrains.annotations.Nullable()
    private final java.lang.String urlVideo = null;
    @org.jetbrains.annotations.Nullable()
    private final java.lang.String urlImagen = null;
    @org.jetbrains.annotations.Nullable()
    private final java.lang.String urlAnimacion = null;
    @org.jetbrains.annotations.Nullable()
    private final java.lang.Integer duracionVideoSegundos = null;
    @org.jetbrains.annotations.Nullable()
    private final java.lang.String dificultad = null;
    @org.jetbrains.annotations.Nullable()
    private final java.lang.Integer popularidad = null;
    @org.jetbrains.annotations.Nullable()
    private final java.lang.Integer vecesPracticada = null;
    private final boolean activo = false;
    
    public DiccionarioSenaDTO(long idSena, @org.jetbrains.annotations.NotNull()
    java.lang.String nombre, @org.jetbrains.annotations.Nullable()
    java.lang.String descripcion, @org.jetbrains.annotations.Nullable()
    com.signspeak.data.remote.dto.diccionario.CategoriaSenaDTO categoria, @org.jetbrains.annotations.Nullable()
    java.lang.String urlVideo, @org.jetbrains.annotations.Nullable()
    java.lang.String urlImagen, @org.jetbrains.annotations.Nullable()
    java.lang.String urlAnimacion, @org.jetbrains.annotations.Nullable()
    java.lang.Integer duracionVideoSegundos, @org.jetbrains.annotations.Nullable()
    java.lang.String dificultad, @org.jetbrains.annotations.Nullable()
    java.lang.Integer popularidad, @org.jetbrains.annotations.Nullable()
    java.lang.Integer vecesPracticada, boolean activo) {
        super();
    }
    
    public final long getIdSena() {
        return 0L;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.lang.String getNombre() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String getDescripcion() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final com.signspeak.data.remote.dto.diccionario.CategoriaSenaDTO getCategoria() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String getUrlVideo() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String getUrlImagen() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String getUrlAnimacion() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Integer getDuracionVideoSegundos() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String getDificultad() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Integer getPopularidad() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Integer getVecesPracticada() {
        return null;
    }
    
    public final boolean getActivo() {
        return false;
    }
    
    public final long component1() {
        return 0L;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Integer component10() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Integer component11() {
        return null;
    }
    
    public final boolean component12() {
        return false;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.lang.String component2() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String component3() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final com.signspeak.data.remote.dto.diccionario.CategoriaSenaDTO component4() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String component5() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String component6() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String component7() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Integer component8() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String component9() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.signspeak.data.remote.dto.diccionario.DiccionarioSenaDTO copy(long idSena, @org.jetbrains.annotations.NotNull()
    java.lang.String nombre, @org.jetbrains.annotations.Nullable()
    java.lang.String descripcion, @org.jetbrains.annotations.Nullable()
    com.signspeak.data.remote.dto.diccionario.CategoriaSenaDTO categoria, @org.jetbrains.annotations.Nullable()
    java.lang.String urlVideo, @org.jetbrains.annotations.Nullable()
    java.lang.String urlImagen, @org.jetbrains.annotations.Nullable()
    java.lang.String urlAnimacion, @org.jetbrains.annotations.Nullable()
    java.lang.Integer duracionVideoSegundos, @org.jetbrains.annotations.Nullable()
    java.lang.String dificultad, @org.jetbrains.annotations.Nullable()
    java.lang.Integer popularidad, @org.jetbrains.annotations.Nullable()
    java.lang.Integer vecesPracticada, boolean activo) {
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