package org.example.skillandyou.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDTO {

  @NotBlank(message = "L'email est obligatoire")
  @Email(message = "Format d'email invalide")
  private String email;

  @NotBlank(message = "Le nom d'utilisateur est obligatoire")
  @Size(min = 3, max = 30, message = "Le nom d'utilisateur doit contenir entre 3 et 30 caractères")
  private String userName;

  @NotBlank(message = "Le prénom est obligatoire")
  private String firstName;

  @NotBlank(message = "Le nom est obligatoire")
  private String lastName;

  @NotBlank(message = "Le mot de passe est obligatoire")
  @Pattern(
          regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9\\s]).{8,128}$",
          message = "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
  )
  private String password;
}
