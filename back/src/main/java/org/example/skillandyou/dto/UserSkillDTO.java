package org.example.skillandyou.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSkillDTO {
    private Long id;
    private Long userId;
    private Long skillId;
    private String skillName;
    private Integer level;
    private LocalDate acquisitionDate;
}
