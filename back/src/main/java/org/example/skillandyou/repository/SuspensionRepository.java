package org.example.skillandyou.repository;

import org.example.skillandyou.entity.Suspension;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SuspensionRepository extends JpaRepository <Suspension,Long> {
    List<Suspension> findByUserIdOrderByStartDateDesc(Long userId);


    @Query("SELECT s FROM Suspension s WHERE s.endDate >= :today ORDER BY s.startDate DESC")
    List<Suspension> findActiveSuspensions(LocalDate today);


    @Query("SELECT s FROM Suspension s WHERE s.endDate < :today AND s.user.status = 'SUSPENDED'")
    List<Suspension> findExpiredSuspensions(LocalDate today);


    Optional<Suspension> findByReportId(Long reportId);
}
