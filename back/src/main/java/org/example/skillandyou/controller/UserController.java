package org.example.skillandyou.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.skillandyou.dto.RegisterRequestDTO;
import org.example.skillandyou.dto.UpdateUserDTO;
import org.example.skillandyou.dto.UserSearchDTO;
import org.example.skillandyou.entity.User;
import org.example.skillandyou.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
        User user = userService.getUserById(id);
        System.out.println("👤 Profil chargé backend : id=" + user.getId() + " photoUrl=" + user.getPhotoUrl());
        return user;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO req) {  // ← ?
        try {
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

        catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
        catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "REGISTER_FAILED"));
        }
    }


    @PostMapping
    public User create(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody UpdateUserDTO dto) {
        return userService.updateUser(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @GetMapping("/search")
    public List<UserSearchDTO> searchUsers(
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String type) {
        return userService.searchUsers(skill, city, type);
    }

}
