package com.signspeak.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinalizarConversacionRequest {

    private Boolean guardar = false;

    private String resumenConversacion;  // ✅ AGREGADO
}