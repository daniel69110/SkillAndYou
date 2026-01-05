package org.example.skillandyou.service;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.dto.ReviewRequestDTO;
import org.example.skillandyou.entity.Exchange;
import org.example.skillandyou.entity.Review;
import org.example.skillandyou.entity.User;
import org.example.skillandyou.repository.ExchangeRepository;
import org.example.skillandyou.repository.ReviewRepository;
import org.example.skillandyou.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ExchangeRepository exchangeRepository;
    private final UserRepository userRepository;

    public Review createReview(Long exchangeId, Long reviewerId, ReviewRequestDTO dto) {
        Exchange exchange = exchangeRepository.findById(exchangeId).orElseThrow();
        User reviewer = userRepository.findById(reviewerId).orElseThrow();

        // Vérif : reviewer = requester OU receiver
        if (!exchange.getRequester().getId().equals(reviewerId) &&
                !exchange.getReceiver().getId().equals(reviewerId)) {
            throw new IllegalArgumentException("Seuls les participants peuvent évaluer");
        }

        if (reviewRepository.findByExchangeIdAndReviewerId(exchangeId, reviewerId).isPresent()) {
            throw new IllegalStateException("Déjà évalué cet échange !");
        }


        Review review = Review.builder()
                .exchange(exchange)
                .reviewer(reviewer)
                .rating(dto.getRating())
                .comment(dto.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByUser(Long userId) {
        return reviewRepository.findByReviewerId(userId);
    }
}

