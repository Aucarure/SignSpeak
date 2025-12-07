package com.signspeak.data.repository;

import com.signspeak.data.remote.api.DiccionarioApi;
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
public final class DiccionarioRepositoryImpl_Factory implements Factory<DiccionarioRepositoryImpl> {
  private final Provider<DiccionarioApi> apiProvider;

  public DiccionarioRepositoryImpl_Factory(Provider<DiccionarioApi> apiProvider) {
    this.apiProvider = apiProvider;
  }

  @Override
  public DiccionarioRepositoryImpl get() {
    return newInstance(apiProvider.get());
  }

  public static DiccionarioRepositoryImpl_Factory create(Provider<DiccionarioApi> apiProvider) {
    return new DiccionarioRepositoryImpl_Factory(apiProvider);
  }

  public static DiccionarioRepositoryImpl newInstance(DiccionarioApi api) {
    return new DiccionarioRepositoryImpl(api);
  }
}
