package com.signspeak.di;

import com.signspeak.data.remote.api.ConversacionApi;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.Preconditions;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;
import retrofit2.Retrofit;

@ScopeMetadata("javax.inject.Singleton")
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
public final class NetworkModule_ProvideConversacionApiFactory implements Factory<ConversacionApi> {
  private final Provider<Retrofit> retrofitProvider;

  public NetworkModule_ProvideConversacionApiFactory(Provider<Retrofit> retrofitProvider) {
    this.retrofitProvider = retrofitProvider;
  }

  @Override
  public ConversacionApi get() {
    return provideConversacionApi(retrofitProvider.get());
  }

  public static NetworkModule_ProvideConversacionApiFactory create(
      Provider<Retrofit> retrofitProvider) {
    return new NetworkModule_ProvideConversacionApiFactory(retrofitProvider);
  }

  public static ConversacionApi provideConversacionApi(Retrofit retrofit) {
    return Preconditions.checkNotNullFromProvides(NetworkModule.INSTANCE.provideConversacionApi(retrofit));
  }
}
