package com.klu.collegespace.controller;

import com.klu.collegespace.model.Activity;
import com.klu.collegespace.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

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
        if (activity.getTs() == null) activity.setTs(java.time.Instant.now().toString());
        return activityRepository.save(activity);
    }

    @DeleteMapping
    public void clearAll() {
        activityRepository.deleteAll();
    }

    @DeleteMapping("/{id}")
    public void deleteActivity(@PathVariable String id) {
        if (!activityRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Activity not found");
        }
        activityRepository.deleteById(id);
    }
}
