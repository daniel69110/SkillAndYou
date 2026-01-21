package org.example.skillandyou.controller;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.dto.LoginRequestDTO;
import org.example.skillandyou.dto.LoginResponseDTO;
import org.example.skillandyou.dto.UserDTO;
import org.example.skillandyou.entity.User;
import org.example.skillandyou.security.JwtUtil;
import org.example.skillandyou.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        System.out.println("🔍 Login: " + request.getEmail());

        // 1. Trouve user
        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("🔍 User ID: " + user.getId());

        // 2. BCrypt check
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // 3. JWT
        String token = jwtUtil.generateToken(user.getId(), user.getUserName());

        // 4. UserDTO
        UserDTO userDTO = new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getUserName()
        );

        // 5. Response avec token + user
        LoginResponseDTO response = new LoginResponseDTO(token, userDTO);

        System.out.println("✅ JWT généré: " + token);
        System.out.println("✅ User DTO: " + userDTO);

        return ResponseEntity.ok(response);
    }
}
