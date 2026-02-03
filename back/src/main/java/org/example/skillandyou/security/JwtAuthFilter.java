package org.example.skillandyou.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    // ✅ Constructeur explicite avec log
    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
        System.out.println("========================================");
        System.out.println("✅✅✅ JwtAuthFilter CRÉÉ !");
        System.out.println("========================================");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        String method = request.getMethod();

        System.out.println("\n🔍 FILTER APPELÉ: " + method + " " + requestURI);

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null) {
            System.out.println("⚠️ Pas de header Authorization");
            filterChain.doFilter(request, response);
            return;
        }

        System.out.println("🔑 Header Authorization trouvé: " + authHeader.substring(0, Math.min(50, authHeader.length())) + "...");

        String username = null;
        String role = null;

        if (authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);

            System.out.println("🔍 Validation JWT...");

            try {
                if (jwtUtil.isValid(jwt)) {
                    Long userId = jwtUtil.getUserId(jwt);
                    role = jwtUtil.getRole(jwt);
                    username = "user-" + userId;

                    System.out.println("✅ JWT VALIDE !");
                    System.out.println("   User ID: " + userId);
                    System.out.println("   Role: " + role);
                } else {
                    System.out.println("❌ JWT INVALIDE (isValid = false)");
                }
            } catch (Exception e) {
                System.out.println("❌ ERREUR validation JWT: " + e.getMessage());
                e.printStackTrace();
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            List<SimpleGrantedAuthority> authorities = List.of(
                    new SimpleGrantedAuthority("ROLE_" + role)
            );

            System.out.println("🔐 Configuration authentification...");
            System.out.println("   Username: " + username);
            System.out.println("   Authorities: " + authorities);

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(username, null, authorities);

            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);

            System.out.println("✅ AUTHENTIFICATION CONFIGURÉE !");
        } else if (username == null) {
            System.out.println("⚠️ Username est null, pas d'authentification");
        }

        filterChain.doFilter(request, response);
    }
}
