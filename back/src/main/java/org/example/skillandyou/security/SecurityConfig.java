package org.example.skillandyou.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CorsConfigurationSource corsConfigurationSource;
    private final suspensionCheckFilter suspensionCheckFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // ========== PUBLIC ==========
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/users").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/users/register").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/reviews/user/*/rating").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/reviews/user/*").permitAll()

                        // ========== ADMIN ONLY (en premier pour éviter les conflits) ==========
                        // Reports - ADMIN voit et gère TOUS les reports
                        .requestMatchers(HttpMethod.GET, "/api/reports").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/reports/pending").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/reports/pending/count").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/reports/reported/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/reports/*/process").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/reports/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/reports/**").hasRole("ADMIN")

                        // Suspensions - ADMIN only
                        .requestMatchers("/api/suspensions/**").hasRole("ADMIN")

                        // Skills - Gestion ADMIN
                        .requestMatchers(HttpMethod.POST, "/api/skills").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/skills/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/skills/**").hasRole("ADMIN")

                        // ========== USER + ADMIN (routes spécifiques) ==========
                        // Reports - USER peut créer et voir ses propres reports
                        .requestMatchers(HttpMethod.POST, "/api/reports").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/reports/my-reports").hasAnyRole("USER", "ADMIN")

                        // Reports - Détail d'un report (plus spécifique en dernier)
                        .requestMatchers(HttpMethod.GET, "/api/reports/*").hasRole("ADMIN")

                        // ========== USER + ADMIN (routes générales) ==========
                        // Profils
                        .requestMatchers(HttpMethod.GET, "/api/users/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/users/*").hasAnyRole("USER", "ADMIN")

                        // Exchanges
                        .requestMatchers("/api/exchanges/**").hasAnyRole("USER", "ADMIN")

                        // Reviews
                        .requestMatchers("/api/reviews/**").hasAnyRole("USER", "ADMIN")

                        // Notifications
                        .requestMatchers("/api/notifications/**").hasAnyRole("USER", "ADMIN")

                        // Skills (lecture)
                        .requestMatchers(HttpMethod.GET, "/api/skills/**").hasAnyRole("USER", "ADMIN")

                        .anyRequest().denyAll()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(suspensionCheckFilter, JwtAuthFilter.class);

        return http.build();
    }








    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}