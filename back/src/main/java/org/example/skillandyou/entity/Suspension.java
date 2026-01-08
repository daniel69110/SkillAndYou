package org.example.skillandyou.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "Suspensions")
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
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private User admin;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @PrePersist
    protected void onCreate() {
        if (startDate == null) startDate = LocalDate.now();
    }
}
