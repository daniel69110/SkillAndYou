package org.example.skillandyou.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    public JwtUtil() {
        System.out.println("✅ JwtUtil CRÉÉ !");
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(Long userId, String username, String role) {
        System.out.println("🔧 Génération token pour User ID: " + userId + ", Role: " + role);

        return Jwts.builder()
                .subject(username)
                .claim("userId", userId)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public Long getUserId(String token) {
        try {
            Long userId = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .get("userId", Long.class);

            System.out.println("✅ userId extrait: " + userId);
            return userId;

        } catch (Exception e) {
            System.out.println("❌ Erreur extraction userId: " + e.getMessage());
            throw e;
        }
    }

    public String getRole(String token) {
        try {
            String role = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .get("role", String.class);

            System.out.println("✅ role extrait: " + role);
            return role;

        } catch (Exception e) {
            System.out.println("❌ Erreur extraction role: " + e.getMessage());
            throw e;
        }
    }

    public boolean isValid(String token) {
        try {
            Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token);
            System.out.println("✅ Token valide");
            return true;
        } catch (Exception e) {
            System.out.println("❌ Token invalide: " + e.getMessage());
            return false;
        }
    }
}
