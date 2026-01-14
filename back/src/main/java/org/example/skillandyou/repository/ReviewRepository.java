package org.example.skillandyou.repository;

import org.example.skillandyou.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Optional<Review> findByExchangeIdAndReviewerId(Long exchangeId, Long reviewerId);
    List<Review> findByReviewedUserId(Long userId);
    List<Review> findByReviewerId(Long reviewerId);
    Long countByReviewedUserId(Long userId);
}


