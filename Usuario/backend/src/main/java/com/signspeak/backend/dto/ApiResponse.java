package com.signspeak.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;

    // Constructor para respuestas exitosas con datos
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(
                true,
                message,
                data,
                LocalDateTime.now()
        );
    }

    // Constructor para respuestas exitosas sin datos
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(
                true,
                message,
                null,
                LocalDateTime.now()
        );
    }

    // Constructor para respuestas de error
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(
                false,
                message,
                null,
                LocalDateTime.now()
        );
    }

    // Constructor para respuestas de error con datos adicionales
    public static <T> ApiResponse<T> error(String message, T data) {
        return new ApiResponse<>(
                false,
                message,
                data,
                LocalDateTime.now()
        );
    }
}