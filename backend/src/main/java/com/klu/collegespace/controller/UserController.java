package com.klu.collegespace.controller;

import com.klu.collegespace.model.ChatThread;
import com.klu.collegespace.model.User;
import com.klu.collegespace.repository.ChatThreadRepository;
import com.klu.collegespace.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    private final UserRepository userRepository;
    private final ChatThreadRepository chatRepository;

    public UserController(UserRepository userRepository, ChatThreadRepository chatRepository) {
        this.userRepository = userRepository;
        this.chatRepository = chatRepository;
    }

    @PostMapping("/sync")
    public User syncUser(@RequestBody Map<String, Object> payload) {
        String email = String.valueOf(payload.get("email"));
        User user = userRepository.findByEmail(email).orElseGet(User::new);
        user.setEmail(email);
        user.setName(valueOr(payload, "name", user.getName() == null ? "Student" : user.getName()));
        user.setCollege(valueOr(payload, "college", null));
        user.setCollegeId(valueOr(payload, "collegeId", null));
        return userRepository.save(user);
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
}