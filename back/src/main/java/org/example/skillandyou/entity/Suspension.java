package org.example.skillandyou.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "suspensions")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Suspension {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adminId", nullable = false)
    private User admin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reportId")
    private Report report;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String reason;

    @PrePersist
    protected void onCreate() {
        if (startDate == null) startDate = LocalDate.now();
    }
}
