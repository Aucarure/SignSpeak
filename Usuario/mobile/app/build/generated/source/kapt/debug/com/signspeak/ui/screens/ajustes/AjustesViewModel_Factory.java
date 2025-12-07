package com.signspeak.ui.screens.ajustes;

import com.signspeak.data.local.SettingsManager;
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
public final class AjustesViewModel_Factory implements Factory<AjustesViewModel> {
  private final Provider<SettingsManager> settingsManagerProvider;

  public AjustesViewModel_Factory(Provider<SettingsManager> settingsManagerProvider) {
    this.settingsManagerProvider = settingsManagerProvider;
  }

  @Override
  public AjustesViewModel get() {
    return newInstance(settingsManagerProvider.get());
  }

  public static AjustesViewModel_Factory create(Provider<SettingsManager> settingsManagerProvider) {
    return new AjustesViewModel_Factory(settingsManagerProvider);
  }

  public static AjustesViewModel newInstance(SettingsManager settingsManager) {
    return new AjustesViewModel(settingsManager);
  }
}
