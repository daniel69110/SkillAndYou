package org.example.skillandyou.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.skillandyou.entity.enums.ReportStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProcessReportRequestDTO {

    @NotNull
    private ReportStatus status;
}
