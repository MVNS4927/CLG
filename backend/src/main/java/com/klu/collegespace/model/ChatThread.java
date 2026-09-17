package com.klu.collegespace.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "chat_threads")
@Data
public class ChatThread {
    @Id
    private String id;
    private String userEmail;
    private String partnerName;
    private String productId;

    @JdbcTypeCode(SqlTypes.JSON)
    private List<Map<String, Object>> messages = new ArrayList<>();

    private String updatedAt;

    @PrePersist
    @PreUpdate
    void touch() {
        updatedAt = java.time.Instant.now().toString();
        if (messages == null) messages = new ArrayList<>();
    }
}