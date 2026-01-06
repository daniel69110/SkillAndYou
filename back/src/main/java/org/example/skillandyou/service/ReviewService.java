package org.example.skillandyou.service;

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

    public Review createReview(Long exchangeId, Long reviewerId, ReviewRequestDTO dto) {
        // Récupération des objets liés
        Exchange exchange = exchangeRepository.findById(exchangeId).orElseThrow();
        User reviewer = userService.getUserById(reviewerId);

        // Vérif : le reviewer doit être requester OU receiver
        if (!exchange.getRequester().getId().equals(reviewerId)
                && !exchange.getReceiver().getId().equals(reviewerId)) {
            throw new IllegalArgumentException("Seuls les participants peuvent évaluer");
        }

        // Vérif : pas de review en double pour cet échange par ce user
        if (reviewRepository.findByExchangeIdAndReviewerId(exchangeId, reviewerId).isPresent()) {
            throw new IllegalStateException("Déjà évalué cet échange !");
        }

        // Déterminer l'utilisateur évalué (l'autre participant)
        Long reviewedUserId = exchange.getRequester().getId().equals(reviewerId)
                ? exchange.getReceiver().getId()
                : exchange.getRequester().getId();

        // Construire l'entité Review avec des IDs simples
        Review review = Review.builder()
                .exchangeId(exchangeId)
                .reviewerId(reviewerId)
                .reviewedUserId(reviewedUserId)
                .rating(dto.getRating())
                .comment(dto.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        Review saved = reviewRepository.save(review);

        // Recalcul de la note moyenne de l'utilisateur évalué
        userService.recalculateAverageRating(reviewedUserId);

        return saved;
    }

    /**
     * Reviews reçues par un user (pour afficher son profil / note moyenne)
     */
    public List<Review> getReviewsByUser(Long userId) {
        return reviewRepository.findByReviewedUserId(userId);
    }
}
