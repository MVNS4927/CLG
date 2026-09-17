package com.klu.springmvc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.klu")
@EntityScan("com.klu.collegespace.model")
@EnableJpaRepositories("com.klu.collegespace.repository")
public class CollegeSpaceBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CollegeSpaceBackendApplication.class, args);
	}

}
