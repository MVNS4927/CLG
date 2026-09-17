package com.klu.collegespace.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String title;
    private Double price;
    private String category;
    private String stream;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String type; // 'buy' or 'rent'
    private String seller;
    @JsonProperty("isSold")
    private boolean isSold;
    private String status = "AVAILABLE";
    private LocalDateTime createdAt;

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> images;

    @ElementCollection
    @CollectionTable(name = "product_warranty_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "warranty_image_url")
    private List<String> warrantyImages;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (status == null) status = "AVAILABLE";
        if (images == null) images = List.of();
        if (warrantyImages == null) warrantyImages = List.of();
    }
}
