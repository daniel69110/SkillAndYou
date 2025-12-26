package org.example.skillandyou.controller;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.entity.User;
import org.example.skillandyou.entity.enums.Role;
import org.example.skillandyou.entity.enums.Status;
import org.example.skillandyou.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @PostMapping
    public User create(@RequestBody User user) {
        if (user.getRole() == null) {
            user.setRole(Role.USER);
        }
        if (user.getStatus() == null) {
            user.setStatus(Status.ACTIVE);
        }
        return userRepository.save(user);
    }
}
