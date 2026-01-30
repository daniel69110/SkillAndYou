package org.example.skillandyou.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.skillandyou.entity.enums.ReportStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Report {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporterId", nullable = false)
    private User reporter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reportedUserId", nullable = false)
    private User reportedUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exchangeId")
    private Exchange exchange;

    @Column(length = 100, nullable = false)
    private String reason;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status = ReportStatus.PENDING;

    @Column(name = "reportDate", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime reportDate;

    @Column(name = "processingDate")
    private LocalDateTime processingDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adminId")
    private User admin;

}
