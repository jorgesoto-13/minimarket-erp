package com.minimarket.controller;

import com.minimarket.model.Usuario;
import com.minimarket.repository.UsuarioRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = {"http://localhost:4200", "https://minimarket-erp.vercel.app"})
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // GET todos los usuarios (solo muestra id, username y rol — nunca la contraseña)
    @GetMapping
    public List<Map<String, Object>> listar() {
        return usuarioRepository.findAll().stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "username", u.getUsername(),
                        "rol", u.getRol() != null ? u.getRol().name() : "VENDEDOR"
                ))
                .toList();
    }

    // DELETE eliminar un usuario (un admin no puede eliminarse a sí mismo — eso se valida en el frontend)
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        usuarioRepository.deleteById(id);
    }
}
