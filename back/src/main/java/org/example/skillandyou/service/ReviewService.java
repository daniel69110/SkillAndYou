package org.example.skillandyou.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.skillandyou.dto.ReviewRequestDTO;
import org.example.skillandyou.entity.Exchange;
import org.example.skillandyou.entity.Review;
import org.example.skillandyou.entity.User;
import org.example.skillandyou.repository.ExchangeRepository;
import org.example.skillandyou.repository.ReviewRepository;
import org.example.skillandyou.service.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ExchangeRepository exchangeRepository;
    private final UserService userService;

    // TON CREATE (parfait)
    public Review createReview(Long exchangeId, Long reviewerId, ReviewRequestDTO dto) {
        Exchange exchange = exchangeRepository.findById(exchangeId)
                .orElseThrow(() -> new EntityNotFoundException("Exchange not found: " + exchangeId));
        User reviewer = userService.getUserById(reviewerId);

        if (!exchange.getRequester().getId().equals(reviewerId) &&
                !exchange.getReceiver().getId().equals(reviewerId)) {
            throw new IllegalArgumentException("Seuls les participants peuvent évaluer");
        }

        if (reviewRepository.findByExchangeIdAndReviewerId(exchangeId, reviewerId).isPresent()) {
            throw new IllegalStateException("Déjà évalué cet échange !");
        }

        Long reviewedUserId = exchange.getRequester().getId().equals(reviewerId)
                ? exchange.getReceiver().getId()
                : exchange.getRequester().getId();

        Review review = Review.builder()
                .exchangeId(exchangeId)
                .reviewerId(reviewerId)
                .reviewedUserId(reviewedUserId)
                .rating(dto.getRating())
                .comment(dto.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        Review saved = reviewRepository.save(review);
        userService.recalculateAverageRating(reviewedUserId);
        return saved;
    }

    // NOUVELLES MÉTHODES
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> getReviewsByUser(Long userId) {
        return getReviewsByReviewedUser(userId);
    }

    public List<Review> getReviewsByReviewedUser(Long userId) {
        return reviewRepository.findByReviewedUserId(userId);
    }

    public List<Review> getReviewsByReviewer(Long reviewerId) {
        return reviewRepository.findByReviewerId(reviewerId);
    }

    public Review getReviewById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review not found: " + id));
    }


    public Double getAverageRatingByUser(Long userId) {
        List<Review> reviews = reviewRepository.findByReviewedUserId(userId);
        return reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
    }

    public Long countReviewsByUser(Long userId) {
        return reviewRepository.countByReviewedUserId(userId);
    }
}
