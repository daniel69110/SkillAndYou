package org.example.skillandyou.repository;

import org.example.skillandyou.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Reviews données par un user (auteur)
    List<Review> findByReviewerId(Long reviewerId);

    // Reviews reçues par un user (cible)
    List<Review> findByReviewedUserId(Long reviewedUserId);



    // Reviews d’un échange
    List<Review> findByExchangeId(Long exchangeId);

    // Une review précise pour un échange + un reviewer
    Optional<Review> findByExchangeIdAndReviewerId(Long exchangeId, Long reviewerId);
}


