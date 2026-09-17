package com.klu.collegespace.controller;

import com.klu.collegespace.model.ChatThread;
import com.klu.collegespace.model.User;
import com.klu.collegespace.repository.ChatThreadRepository;
import com.klu.collegespace.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    private final UserRepository userRepository;
    private final ChatThreadRepository chatRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserController(UserRepository userRepository, ChatThreadRepository chatRepository) {
        this.userRepository = userRepository;
        this.chatRepository = chatRepository;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public User register(@RequestBody Map<String, Object> payload) {
        String email = required(payload, "email").toLowerCase();
        String password = required(payload, "password");
        if (password.length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account already exists for this email");
        }
        if (userRepository.findByCollegeId(required(payload, "collegeId")).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account already exists for this college ID");
        }
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setName(required(payload, "name"));
        user.setCollege(required(payload, "college"));
        user.setCollegeId(payload.get("collegeId").toString().trim());
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody Map<String, Object> payload) {
        String identifier = required(payload, "identifier");
        String password = required(payload, "password");
        User user = findByIdentifier(identifier)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        if (user.getPasswordHash() == null || !passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
        return user;
    }

    private java.util.Optional<User> findByIdentifier(String identifier) {
        if (identifier.contains("@")) return userRepository.findByEmail(identifier.toLowerCase());
        return userRepository.findByCollegeId(identifier);
    }

    @PostMapping("/chats")
    public ChatThread saveChat(@RequestBody ChatThread chat) {
        ChatThread stored = chatRepository.findById(chat.getId()).orElseGet(ChatThread::new);
        stored.setId(chat.getId());
        stored.setUserEmail(chat.getUserEmail());
        stored.setPartnerName(chat.getPartnerName());
        stored.setProductId(chat.getProductId());
        stored.setMessages(chat.getMessages());
        return chatRepository.save(stored);
    }

    private String valueOr(Map<String, Object> payload, String key, String fallback) {
        Object value = payload.get(key);
        return value == null ? fallback : String.valueOf(value);
    }

    private String required(Map<String, Object> payload, String key) {
        String value = valueOr(payload, key, "").trim();
        if (value.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, key + " is required");
        return value;
    }
}