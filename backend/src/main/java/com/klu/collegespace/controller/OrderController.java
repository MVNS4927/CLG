package com.klu.collegespace.controller;

import com.klu.collegespace.model.Activity;
import com.klu.collegespace.model.Order;
import com.klu.collegespace.model.Product;
import com.klu.collegespace.repository.ActivityRepository;
import com.klu.collegespace.repository.OrderRepository;
import com.klu.collegespace.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ActivityRepository activityRepository;

    public OrderController(OrderRepository orderRepository, ProductRepository productRepository, ActivityRepository activityRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.activityRepository = activityRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Order createOrder(@RequestBody Order order) {
        order.setStatus("COMPLETED");
        Order saved = orderRepository.save(order);
        Product product = productRepository.findById(order.getProductId()).orElse(null);
        if (product != null) {
            product.setSold(true);
            product.setStatus("SOLD");
            productRepository.save(product);
        }
        Activity activity = new Activity();
        activity.setTitle("Order Purchased: " + order.getProductTitle());
        activity.setMeta("Paid ₹" + order.getAmount() + " via " + order.getPaymentMethod());
        activityRepository.save(activity);
        return saved;
    }
}