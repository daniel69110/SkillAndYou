package org.example.skillandyou.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.skillandyou.dto.ProcessReportRequestDTO;
import org.example.skillandyou.dto.ReportRequestDTO;
import org.example.skillandyou.entity.Report;
import org.example.skillandyou.service.ReportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ReportController {
    private final ReportService reportService;

    // USER: Signaler un utilisateur
    @PostMapping
    public ResponseEntity<Report> create(
            @Valid @RequestBody ReportRequestDTO request,
            Authentication auth) {

        Long reporterId = Long.parseLong(auth.getName().replace("user-", ""));

        Report report = reportService.createReport(
                reporterId,
                request.getReportedUserId(),
                request.getExchangeId(),
                request.getReason(),
                request.getDescription()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(report);
    }

    // USER: Mes signalements créés
    @GetMapping("/my-reports")
    public List<Report> getMyReports(Authentication auth) {
        Long reporterId = Long.parseLong(auth.getName().replace("user-", ""));
        return reportService.getReportsByReporter(reporterId);
    }

    // ADMIN: Liste reports en attente
    @GetMapping("/pending")
    public List<Report> getPending() {
        return reportService.getPendingReports();
    }

    // ADMIN: Compteur pending
    @GetMapping("/pending/count")
    public long countPending() {
        return reportService.countPendingReports();
    }

    // ADMIN: Détail d'un report
    @GetMapping("/{id}")
    public Report getById(@PathVariable Long id) {
        return reportService.getById(id);
    }

    // ADMIN: Reports reçus par un user
    @GetMapping("/reported/{reportedUserId}")
    public List<Report> getByReportedUser(@PathVariable Long reportedUserId) {
        return reportService.getReportsByReportedUser(reportedUserId);
    }

    // ADMIN: Traiter un report
    @PostMapping("/{id}/process")
    public Report process(
            @PathVariable Long id,
            @Valid @RequestBody ProcessReportRequestDTO request,
            Authentication auth) {

        Long adminId = Long.parseLong(auth.getName().replace("user-", ""));

        return reportService.processReport(id, adminId, request.getStatus());
    }
}
