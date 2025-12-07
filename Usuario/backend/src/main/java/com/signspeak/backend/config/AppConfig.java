package com.signspeak.backend.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        // Configuraciones personalizadas si son necesarias
        modelMapper.getConfiguration()
                .setSkipNullEnabled(true)
                .setAmbiguityIgnored(true);

        return modelMapper;
    }
}