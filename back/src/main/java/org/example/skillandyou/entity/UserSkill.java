package org.example.skillandyou.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.example.skillandyou.entity.enums.SkillType;

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
    private Integer level;

    @Enumerated(EnumType.STRING)  // ← AJOUTE
    @Column(nullable = false)     // ← AJOUTE
    private SkillType type;

    @PrePersist
    protected void onCreate() {
        if (acquisitionDate == null) {
            acquisitionDate = LocalDate.now();
        }
    }
}
