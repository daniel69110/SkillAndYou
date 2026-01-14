package org.example.skillandyou.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.skillandyou.entity.enums.ReportStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProcessReportRequestDTO {
    private Long adminId;
    private ReportStatus status;
}
