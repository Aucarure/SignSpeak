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
public final class SendMessageUseCase_Factory implements Factory<SendMessageUseCase> {
  private final Provider<ConversacionRepository> repositoryProvider;

  public SendMessageUseCase_Factory(Provider<ConversacionRepository> repositoryProvider) {
    this.repositoryProvider = repositoryProvider;
  }

  @Override
  public SendMessageUseCase get() {
    return newInstance(repositoryProvider.get());
  }

  public static SendMessageUseCase_Factory create(
      Provider<ConversacionRepository> repositoryProvider) {
    return new SendMessageUseCase_Factory(repositoryProvider);
  }

  public static SendMessageUseCase newInstance(ConversacionRepository repository) {
    return new SendMessageUseCase(repository);
  }
}
