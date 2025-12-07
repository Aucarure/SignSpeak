package com.signspeak.data.remote.api;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000(\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\bf\u0018\u00002\u00020\u0001J\u0018\u0010\u0002\u001a\u00020\u00032\b\b\u0001\u0010\u0004\u001a\u00020\u0005H\u00a7@\u00a2\u0006\u0002\u0010\u0006J\u000e\u0010\u0007\u001a\u00020\bH\u00a7@\u00a2\u0006\u0002\u0010\tJ\u0018\u0010\n\u001a\u00020\u00032\b\b\u0001\u0010\u0004\u001a\u00020\u000bH\u00a7@\u00a2\u0006\u0002\u0010\fJ\u000e\u0010\r\u001a\u00020\bH\u00a7@\u00a2\u0006\u0002\u0010\t\u00a8\u0006\u000e"}, d2 = {"Lcom/signspeak/data/remote/api/AuthApi;", "", "login", "Lcom/signspeak/data/remote/dto/auth/AuthResponse;", "request", "Lcom/signspeak/data/remote/dto/auth/LoginRequest;", "(Lcom/signspeak/data/remote/dto/auth/LoginRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "logout", "", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "register", "Lcom/signspeak/data/remote/dto/auth/RegisterRequest;", "(Lcom/signspeak/data/remote/dto/auth/RegisterRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "validateToken", "app_debug"})
public abstract interface AuthApi {
    
    @retrofit2.http.POST(value = "api/auth/login")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object login(@retrofit2.http.Body()
    @org.jetbrains.annotations.NotNull()
    com.signspeak.data.remote.dto.auth.LoginRequest request, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.data.remote.dto.auth.AuthResponse> $completion);
    
    @retrofit2.http.POST(value = "api/auth/register")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object register(@retrofit2.http.Body()
    @org.jetbrains.annotations.NotNull()
    com.signspeak.data.remote.dto.auth.RegisterRequest request, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.signspeak.data.remote.dto.auth.AuthResponse> $completion);
    
    @retrofit2.http.POST(value = "api/auth/logout")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object logout(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super kotlin.Unit> $completion);
    
    @retrofit2.http.GET(value = "api/auth/validate")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object validateToken(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super kotlin.Unit> $completion);
}