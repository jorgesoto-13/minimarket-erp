package com.minimarket.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
    .csrf(AbstractHttpConfigurer::disable)
        // Agregamos esta configuración robusta de CORS
        .cors(cors -> cors.configurationSource(request -> {
            var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
            corsConfiguration.setAllowedOrigins(java.util.List.of("http://localhost:4200"));
            corsConfiguration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            corsConfiguration.setAllowedHeaders(java.util.List.of("*"));
            return corsConfiguration;
        }))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll() // Público

            // Gestión de usuarios: solo ADMIN
            .requestMatchers("/api/usuarios/**").hasRole("ADMIN")
            .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/productos/**").authenticated()
            .requestMatchers("/api/productos/**").hasRole("ADMIN")

            // Categorías: solo ADMIN
            .requestMatchers("/api/categorias/**").hasRole("ADMIN")

            // Compras: solo ADMIN (reabastecimiento de inventario)
            .requestMatchers("/api/compras/**").hasRole("ADMIN")

            // Reportes y dashboard: solo ADMIN
            .requestMatchers("/api/reportes/**").hasRole("ADMIN")

            // Ventas: ambos roles pueden listar/registrar, pero anular (DELETE) solo ADMIN
            .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/ventas/**").hasRole("ADMIN")
            .requestMatchers("/api/ventas/**").authenticated()

            .anyRequest().authenticated()                // Todo lo demás protegido
        )
        .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
