package org.example.skillandyou.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SuspendUserRequestDTO {
    @NotNull(message = "Date de fin requise")
    @Future(message = "La date de fin doit être dans le futur")
    private LocalDate endDate;

    @NotBlank(message = "Raison requise")
    private String reason;


}
