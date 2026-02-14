package org.example.skillandyou.repository;

import org.example.skillandyou.entity.User;
import org.example.skillandyou.entity.enums.SkillType;
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
    boolean existsByEmail(String email);
    boolean existsByUserName(String userName);


    @Query("SELECT DISTINCT u FROM User u " +
            "JOIN u.userSkills us " +
            "JOIN us.skill s " +
            "WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :skillName, '%'))")
    List<User> findUsersBySkillContainingIgnoreCase(@Param("skillName") String skillName);

    @Query("""
    SELECT DISTINCT u FROM User u 
    LEFT JOIN FETCH u.userSkills us 
    LEFT JOIN us.skill s
    WHERE (:skillName IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :skillName, '%')))
      AND (:city IS NULL OR LOWER(u.city) LIKE LOWER(CONCAT('%', :city, '%')))
      AND (:type IS NULL OR us.type = :type)
      AND u.status = 'ACTIVE'
      AND u.visibleInSearch = true
    ORDER BY u.averageRating DESC NULLS LAST
    """)
    List<User> findBySearchFilters(
            @Param("skillName") String skillName,
            @Param("city") String city,
            @Param("type") SkillType type
    );

}
