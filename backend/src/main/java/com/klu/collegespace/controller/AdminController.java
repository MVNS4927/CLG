package com.klu.collegespace.controller;

import com.klu.collegespace.model.ChatThread;
import com.klu.collegespace.model.Product;
import com.klu.collegespace.model.User;
import com.klu.collegespace.repository.ChatThreadRepository;
import com.klu.collegespace.repository.ProductRepository;
import com.klu.collegespace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ChatThreadRepository chatRepository;
    private final String adminEmails;
    private final String accessKey;

    public AdminController(ProductRepository productRepository, UserRepository userRepository,
                           ChatThreadRepository chatRepository,
                           @Value("${admin.emails:}") String adminEmails,
                           @Value("${admin.access-key:}") String accessKey) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.chatRepository = chatRepository;
        this.adminEmails = adminEmails;
        this.accessKey = accessKey;
    }

    @GetMapping("/overview")
    public Map<String, Object> overview(@RequestHeader(value = "X-Admin-Email", required = false) String email,
                                        @RequestHeader(value = "X-Admin-Key", required = false) String key) {
        requireAdmin(email, key);
        return Map.of("users", userRepository.findAllByOrderByIdDesc(),
                "products", productRepository.findAllByOrderByCreatedAtDesc(),
                "chats", chatRepository.findAllByOrderByUpdatedAtDesc());
    }

    @PostMapping("/products")
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(@RequestHeader(value = "X-Admin-Email", required = false) String email,
                                 @RequestHeader(value = "X-Admin-Key", required = false) String key,
                                 @RequestBody Product product) {
        requireAdmin(email, key);
        return productRepository.save(product);
    }

    @DeleteMapping("/products/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@RequestHeader(value = "X-Admin-Email", required = false) String email,
                              @RequestHeader(value = "X-Admin-Key", required = false) String key,
                              @PathVariable String id) {
        requireAdmin(email, key);
        if (!productRepository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        productRepository.deleteById(id);
    }

    private void requireAdmin(String email, String key) {
        boolean allowedEmail = email != null && Arrays.stream(adminEmails.split(","))
                .map(String::trim).map(String::toLowerCase).anyMatch(email.toLowerCase()::equals);
        if (!allowedEmail || accessKey.isBlank() || !accessKey.equals(key)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }
    }
}