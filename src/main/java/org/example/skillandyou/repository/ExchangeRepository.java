package org.example.skillandyou.repository;

import org.example.skillandyou.entity.Exchange;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExchangeRepository extends JpaRepository<Exchange, Long> {

    List<Exchange> findByRequesterId(Long userId);
    List<Exchange> findByReceiverId(Long userId);
}
