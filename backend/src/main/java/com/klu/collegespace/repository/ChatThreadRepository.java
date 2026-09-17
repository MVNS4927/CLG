package com.klu.collegespace.repository;

import com.klu.collegespace.model.ChatThread;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatThreadRepository extends JpaRepository<ChatThread, String> {
    List<ChatThread> findAllByOrderByUpdatedAtDesc();
}