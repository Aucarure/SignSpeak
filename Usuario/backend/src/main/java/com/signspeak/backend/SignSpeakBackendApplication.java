package com.signspeak.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SignSpeakBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SignSpeakBackendApplication.class, args);
        System.out.println("=========================================");
        System.out.println("✅ SignSpeak Backend Iniciado Correctamente");
        System.out.println("🌐 Servidor corriendo en: http://localhost:8081");
        System.out.println("📚 API Docs: http://localhost:8081/api/conversaciones");
        System.out.println("=========================================");
    }
}