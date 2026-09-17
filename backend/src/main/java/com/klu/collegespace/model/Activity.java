package com.klu.collegespace.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
@Data
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String title;
    private String meta;
    private LocalDateTime ts;

    @PrePersist
    void onCreate() {
        if (ts == null) ts = LocalDateTime.now();
    }
}
