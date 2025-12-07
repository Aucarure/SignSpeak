package com.signspeak.ui.screens.conversacion;

import com.signspeak.domain.repository.ConversacionRepository;
import com.signspeak.domain.usecase.conversacion.SendMessageUseCase;
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
public final class ChatViewModel_Factory implements Factory<ChatViewModel> {
  private final Provider<SendMessageUseCase> sendMessageUseCaseProvider;

  private final Provider<ConversacionRepository> repositoryProvider;

  public ChatViewModel_Factory(Provider<SendMessageUseCase> sendMessageUseCaseProvider,
      Provider<ConversacionRepository> repositoryProvider) {
    this.sendMessageUseCaseProvider = sendMessageUseCaseProvider;
    this.repositoryProvider = repositoryProvider;
  }

  @Override
  public ChatViewModel get() {
    return newInstance(sendMessageUseCaseProvider.get(), repositoryProvider.get());
  }

  public static ChatViewModel_Factory create(
      Provider<SendMessageUseCase> sendMessageUseCaseProvider,
      Provider<ConversacionRepository> repositoryProvider) {
    return new ChatViewModel_Factory(sendMessageUseCaseProvider, repositoryProvider);
  }

  public static ChatViewModel newInstance(SendMessageUseCase sendMessageUseCase,
      ConversacionRepository repository) {
    return new ChatViewModel(sendMessageUseCase, repository);
  }
}
