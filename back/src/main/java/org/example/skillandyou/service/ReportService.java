package org.example.skillandyou.service;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.entity.Report;
import org.example.skillandyou.entity.User;
import org.example.skillandyou.entity.enums.ReportStatus;
import org.example.skillandyou.entity.enums.Status;
import org.example.skillandyou.repository.ExchangeRepository;
import org.example.skillandyou.repository.ReportRepository;
import org.example.skillandyou.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final ExchangeRepository exchangeRepository;

    // USER: Créer un signalement
    public Report createReport(Long reporterId,
                               Long reportedUserId,
                               Long exchangeId,
                               String reason,
                               String description) {

        // Validation
        if (reporterId.equals(reportedUserId)) {
            throw new IllegalArgumentException("Vous ne pouvez pas vous signaler vous-même");
        }

        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new RuntimeException("Reporter introuvable"));
        User reported = userRepository.findById(reportedUserId)
                .orElseThrow(() -> new RuntimeException("Utilisateur signalé introuvable"));

        Report.ReportBuilder builder = Report.builder()
                .reporter(reporter)
                .reportedUser(reported)
                .reason(reason)
                .description(description)
                .status(ReportStatus.PENDING)
                .reportDate(LocalDateTime.now());

        // Exchange optionnel
        if (exchangeId != null) {
            exchangeRepository.findById(exchangeId).ifPresent(builder::exchange);
        }

        return reportRepository.save(builder.build());
    }

    // ADMIN: Lire un report
    public Report getById(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report introuvable"));
    }

    // ADMIN: Liste reports en attente
    public List<Report> getPendingReports() {
        return reportRepository.findByStatusOrderByReportDateDesc(ReportStatus.PENDING);
    }

    // ADMIN: Compteur reports pending
    public long countPendingReports() {
        return reportRepository.countByStatus(ReportStatus.PENDING);
    }

    // USER: Mes reports créés
    public List<Report> getReportsByReporter(Long reporterId) {
        return reportRepository.findByReporterId(reporterId);
    }

    // ADMIN: Reports reçus par un user
    public List<Report> getReportsByReportedUser(Long reportedUserId) {
        return reportRepository.findByReportedUserId(reportedUserId);
    }

    // ADMIN: Traiter un report (RESOLVED ou REJECTED)
    public Report processReport(Long reportId, Long adminId, ReportStatus newStatus) {
        Report report = getById(reportId);
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin introuvable"));

        report.setAdmin(admin);
        report.setStatus(newStatus);
        report.setProcessingDate(LocalDateTime.now());

        return reportRepository.save(report);
    }
}
