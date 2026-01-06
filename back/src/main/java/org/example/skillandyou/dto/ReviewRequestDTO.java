package org.example.skillandyou.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequestDTO {
    @Min(1)
    @Max(5)
    private Integer rating;
    private String comment;
}

