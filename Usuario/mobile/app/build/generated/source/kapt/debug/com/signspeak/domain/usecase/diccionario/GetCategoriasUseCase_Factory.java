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
public final class GetCategoriasUseCase_Factory implements Factory<GetCategoriasUseCase> {
  private final Provider<DiccionarioRepository> repositoryProvider;

  public GetCategoriasUseCase_Factory(Provider<DiccionarioRepository> repositoryProvider) {
    this.repositoryProvider = repositoryProvider;
  }

  @Override
  public GetCategoriasUseCase get() {
    return newInstance(repositoryProvider.get());
  }

  public static GetCategoriasUseCase_Factory create(
      Provider<DiccionarioRepository> repositoryProvider) {
    return new GetCategoriasUseCase_Factory(repositoryProvider);
  }

  public static GetCategoriasUseCase newInstance(DiccionarioRepository repository) {
    return new GetCategoriasUseCase(repository);
  }
}
