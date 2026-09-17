package com.klu.collegespace.repository;

import com.klu.collegespace.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, String> {
}