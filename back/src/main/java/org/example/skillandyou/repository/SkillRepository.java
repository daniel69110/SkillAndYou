package org.example.skillandyou.repository;

import org.example.skillandyou.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    boolean existsByName(String name);
}
