package org.example.skillandyou.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.skillandyou.entity.User;
import org.example.skillandyou.entity.enums.Status;
import org.example.skillandyou.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class suspensionCheckFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Si authentifié
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {

            try {
                Long userId = Long.parseLong(auth.getName().replace("user-", ""));
                User user = userRepository.findById(userId).orElse(null);

                // Si user suspendu
                if (user != null && user.getStatus() == Status.SUSPENDED) {
                    System.out.println("⚠️ User suspendu tente d'accéder à : " + request.getRequestURI());

                    // Autorise uniquement certaines routes
                    String uri = request.getRequestURI();
                    if (!uri.startsWith("/api/auth/") && !uri.startsWith("/api/users/" + userId)) {
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.setContentType("application/json");
                        response.getWriter().write("{\"message\":\"Votre compte est suspendu\"}");
                        return;
                    }
                }
            } catch (NumberFormatException e) {
                // Pas un userId valide, continue
            }
        }

        filterChain.doFilter(request, response);
    }
}
