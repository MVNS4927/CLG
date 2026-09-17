package com.klu.collegespace.config;

import com.klu.collegespace.model.Activity;
import com.klu.collegespace.model.Product;
import com.klu.collegespace.repository.ActivityRepository;
import com.klu.collegespace.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seed(ProductRepository products, ActivityRepository activities) {
        return args -> {
            if (products.count() > 0) return;

            products.saveAll(List.of(
                    product("Casio FX-991EX Scientific Calculator", 850, "Calculators", "Engineering", "Mint condition non-programmable scientific calculator approved for semester exams. Solar powered.", "buy", "Rahul Sharma (CSE-3rd Year)", "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80"),
                    product("Arduino Uno Ultimate Starter Kit", 1200, "Electronics", "ECE", "Complete kit with sensors, breadboard, LCD display, jumper wires, and motors. Perfect for lab projects.", "buy", "Priya Verma (ECE-4th Year)", "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80"),
                    product("Medical Lab Coat & Stethoscope", 150, "Lab Equipment", "Medical", "Clean white cotton lab coat (Size M) along with standard Littmann stethoscope for daily clinical rotations.", "rent", "Dr. Ananya Roy (MBBS-2nd Year)", "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=600&auto=format&fit=crop&q=80"),
                    product("Engineering Graphics Drawing Board & T-Square", 450, "Drawing Kits", "Mechanical", "Standard wooden drawing board with acrylic T-Square and set-squares for 1st year EG lab.", "buy", "Vikram Singh (ME-2nd Year)", "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80")
            ));

            Activity welcome = new Activity();
            welcome.setTitle("Welcome to CLG Space Marketplace");
            welcome.setMeta("Java Spring Boot & PostgreSQL Backend Connected");
            Activity initialized = new Activity();
            initialized.setTitle("System Initialization");
            initialized.setMeta("Seeded initial campus marketplace items");
            activities.saveAll(List.of(welcome, initialized));
        };
    }

    private Product product(String title, double price, String category, String stream, String description,
                            String type, String seller, String image) {
        Product product = new Product();
        product.setTitle(title);
        product.setPrice(price);
        product.setCategory(category);
        product.setStream(stream);
        product.setDescription(description);
        product.setType(type);
        product.setSeller(seller);
        product.setImages(List.of(image));
        product.setWarrantyImages(List.of());
        return product;
    }
}
