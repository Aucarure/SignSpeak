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
public final class CreateConversacionUseCase_Factory implements Factory<CreateConversacionUseCase> {
  private final Provider<ConversacionRepository> repositoryProvider;

  public CreateConversacionUseCase_Factory(Provider<ConversacionRepository> repositoryProvider) {
    this.repositoryProvider = repositoryProvider;
  }

  @Override
  public CreateConversacionUseCase get() {
    return newInstance(repositoryProvider.get());
  }

  public static CreateConversacionUseCase_Factory create(
      Provider<ConversacionRepository> repositoryProvider) {
    return new CreateConversacionUseCase_Factory(repositoryProvider);
  }

  public static CreateConversacionUseCase newInstance(ConversacionRepository repository) {
    return new CreateConversacionUseCase(repository);
  }
}
