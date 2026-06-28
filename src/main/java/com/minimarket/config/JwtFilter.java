package com.minimarket.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
            throws ServletException, IOException {
        
        // Extraemos la cabecera de autorización de la petición
        String authHeader = request.getHeader("Authorization");

        // Si trae la cabecera y empieza con "Bearer ", extraemos el token
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            // Si el token es válido y aún no está logueado en el contexto actual
            if (jwtUtil.validarToken(token) && SecurityContextHolder.getContext().getAuthentication() == null) {
                String username = jwtUtil.extraerUsername(token);
                String rol = jwtUtil.extraerRol(token);

                // Convertimos el rol ("ADMIN"/"VENDEDOR") en una autoridad de Spring Security ("ROLE_ADMIN")
                var authorities = rol != null
                        ? java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + rol))
                        : new ArrayList<org.springframework.security.core.GrantedAuthority>();

                // Le decimos a Spring Security: "Déjalo pasar, es auténtico, y este es su rol"
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username, null, authorities
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Continúa con la cadena de filtros normal
        filterChain.doFilter(request, response);
    }
}