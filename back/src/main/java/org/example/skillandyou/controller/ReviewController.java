package org.example.skillandyou.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.skillandyou.dto.ReviewRequestDTO;
import org.example.skillandyou.entity.Review;
import org.example.skillandyou.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/exchange/{exchangeId}")
    public ResponseEntity<Review> create(
            @PathVariable Long exchangeId,
            @Valid @RequestBody ReviewRequestDTO dto,
            Authentication auth) {

        Long reviewerId = Long.parseLong(auth.getName().replace("user-", ""));

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.createReview(exchangeId, reviewerId, dto));
    }

    @GetMapping
    public List<Review> getAll() {
        return reviewService.getAllReviews();
    }

    @GetMapping("/user/{userId}")
    public List<Review> getByUser(@PathVariable Long userId) {
        return reviewService.getReviewsByReviewedUser(userId);
    }

    @GetMapping("/user/{userId}/rating")
    public Map<String, Object> getUserRating(@PathVariable Long userId) {
        return Map.of(
                "userId", userId,
                "averageRating", reviewService.getAverageRatingByUser(userId),
                "totalReviews", reviewService.countReviewsByUser(userId)
        );
    }

    @GetMapping("/reviewer/{userId}")
    public List<Review> getByReviewer(@PathVariable Long userId) {
        return reviewService.getReviewsByReviewer(userId);
    }

    @GetMapping("/{id}")
    public Review getById(@PathVariable Long id) {
        return reviewService.getReviewById(id);
    }
}

