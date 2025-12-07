package com.signspeak.di

import com.signspeak.data.repository.AuthRepositoryImpl
import com.signspeak.data.repository.ConversacionRepositoryImpl
import com.signspeak.data.repository.DiccionarioRepositoryImpl
import com.signspeak.domain.repository.AuthRepository
import com.signspeak.domain.repository.ConversacionRepository
import com.signspeak.domain.repository.DiccionarioRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindDiccionarioRepository(
        diccionarioRepositoryImpl: DiccionarioRepositoryImpl
    ): DiccionarioRepository

    @Binds
    @Singleton
    abstract fun bindAuthRepository(
        authRepositoryImpl: AuthRepositoryImpl
    ): AuthRepository

    @Binds
    @Singleton
    abstract fun bindConversacionRepository(
        conversacionRepositoryImpl: ConversacionRepositoryImpl
    ): ConversacionRepository
}