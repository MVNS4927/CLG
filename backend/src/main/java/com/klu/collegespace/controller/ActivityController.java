package com.klu.collegespace.controller;

import com.klu.collegespace.model.Activity;
import com.klu.collegespace.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "http://localhost:5173")
public class ActivityController {

    @Autowired
    private ActivityRepository activityRepository;

    @GetMapping
    public List<Activity> getRecentActivities() {
        return activityRepository.findAllByOrderByTsDesc();
    }

    @PostMapping
    public Activity logActivity(@RequestBody Activity activity) {
        activity.setTs(LocalDateTime.now());
        return activityRepository.save(activity);
    }

    @DeleteMapping
    public void clearAll() {
        activityRepository.deleteAll();
    }

    @DeleteMapping("/{id}")
    public void deleteActivity(@PathVariable String id) {
        activityRepository.deleteById(id);
    }
}
