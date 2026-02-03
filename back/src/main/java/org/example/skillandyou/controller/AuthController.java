package org.example.skillandyou.controller;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.dto.LoginRequestDTO;
import org.example.skillandyou.dto.LoginResponseDTO;
import org.example.skillandyou.dto.UserDTO;
import org.example.skillandyou.entity.User;
import org.example.skillandyou.entity.enums.Status;  // ✅ AJOUTE
import org.example.skillandyou.security.JwtUtil;
import org.example.skillandyou.service.UserService;
import org.springframework.http.HttpStatus;  // ✅ AJOUTE
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;  // ✅ AJOUTE

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {
        System.out.println("🔍 Login: " + request.getEmail());

        // 1. Trouve user
        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("🔍 User ID: " + user.getId());
        System.out.println("🔍 User Status: " + user.getStatus());

        // 2. BCrypt check
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // ✅ 3. VÉRIFIE SI SUSPENDU
        if (user.getStatus() == Status.SUSPENDED) {
            System.out.println("⚠️ Tentative de connexion d'un compte suspendu: " + user.getEmail());
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "error", "ACCOUNT_SUSPENDED",
                            "message", "Votre compte est suspendu"
                    ));
        }

        // 4. JWT
        String token = jwtUtil.generateToken(user.getId(), user.getUserName(), user.getRole().name());

        // 5. UserDTO
        UserDTO userDTO = new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getUserName(),
                user.getRole().name()
        );

        // 6. Response avec token + user
        LoginResponseDTO response = new LoginResponseDTO(token, userDTO);

        System.out.println("✅ JWT généré: " + token);
        System.out.println("✅ User DTO: " + userDTO);

        return ResponseEntity.ok(response);
    }
}
