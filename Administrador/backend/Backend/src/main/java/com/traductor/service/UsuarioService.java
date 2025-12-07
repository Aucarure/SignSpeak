package com.traductor.service;

import com.traductor.model.Usuario;

public interface UsuarioService {
    public Usuario registrarUsuario(Usuario usuario);
    public Usuario obtenerUsuarioPorId(Long id);
}
