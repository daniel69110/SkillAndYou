package org.example.skillandyou.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.skillandyou.dto.RegisterRequestDTO;
import org.example.skillandyou.entity.User;
import org.example.skillandyou.entity.enums.Role;
import org.example.skillandyou.entity.enums.Status;
import org.example.skillandyou.repository.UserRepository;
import org.example.skillandyou.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;

    @GetMapping
    public List<User> getAll() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterRequestDTO req) {
        User user = User.builder()
                .email(req.getEmail())
                .userName(req.getUserName())
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .password(req.getPassword())
                .build();
        User created = userService.createUser(user);
        return ResponseEntity.status(201).body(created);
    }

    @PostMapping
    public User create(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
