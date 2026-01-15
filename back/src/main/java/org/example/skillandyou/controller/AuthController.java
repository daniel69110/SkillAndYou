package org.example.skillandyou.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.example.skillandyou.dto.LoginRequestDTO;
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
@RequestMapping("/api/auth")
public class AuthController {
    private final JwtUtil jwtUtil;

    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public Map<String, String> login() {
        String token = jwtUtil.generateToken(1L, "alice");  // Test Alice
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return response;
    }
}


