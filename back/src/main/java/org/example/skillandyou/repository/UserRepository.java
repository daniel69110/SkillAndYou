package org.example.skillandyou.repository;

import org.example.skillandyou.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);  // ← UNIQUEMENT ÇA
    boolean existsByEmail(String email);

}
