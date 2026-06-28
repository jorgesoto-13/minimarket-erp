package com.minimarket.controller;

import com.minimarket.config.JwtUtil;
import com.minimarket.model.Usuario;
import com.minimarket.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // Inyectamos las tres herramientas que necesitamos
    public AuthController(JwtUtil jwtUtil, UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.jwtUtil = jwtUtil;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 1. MÉTODO DE REGISTRO (Para crear usuarios; por defecto el rol es VENDEDOR)
    @PostMapping("/registro")
    public String registrar(@RequestBody Usuario nuevoUsuario) {
        // Si no se especifica un rol, asumimos VENDEDOR (el ADMIN se asigna a propósito)
        if (nuevoUsuario.getRol() == null) {
            nuevoUsuario.setRol(com.minimarket.model.Rol.VENDEDOR);
        }

        // Encriptamos la contraseña antes de guardarla en MySQL
        String passwordEncriptada = passwordEncoder.encode(nuevoUsuario.getPassword());
        nuevoUsuario.setPassword(passwordEncriptada);

        usuarioRepository.save(nuevoUsuario);
        return "Usuario registrado con éxito como " + nuevoUsuario.getRol();
    }

    // 2. MÉTODO DE LOGIN (Conectado a MySQL)
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> credenciales) {
        String username = credenciales.get("username");
        String password = credenciales.get("password");

        // Buscamos al usuario en MySQL
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Comparamos la contraseña enviada con la encriptada en la base de datos
        if (passwordEncoder.matches(password, usuario.getPassword())) {

            // Si coinciden, generamos y entregamos la "pulsera VIP" (con su rol incluido)
            String rol = usuario.getRol() != null ? usuario.getRol().name() : "VENDEDOR";
            String token = jwtUtil.generarToken(usuario.getUsername(), rol);
            return Map.of("token", token, "rol", rol, "username", usuario.getUsername());

        } else {
            throw new RuntimeException("Contraseña incorrecta. Acceso denegado.");
        }
    }
}