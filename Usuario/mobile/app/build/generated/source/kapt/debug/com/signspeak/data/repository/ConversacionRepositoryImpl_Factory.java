package com.signspeak.data.repository;

import com.signspeak.data.remote.api.ConversacionApi;
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
public final class ConversacionRepositoryImpl_Factory implements Factory<ConversacionRepositoryImpl> {
  private final Provider<ConversacionApi> apiProvider;

  public ConversacionRepositoryImpl_Factory(Provider<ConversacionApi> apiProvider) {
    this.apiProvider = apiProvider;
  }

  @Override
  public ConversacionRepositoryImpl get() {
    return newInstance(apiProvider.get());
  }

  public static ConversacionRepositoryImpl_Factory create(Provider<ConversacionApi> apiProvider) {
    return new ConversacionRepositoryImpl_Factory(apiProvider);
  }

  public static ConversacionRepositoryImpl newInstance(ConversacionApi api) {
    return new ConversacionRepositoryImpl(api);
  }
}
