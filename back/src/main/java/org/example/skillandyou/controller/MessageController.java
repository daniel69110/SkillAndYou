package org.example.skillandyou.controller;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.document.Message;
import org.example.skillandyou.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;


    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestBody Map<String, Object> payload) {
        Long senderId = Long.valueOf(payload.get("senderId").toString());
        Long receiverId = Long.valueOf(payload.get("receiverId").toString());
        String content = payload.get("content").toString();
        Long exchangeId = payload.get("exchangeId") != null
                ? Long.valueOf(payload.get("exchangeId").toString())
                : null;

        Message message = messageService.sendMessage(senderId, receiverId, content, exchangeId);
        return ResponseEntity.ok(message);
    }


    @GetMapping("/conversation/{otherUserId}")
    public ResponseEntity<List<Message>> getConversation(
            @PathVariable Long otherUserId,
            @RequestParam Long currentUserId) {
        List<Message> messages = messageService.getConversation(currentUserId, otherUserId);
        return ResponseEntity.ok(messages);
    }


    @PutMapping("/{messageId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable String messageId) {
        messageService.markAsRead(messageId);
        return ResponseEntity.ok().build();
    }


    @PutMapping("/conversation/{otherUserId}/read")
    public ResponseEntity<Void> markConversationAsRead(
            @PathVariable Long otherUserId,
            @RequestParam Long currentUserId) {
        messageService.markConversationAsRead(currentUserId, otherUserId);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@RequestParam Long userId) {
        Long count = messageService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }


    @GetMapping("/recent")
    public ResponseEntity<List<Message>> getRecentMessages(@RequestParam Long userId) {
        List<Message> recent = messageService.getRecentMessages()
                .stream()
                .filter(m -> m.getSenderId().equals(userId) || m.getReceiverId().equals(userId))
                .limit(50)
                .collect(Collectors.toList());
        return ResponseEntity.ok(recent);
    }
}
