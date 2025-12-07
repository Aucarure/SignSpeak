package com.signspeak.domain.usecase.conversacion;

import com.signspeak.domain.repository.ConversacionRepository;
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
public final class GetConversacionUseCase_Factory implements Factory<GetConversacionUseCase> {
  private final Provider<ConversacionRepository> repositoryProvider;

  public GetConversacionUseCase_Factory(Provider<ConversacionRepository> repositoryProvider) {
    this.repositoryProvider = repositoryProvider;
  }

  @Override
  public GetConversacionUseCase get() {
    return newInstance(repositoryProvider.get());
  }

  public static GetConversacionUseCase_Factory create(
      Provider<ConversacionRepository> repositoryProvider) {
    return new GetConversacionUseCase_Factory(repositoryProvider);
  }

  public static GetConversacionUseCase newInstance(ConversacionRepository repository) {
    return new GetConversacionUseCase(repository);
  }
}
