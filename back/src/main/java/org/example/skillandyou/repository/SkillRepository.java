package org.example.skillandyou.repository;

import org.example.skillandyou.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    boolean existsByName(String name);

    @Query("SELECT DISTINCT s FROM Skill s " +
            "JOIN s.userSkills us WHERE us.user.id = :userId")
    List<Skill> findSkillsByUserId(@Param("userId") Long userId);

}
