package org.example.skillandyou.repository;

import org.example.skillandyou.entity.Exchange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExchangeRepository extends JpaRepository<Exchange, Long> {

    List<Exchange> findByRequester_Id(Long userId);   // ← _Id
    List<Exchange> findByReceiver_Id(Long userId);
    @Query("SELECT e FROM Exchange e WHERE e.requester.id = :userId OR e.receiver.id = :userId")
    List<Exchange> findMyExchanges(@Param("userId") Long userId);

}
