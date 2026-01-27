package org.example.skillandyou.dto;

import lombok.Data;

@Data
public class UpdateUserDTO {
    private String firstName;
    private String lastName;
    private String userName;
    private String bio;
    private String city;
    private String country;
    private String postalCode;
    private String photoUrl;
}
