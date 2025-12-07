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
public final class SearchSenasUseCase_Factory implements Factory<SearchSenasUseCase> {
  private final Provider<DiccionarioRepository> repositoryProvider;

  public SearchSenasUseCase_Factory(Provider<DiccionarioRepository> repositoryProvider) {
    this.repositoryProvider = repositoryProvider;
  }

  @Override
  public SearchSenasUseCase get() {
    return newInstance(repositoryProvider.get());
  }

  public static SearchSenasUseCase_Factory create(
      Provider<DiccionarioRepository> repositoryProvider) {
    return new SearchSenasUseCase_Factory(repositoryProvider);
  }

  public static SearchSenasUseCase newInstance(DiccionarioRepository repository) {
    return new SearchSenasUseCase(repository);
  }
}
