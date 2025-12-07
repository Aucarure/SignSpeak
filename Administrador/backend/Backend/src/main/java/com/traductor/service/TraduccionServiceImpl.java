package com.traductor.service;

import com.traductor.dto.TraduccionRequest;
import com.traductor.model.Traduccion;
import com.traductor.repository.TraduccionRepository;
import com.traductor.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TraduccionServiceImpl implements TraduccionService {
    private final TraduccionRepository traduccionRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    public String procesarTraduccion(String texto, Long idUsuario) {
        var usuario = usuarioRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new RuntimeException("No hay usuarios registrados"));

        Traduccion traduccion = new Traduccion();
        traduccion.setUsuario(usuario);
        traduccion.setEntrada(texto);
        traduccion.setSalida("🤟 (Traducción simulada de texto simple)");
        traduccion.setTipoTraduccion("texto-a-senias");
        traduccion.setFechaTraduccion(LocalDateTime.now());

        traduccionRepository.save(traduccion);
        return traduccion.getSalida();
    }

    @Override
    public String procesarTraduccion(TraduccionRequest request) {
        var usuario = usuarioRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new RuntimeException("No hay usuarios registrados"));

        Traduccion traduccion = new Traduccion();
        traduccion.setUsuario(usuario);
        traduccion.setEntrada(request.getEntrada());
        traduccion.setTipoTraduccion(request.getTipoTraduccion());

        // Lógica simple de simulación según tipo de traducción
        String salida;
        switch (request.getTipoTraduccion()) {
            case "texto-a-senias":
                salida = "🤟 Traducción de texto a señas: " + request.getEntrada();
                break;
            case "voz-a-senias":
                salida = "🎤 Traducción de voz a señas: " + request.getEntrada();
                break;
            case "senias-a-texto":
                salida = "📝 Texto traducido desde señas: " + request.getEntrada();
                break;
            case "senias-a-voz":
                salida = "🔊 Voz generada desde señas: " + request.getEntrada();
                break;
            default:
                salida = "⚠️ Tipo de traducción no reconocido";
        }

        traduccion.setSalida(salida);
        traduccion.setFechaTraduccion(LocalDateTime.now());

        traduccionRepository.save(traduccion);
        return salida;
    }

    @Override
    public List<Traduccion> obtenerHistorialPorUsuario(Long idUsuario) {
        return traduccionRepository.findByUsuario_IdUsuarioOrderByFechaTraduccionDesc(idUsuario);
    }
}
