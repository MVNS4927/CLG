package com.klu.collegespace.repository;

import com.klu.collegespace.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findByType(String type);
}
