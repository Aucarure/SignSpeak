package com.signspeak.domain.usecase.diccionario;

import com.signspeak.domain.repository.DiccionarioRepository;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

@ScopeMetadata
@QualifierMetadata
@DaggerGenerated
@Generated(
    value = "dagger.internal.codegen.ComponentProcessor",
    comments = "https://dagger.dev"
)
@SuppressWarnings({
    "unchecked",
    "rawtypes",
    "KotlinInternal",
    "KotlinInternalInJava"
})
public final class GetSenasUseCase_Factory implements Factory<GetSenasUseCase> {
  private final Provider<DiccionarioRepository> repositoryProvider;

  public GetSenasUseCase_Factory(Provider<DiccionarioRepository> repositoryProvider) {
    this.repositoryProvider = repositoryProvider;
  }

  @Override
  public GetSenasUseCase get() {
    return newInstance(repositoryProvider.get());
  }

  public static GetSenasUseCase_Factory create(Provider<DiccionarioRepository> repositoryProvider) {
    return new GetSenasUseCase_Factory(repositoryProvider);
  }

  public static GetSenasUseCase newInstance(DiccionarioRepository repository) {
    return new GetSenasUseCase(repository);
  }
}
