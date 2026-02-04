package org.example.skillandyou.service;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.entity.User;
import org.example.skillandyou.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfilePictureService {

    private final UserRepository userRepository;

    @Value("${upload.path:uploads/profile-pictures}")
    private String uploadPath;

    public String saveProfilePicture(Long userId, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Le fichier est vide");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Le fichier doit être une image");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("L'image ne doit pas dépasser 5MB");
        }

        Path uploadDir = Paths.get(uploadPath);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        // Supprimer l'ancienne photo si elle existe
        deleteOldPhoto(userId);

        String extension = getFileExtension(file.getOriginalFilename());
        String filename = userId + "_" + UUID.randomUUID() + extension;
        Path filePath = uploadDir.resolve(filename);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        String photoUrl = "/api/users/" + userId + "/profile-picture";
        user.setPhotoUrl(photoUrl);
        userRepository.save(user);

        return photoUrl;
    }

    public byte[] getProfilePicture(Long userId) throws IOException {
        System.out.println("🖼️ Service getProfilePicture appelé pour user " + userId);
        Path uploadDir = Paths.get(uploadPath);

        Path[] files = Files.list(uploadDir)
                .filter(path -> path.getFileName().toString().startsWith(userId + "_"))
                .toArray(Path[]::new);

        if (files.length == 0) {
            throw new RuntimeException("Photo introuvable");
        }

        return Files.readAllBytes(files[0]);
    }

    public void deleteProfilePicture(Long userId) throws IOException {
        deleteOldPhoto(userId);

        User user = userRepository.findById(userId).orElseThrow();
        user.setPhotoUrl(null);
        userRepository.save(user);
    }

    private void deleteOldPhoto(Long userId) throws IOException {
        Path uploadDir = Paths.get(uploadPath);
        if (!Files.exists(uploadDir)) return;

        Files.list(uploadDir)
                .filter(path -> path.getFileName().toString().startsWith(userId + "_"))
                .forEach(path -> {
                    try {
                        Files.delete(path);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                });
    }

    private String getFileExtension(String filename) {
        if (filename == null) return ".jpg";
        int lastDot = filename.lastIndexOf('.');
        return lastDot > 0 ? filename.substring(lastDot) : ".jpg";
    }
}
