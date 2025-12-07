package com.signspeak.data.remote.dto.conversacion;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\f\n\u0002\u0018\u0002\n\u0002\u0010\u0010\n\u0002\b\u0007\b\u0086\u0081\u0002\u0018\u00002\b\u0012\u0004\u0012\u00020\u00000\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002j\u0002\b\u0003j\u0002\b\u0004j\u0002\b\u0005j\u0002\b\u0006j\u0002\b\u0007\u00a8\u0006\b"}, d2 = {"Lcom/signspeak/data/remote/dto/conversacion/TipoMensaje;", "", "(Ljava/lang/String;I)V", "TEXTO_USUARIO", "SENA_DETECTADA", "TRADUCCION_A_TEXTO", "SISTEMA", "ERROR", "app_debug"})
public enum TipoMensaje {
    @com.google.gson.annotations.SerializedName(value = "TEXTO_USUARIO")
    /*public static final*/ TEXTO_USUARIO /* = new TEXTO_USUARIO() */,
    @com.google.gson.annotations.SerializedName(value = "SENA_DETECTADA")
    /*public static final*/ SENA_DETECTADA /* = new SENA_DETECTADA() */,
    @com.google.gson.annotations.SerializedName(value = "TRADUCCION_A_TEXTO")
    /*public static final*/ TRADUCCION_A_TEXTO /* = new TRADUCCION_A_TEXTO() */,
    @com.google.gson.annotations.SerializedName(value = "SISTEMA")
    /*public static final*/ SISTEMA /* = new SISTEMA() */,
    @com.google.gson.annotations.SerializedName(value = "ERROR")
    /*public static final*/ ERROR /* = new ERROR() */;
    
    TipoMensaje() {
    }
    
    @org.jetbrains.annotations.NotNull()
    public static kotlin.enums.EnumEntries<com.signspeak.data.remote.dto.conversacion.TipoMensaje> getEntries() {
        return null;
    }
}