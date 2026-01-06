package org.example.skillandyou.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "user_skills")
@Data
public class UserSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    private LocalDate acquisitionDate;
    private Integer level; // 1-5

    @PrePersist
    protected void onCreate() {
        if (acquisitionDate == null) {
            acquisitionDate = LocalDate.now();
        }
    }
}
