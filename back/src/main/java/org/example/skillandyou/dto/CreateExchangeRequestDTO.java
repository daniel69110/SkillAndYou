package org.example.skillandyou.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateExchangeRequestDTO {
    private Long requesterId;
    private Long receiverId;
    private Long offeredSkillId;
    private Long requestedSkillId;
}
