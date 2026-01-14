package org.example.skillandyou.repository;

import org.example.skillandyou.entity.Report;
import org.example.skillandyou.entity.enums.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    // Admin : reports en attente
    List<Report> findByStatusOrderByReportDateDesc(ReportStatus status);

    // Admin : compteur de pending
    long countByStatus(ReportStatus status);

    // Historique côté user
    List<Report> findByReporterId(Long reporterId);
    List<Report> findByReportedUserId(Long reportedUserId);

    // Historique par status
    List<Report> findByStatus(ReportStatus status);
}
