package com.traductor.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TraduccionRequest {
    private String entrada;
    private Long idUsuario;
    private String tipoTraduccion;
    private String mensaje;
    private String idiomaSenias;
    private String urlVoz;

    public TraduccionRequest() {
    }
}
