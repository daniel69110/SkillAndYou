package org.example.skillandyou.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.example.skillandyou.dto.LoginRequestDTO;
import org.example.skillandyou.entity.User;
import org.example.skillandyou.security.JwtUtil;
import org.example.skillandyou.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequestDTO request) {
        System.out.println("🔍 Login: " + request.getEmail());

        // 1. Trouve user
        User user = userService.findByEmail(request.getEmail())  // ← findByEmail simple
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("🔍 User ID: " + user.getId());

        // 2. BCrypt check
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // 3. JWT
        String token = jwtUtil.generateToken(user.getId(), user.getUserName());  // userName existant

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    }
}


