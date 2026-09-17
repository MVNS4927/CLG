package com.klu.collegespace.model;

import jakarta.persistence.*;
import lombok.Data;
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

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> images;

    @ElementCollection
    @CollectionTable(name = "product_warranty_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "warranty_image_url")
    private List<String> warrantyImages;
}
