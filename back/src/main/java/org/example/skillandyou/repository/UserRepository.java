package org.example.skillandyou.repository;

import org.example.skillandyou.entity.User;
import org.example.skillandyou.entity.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByStatus(Status status);

    List<User> findByCityContainingIgnoreCase(String city);

    @Query("SELECT DISTINCT u FROM User u " +
            "JOIN u.userSkills us " +
            "JOIN us.skill s " +
            "WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :skillName, '%'))")
    List<User> findUsersBySkillContainingIgnoreCase(@Param("skillName") String skillName);

}
