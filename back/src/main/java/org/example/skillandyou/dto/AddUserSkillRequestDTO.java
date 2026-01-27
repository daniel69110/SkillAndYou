package org.example.skillandyou.dto;

import lombok.Data;

@Data
public class AddUserSkillRequestDTO {
    private Long skillId;
    private String type;  // "OFFER" ou "REQUEST"
    private Integer level;
}
