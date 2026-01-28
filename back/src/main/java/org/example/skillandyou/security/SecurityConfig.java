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

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // PUBLIC
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/ws/**").permitAll()  // 🔔 AJOUTE WebSocket
                        .requestMatchers(HttpMethod.POST, "/api/users").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/users/register").permitAll()

                        // USER - Search (AVANT /api/users/{id} !)
                        .requestMatchers(HttpMethod.GET, "/api/users/search").hasRole("USER")

                        // USER - Profil
                        .requestMatchers(HttpMethod.GET, "/api/users/{id}").hasRole("USER")
                        .requestMatchers(HttpMethod.PUT, "/api/users/{id}").hasRole("USER")

                        // USER - Skills
                        .requestMatchers(HttpMethod.GET, "/api/users/{userId}/skills").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/api/users/{userId}/skills").hasRole("USER")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/{userId}/skills/**").hasRole("USER")

                        // USER - Exchanges & Reviews
                        .requestMatchers(HttpMethod.GET, "/api/exchanges/**",
                                "/api/reviews/**", "/api/skills/**").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/api/exchanges/**", "/api/reviews/**").hasRole("USER")
                        .requestMatchers(HttpMethod.PUT, "/api/exchanges/**").hasRole("USER")

                        // 🔔 AJOUTE Notifications
                        .requestMatchers(HttpMethod.GET, "/api/notifications/**").hasRole("USER")
                        .requestMatchers(HttpMethod.PUT, "/api/notifications/**").hasRole("USER")

                        // ADMIN (général après - catch-all)
                        .requestMatchers(HttpMethod.POST, "/api/skills").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/skills/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/skills/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/users/**").hasRole("ADMIN")

                        .anyRequest().denyAll()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }





    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}