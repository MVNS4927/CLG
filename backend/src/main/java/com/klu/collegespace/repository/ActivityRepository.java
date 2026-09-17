package com.klu.collegespace.repository;

import com.klu.collegespace.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, String> {
    List<Activity> findAllByOrderByTsDesc();
}
