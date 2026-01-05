package org.example.skillandyou.entity;

import jakarta.persistence.*;
import lombok.*;

import jakarta.persistence.ManyToMany;
import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name ="skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToMany(mappedBy = "skills")
    private Set<User> users = new HashSet<>();


}
