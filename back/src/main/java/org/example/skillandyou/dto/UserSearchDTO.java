package org.example.skillandyou.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserSearchDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String userName;
    private String city;
    private String country;
    private String photoUrl;
    private Double averageRating;
    private List<UserSkillDTO> userSkills;
}
