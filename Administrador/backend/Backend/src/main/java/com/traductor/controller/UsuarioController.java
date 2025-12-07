package com.traductor.controller;

import com.traductor.model.Usuario;
import com.traductor.service.UsuarioServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;  // 👈 Importar List

@RestController
@RequestMapping(path = "/api/v1/usuarios")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})  // 👈 AGREGAR ESTO
public class UsuarioController {

    private final UsuarioServiceImpl usuarioServiceImpl;

    @Autowired
    public UsuarioController(UsuarioServiceImpl usuarioServiceImpl) {
        this.usuarioServiceImpl = usuarioServiceImpl;
    }

    // 👇 AGREGAR ESTE MÉTODO
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioServiceImpl.listarUsuarios();
    }

    @PostMapping
    public Usuario registrarNuevoUsuario(@RequestBody Usuario usuario) {
        return usuarioServiceImpl.registrarUsuario(usuario);
    }

    @GetMapping(path = "/{id}")
    public Usuario obtenerUsuario(@PathVariable("id") Long id) {
        return usuarioServiceImpl.obtenerUsuarioPorId(id);
    }
}