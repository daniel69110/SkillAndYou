package org.example.skillandyou.repository;

import org.example.skillandyou.entity.Exchange;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExchangeRepository extends JpaRepository<Exchange, Long> {

    List<Exchange> findByRequester_Id(Long userId);   // ← _Id
    List<Exchange> findByReceiver_Id(Long userId);
}
