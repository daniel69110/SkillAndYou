package org.example.skillandyou.controller;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.service.ProfilePictureService;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfilePictureController {

    private final ProfilePictureService profilePictureService;

    @PostMapping("/{userId}/profile-picture")
    public ResponseEntity<String> uploadProfilePicture(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal String principal
    ) throws IOException {


        String contentType = file.getContentType();
        if (!isValidImageType(contentType)) {
            return ResponseEntity.badRequest()
                    .body("Format non autorisé. Utilisez JPG, PNG ou WebP uniquement.");
        }

        Long currentUserId = Long.parseLong(principal.replace("user-", ""));
        if (!currentUserId.equals(userId)) {
            return ResponseEntity.status(403).body("Non autorisé");
        }

        String photoUrl = profilePictureService.saveProfilePicture(userId, file);
        return ResponseEntity.ok(photoUrl);
    }


    private boolean isValidImageType(String contentType) {
        return contentType != null && (
                contentType.equals("image/jpeg") ||
                        contentType.equals("image/jpg") ||
                        contentType.equals("image/png") ||
                        contentType.equals("image/webp")
        );
    }


    @GetMapping("/{userId}/profile-picture")
    public ResponseEntity<byte[]> getProfilePicture(@PathVariable Long userId) throws IOException {
        System.out.println("🖼️ GET profile-picture pour user " + userId);
        byte[] image = profilePictureService.getProfilePicture(userId);
        System.out.println("📏 Taille image renvoyée: " + (image != null ? image.length : 0));
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .cacheControl(CacheControl.noCache().mustRevalidate())
                .body(image);
    }

    @DeleteMapping("/{userId}/profile-picture")
    public ResponseEntity<Void> deleteProfilePicture(
            @PathVariable Long userId,
            @AuthenticationPrincipal String principal
    ) throws IOException {
        Long currentUserId = Long.parseLong(principal.replace("user-", ""));
        if (!currentUserId.equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        profilePictureService.deleteProfilePicture(userId);
        return ResponseEntity.noContent().build();
    }
}
