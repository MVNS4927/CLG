package com.klu.collegespace.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "orders")
@Data
public class Order {
    @Id
    private String id;
    private String productId;
    private String productTitle;
    private Double amount;
    private String paymentMethod;
    private String buyerName;
    private String buyerEmail;
    private String status;
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (id == null) id = UUID.randomUUID().toString();
        if (status == null) status = "COMPLETED";
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}