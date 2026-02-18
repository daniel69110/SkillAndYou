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

        String uri = request.getRequestURI();

        // Ignore certains endpoints publics
        if (uri.matches("/api/users/\\d+/profile-picture")) {
            filterChain.doFilter(request, response);
            return;
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {

            try {
                Long userId = Long.parseLong(auth.getName().replace("user-", ""));
                User user = userRepository.findById(userId).orElse(null);

                if (user != null && user.getStatus() == Status.SUSPENDED) {
                    // Autoriser uniquement certaines routes
                    if (!uri.startsWith("/api/auth/") && !uri.startsWith("/api/users/" + userId)) {
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.setContentType("application/json");
                        response.getWriter().write("{\"message\":\"Votre compte est suspendu\"}");
                        return;
                    }
                }
            } catch (NumberFormatException e) {
                // Pas un userId valide
            }
        }

        filterChain.doFilter(request, response);
    }

}
