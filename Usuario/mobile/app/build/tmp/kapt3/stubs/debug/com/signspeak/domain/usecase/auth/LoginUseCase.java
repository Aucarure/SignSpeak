package com.signspeak.domain.usecase.auth;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000(\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0002\u0018\u00002\u00020\u0001B\u000f\b\u0007\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004J%\u0010\u0005\u001a\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\b0\u00070\u00062\u0006\u0010\t\u001a\u00020\n2\u0006\u0010\u000b\u001a\u00020\nH\u0086\u0002R\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\f"}, d2 = {"Lcom/signspeak/domain/usecase/auth/LoginUseCase;", "", "repository", "Lcom/signspeak/domain/repository/AuthRepository;", "(Lcom/signspeak/domain/repository/AuthRepository;)V", "invoke", "Lkotlinx/coroutines/flow/Flow;", "Lcom/signspeak/util/Resource;", "Lcom/signspeak/domain/model/Usuario;", "email", "", "password", "app_debug"})
public final class LoginUseCase {
    @org.jetbrains.annotations.NotNull()
    private final com.signspeak.domain.repository.AuthRepository repository = null;
    
    @javax.inject.Inject()
    public LoginUseCase(@org.jetbrains.annotations.NotNull()
    com.signspeak.domain.repository.AuthRepository repository) {
        super();
    }
    
    @org.jetbrains.annotations.NotNull()
    public final kotlinx.coroutines.flow.Flow<com.signspeak.util.Resource<com.signspeak.domain.model.Usuario>> invoke(@org.jetbrains.annotations.NotNull()
    java.lang.String email, @org.jetbrains.annotations.NotNull()
    java.lang.String password) {
        return null;
    }
}