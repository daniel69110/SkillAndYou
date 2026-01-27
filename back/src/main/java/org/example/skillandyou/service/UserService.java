package org.example.skillandyou.service;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.dto.UpdateUserDTO;
import org.example.skillandyou.entity.Review;
import org.example.skillandyou.entity.User;
import org.example.skillandyou.repository.ReviewRepository;
import org.example.skillandyou.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();

    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow();
    }

    public User createUser(User user) {
        if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }

    public User updateUser(Long id, UpdateUserDTO dto) {
        User existing = getUserById(id);


        if (dto.getFirstName() != null) existing.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) existing.setLastName(dto.getLastName());
        if (dto.getUserName() != null) existing.setUserName(dto.getUserName());

        // Champs optionnels (peuvent être null pour vider)
        existing.setBio(dto.getBio());
        existing.setCity(dto.getCity());
        existing.setCountry(dto.getCountry());
        existing.setPostalCode(dto.getPostalCode());
        existing.setPhotoUrl(dto.getPhotoUrl());

        return userRepository.save(existing);
    }


    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void recalculateAverageRating(Long userId) {
        List<Review> reviews = reviewRepository.findByReviewedUserId(userId);
        if (reviews.isEmpty()) {
            User user = userRepository.findById(userId).orElseThrow();
            user.setAverageRating(null);
            userRepository.save(user);
            return;
        }

        BigDecimal average = reviews.stream()
                .map(Review::getRating)
                .filter(Objects::nonNull)
                .map(r -> BigDecimal.valueOf(r))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(reviews.size()), 2, RoundingMode.HALF_UP);

        User user = userRepository.findById(userId).orElseThrow();
        user.setAverageRating(average);
        userRepository.save(user);
    }

}

