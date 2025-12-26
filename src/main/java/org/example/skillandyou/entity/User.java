package org.example.skillandyou.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.skillandyou.entity.enums.Role;
import org.example.skillandyou.entity.enums.Status;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String userName;

    @Column(nullable = false, length = 50)
    private String firstName;

    @Column(nullable = false, length = 50)
    private String lastName;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status;

    private String city;
    private String postalCode;
    private String country;
    private String photoUrl;

    @Lob
    private String bio;

    @Column(nullable = false, updatable = false)
    private LocalDateTime registrationDate;

    @Column(precision = 3, scale = 2)
    private BigDecimal averageRating;

    @PrePersist
    protected void onCreate() {
        registrationDate = LocalDateTime.now();
        if (role == null) role = Role.USER;
        if (status == null) status = Status.ACTIVE;
    }
}
