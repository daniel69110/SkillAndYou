package org.example.skillandyou.controller;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.document.Notification;
import org.example.skillandyou.service.NotificationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin("*")
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    public List<Notification> getMyNotifications(Authentication auth) {
        Long userId = Long.parseLong(auth.getName().replace("user-", ""));  // ← FIX
        return notificationService.getUserNotifications(userId);
    }

    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount(Authentication auth) {
        Long userId = Long.parseLong(auth.getName().replace("user-", ""));  // ← FIX
        long count = notificationService.getUnreadCount(userId);
        return Map.of("count", count);
    }

    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable String id) {
        notificationService.markAsRead(id);
    }

    @PutMapping("/read-all")
    public void markAllAsRead(Authentication auth) {
        Long userId = Long.parseLong(auth.getName().replace("user-", ""));  // ← FIX
        notificationService.markAllAsRead(userId);
    }
}