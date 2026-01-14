package org.example.skillandyou.controller;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.dto.ProcessReportRequestDTO;
import org.example.skillandyou.dto.ReportRequestDTO;
import org.example.skillandyou.entity.Report;
import org.example.skillandyou.service.ReportService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ReportController {
    private final ReportService reportService;

    // Création d’un report (côté user)
    @PostMapping
    public Report create(@RequestBody ReportRequestDTO request) {
        return reportService.createReport(
                request.getReporterId(),
                request.getReportedUserId(),
                request.getExchangeId(),
                request.getReason(),
                request.getDescription()
        );
    }

    // Liste des reports en attente (admin)
    @GetMapping("/pending")
    public List<Report> getPending() {
        return reportService.getPendingReports();
    }

    // Compteur pending (badge admin)
    @GetMapping("/pending/count")
    public long countPending() {
        return reportService.countPendingReports();
    }

    // Détail d’un report
    @GetMapping("/{id}")
    public Report getById(@PathVariable Long id) {
        return reportService.getById(id);
    }

    // Historique : reports créés par un user
    @GetMapping("/reporter/{reporterId}")
    public List<Report> getByReporter(@PathVariable Long reporterId) {
        return reportService.getReportsByReporter(reporterId);
    }

    // Historique : reports reçus par un user
    @GetMapping("/reported/{reportedUserId}")
    public List<Report> getByReportedUser(@PathVariable Long reportedUserId) {
        return reportService.getReportsByReportedUser(reportedUserId);
    }

    // Traitement par un admin
    @PostMapping("/{id}/process")
    public Report process(@PathVariable Long id,
                          @RequestBody ProcessReportRequestDTO request) {  // ← JSON
        return reportService.processReport(id,
                request.getAdminId(),
                request.getStatus());
    }
}
