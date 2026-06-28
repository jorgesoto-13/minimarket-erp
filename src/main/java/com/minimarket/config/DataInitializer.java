package com.minimarket.config;

import com.minimarket.model.Rol;
import com.minimarket.model.Usuario;
import com.minimarket.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Si ya existe el usuario "admin" no hacemos nada (evita duplicarlo en cada reinicio)
        if (usuarioRepository.findByUsername("admin").isPresent()) {
            return;
        }

        Usuario admin = new Usuario();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRol(Rol.ADMIN);
        usuarioRepository.save(admin);

        System.out.println("==========================================================");
        System.out.println(" Usuario ADMIN creado automáticamente -> admin / admin123");
        System.out.println(" (Cámbialo o crea otros usuarios desde /api/auth/registro)");
        System.out.println("==========================================================");
    }
}
