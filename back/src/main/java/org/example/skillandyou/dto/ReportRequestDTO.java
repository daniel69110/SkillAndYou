package org.example.skillandyou.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportRequestDTO {
    private Long reporterId;
    private Long reportedUserId;
    private Long exchangeId;
    private String reason;
    private String description;
}
