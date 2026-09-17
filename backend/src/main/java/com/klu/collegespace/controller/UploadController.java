package com.klu.collegespace.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class UploadController {
    private final Path uploadDirectory;

    public UploadController(@Value("${app.upload-dir:uploads}") String uploadDir) {
        try {
            uploadDirectory = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadDirectory);
        } catch (IOException exception) {
            throw new IllegalStateException("Could not create upload directory", exception);
        }
    }

    @PostMapping("/api/upload")
    public Map<String, String> upload(@RequestParam("file") MultipartFile file) {
        String filename = store(file, "");
        return Map.of("url", publicUrl(filename));
    }

    @PostMapping("/api/upload-drive")
    public Map<String, String> uploadDrive(@RequestParam("file") MultipartFile file) {
        String filename = store(file, "drive_");
        return Map.of("status", "success", "url", publicUrl(filename), "drive_file_id", filename,
                "message", "File successfully uploaded and stored for public viewing.");
    }

    @GetMapping("/uploads/{filename:.+}")
    @ResponseBody
    public byte[] download(@PathVariable String filename) {
        try {
            Path file = uploadDirectory.resolve(filename).normalize();
            if (!file.startsWith(uploadDirectory) || !Files.exists(file)) throw new IOException();
            return Files.readAllBytes(file);
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found");
        }
    }

    private String store(MultipartFile file, String prefix) {
        if (file.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is empty");
        String original = file.getOriginalFilename() == null ? ".jpg" : file.getOriginalFilename();
        String extension = original.contains(".") ? original.substring(original.lastIndexOf('.')) : ".jpg";
        String filename = prefix + UUID.randomUUID() + extension;
        try {
            file.transferTo(uploadDirectory.resolve(filename));
            return filename;
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not save file", exception);
        }
    }

    private String publicUrl(String filename) {
        return "http://localhost:8080/uploads/" + filename;
    }
}