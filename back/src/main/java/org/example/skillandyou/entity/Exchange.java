package org.example.skillandyou.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.skillandyou.entity.enums.ExchangeStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "Exchanges")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Exchange {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @ManyToOne
    @JoinColumn(name = "requester_id")
    private User requester;

    @ManyToOne
    @JoinColumn(name ="offered_skill_id", nullable = false)
    private Skill offeredSkill;

    @ManyToOne
    @JoinColumn(name = "requested_skill_id", nullable = false)
    private Skill requestedSkill;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExchangeStatus status;

    @Column(nullable = false)
    private LocalDateTime creationDate;

    @Column
    private LocalDateTime acceptanceDate;

    @Column
    private LocalDateTime completionDate;

    @PrePersist
    protected void onCreate() {
        creationDate = LocalDateTime.now();
        if (status == null) {
            status = ExchangeStatus.PENDING;
        }
    }
}
