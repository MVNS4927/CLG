package com.klu.collegespace.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String name;
    @Column(unique = true, nullable = false)
    private String email;
    @JsonIgnore
    @Column(name = "password_hash")
    private String passwordHash;
    private String college;
    @Column(name = "college_id", unique = true, nullable = false)
    private String collegeId;
}
