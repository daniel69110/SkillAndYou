package org.example.skillandyou.controller;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.dto.ReviewRequestDTO;
import org.example.skillandyou.entity.Review;
import org.example.skillandyou.service.ReviewService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/exchanges/{exchangeId}/reviewer/{reviewerId}")
    public Review createReview(@PathVariable Long exchangeId,
                               @PathVariable Long reviewerId,
                               @RequestBody ReviewRequestDTO dto) {
        return reviewService.createReview(exchangeId, reviewerId ,dto);
    }

    @GetMapping("/users/{userId}")
    public List<Review> getUserReviews(@PathVariable Long userId) {
        return reviewService.getReviewsByUser(userId);
    }


}

