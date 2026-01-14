package org.example.skillandyou.service;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.entity.Report;
import org.example.skillandyou.entity.User;
import org.example.skillandyou.entity.enums.ReportStatus;
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

    public Report createReport(Long reporterId,
                               Long reportedUserId,
                               Long exchangeId,
                               String reason,
                               String description) {

        User reporter = userRepository.findById(reporterId).orElseThrow();
        User reported = userRepository.findById(reportedUserId).orElseThrow();

        Report.ReportBuilder builder = Report.builder()
                .reporter(reporter)
                .reportedUser(reported)
                .reason(reason)
                .description(description)
                .status(ReportStatus.PENDING)
                .reportDate(LocalDateTime.now());

        if (exchangeId != null) {
            exchangeRepository.findById(exchangeId).ifPresent(builder::exchange);
        }

        return reportRepository.save(builder.build());
    }

    // 2) Lecture simple
    public Report getById(Long id) {
        return reportRepository.findById(id).orElseThrow();
    }

    public List<Report> getPendingReports() {
        return reportRepository.findByStatusOrderByReportDateDesc(ReportStatus.PENDING);
    }

    public long countPendingReports() {
        return reportRepository.countByStatus(ReportStatus.PENDING);
    }

    public List<Report> getReportsByReporter(Long reporterId) {
        return reportRepository.findByReporterId(reporterId);
    }

    public List<Report> getReportsByReportedUser(Long reportedUserId) {
        return reportRepository.findByReportedUserId(reportedUserId);
    }

    // 3) Traitement par un admin
    public Report processReport(Long reportId, Long adminId, ReportStatus newStatus) {
        Report report = getById(reportId);
        User admin = userRepository.findById(adminId).orElseThrow();

        report.setAdmin(admin);
        report.setStatus(newStatus);
        report.setProcessingDate(LocalDateTime.now());

        return reportRepository.save(report);
    }
}
