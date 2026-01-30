package org.example.skillandyou.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportRequestDTO {

    @NotNull(message = "User à signaler requis")
    private Long reportedUserId;

    private Long exchangeId;

    @NotNull(message = "Raison requise")
    private String reason;

    @NotNull(message = "Description requise")
    private String description;
}
