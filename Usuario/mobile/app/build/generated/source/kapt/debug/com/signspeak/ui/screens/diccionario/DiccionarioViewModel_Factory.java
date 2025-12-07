package com.signspeak.ui.screens.diccionario;

import com.signspeak.domain.usecase.diccionario.GetCategoriasUseCase;
import com.signspeak.domain.usecase.diccionario.GetSenasUseCase;
import com.signspeak.domain.usecase.diccionario.SearchSenasUseCase;
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
public final class DiccionarioViewModel_Factory implements Factory<DiccionarioViewModel> {
  private final Provider<GetSenasUseCase> getSenasUseCaseProvider;

  private final Provider<GetCategoriasUseCase> getCategoriasUseCaseProvider;

  private final Provider<SearchSenasUseCase> searchSenasUseCaseProvider;

  public DiccionarioViewModel_Factory(Provider<GetSenasUseCase> getSenasUseCaseProvider,
      Provider<GetCategoriasUseCase> getCategoriasUseCaseProvider,
      Provider<SearchSenasUseCase> searchSenasUseCaseProvider) {
    this.getSenasUseCaseProvider = getSenasUseCaseProvider;
    this.getCategoriasUseCaseProvider = getCategoriasUseCaseProvider;
    this.searchSenasUseCaseProvider = searchSenasUseCaseProvider;
  }

  @Override
  public DiccionarioViewModel get() {
    return newInstance(getSenasUseCaseProvider.get(), getCategoriasUseCaseProvider.get(), searchSenasUseCaseProvider.get());
  }

  public static DiccionarioViewModel_Factory create(
      Provider<GetSenasUseCase> getSenasUseCaseProvider,
      Provider<GetCategoriasUseCase> getCategoriasUseCaseProvider,
      Provider<SearchSenasUseCase> searchSenasUseCaseProvider) {
    return new DiccionarioViewModel_Factory(getSenasUseCaseProvider, getCategoriasUseCaseProvider, searchSenasUseCaseProvider);
  }

  public static DiccionarioViewModel newInstance(GetSenasUseCase getSenasUseCase,
      GetCategoriasUseCase getCategoriasUseCase, SearchSenasUseCase searchSenasUseCase) {
    return new DiccionarioViewModel(getSenasUseCase, getCategoriasUseCase, searchSenasUseCase);
  }
}
