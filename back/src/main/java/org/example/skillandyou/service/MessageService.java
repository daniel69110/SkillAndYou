package org.example.skillandyou.service;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.document.Message;
import org.example.skillandyou.entity.User;
import org.example.skillandyou.repository.MessageRepository;
import org.example.skillandyou.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    public Message sendMessage(Long senderId, Long receiverId, String content, Long exchangeId) {
        Message message = Message.builder()
                .senderId(senderId)
                .receiverId(receiverId)
                .exchangeId(exchangeId)
                .content(content)
                .sentAt(LocalDateTime.now())
                .isRead(false)
                .build();

        Message saved = messageRepository.save(message);


        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        messagingTemplate.convertAndSend(
                "/topic/messages/" + receiverId,
                saved
        );

        return saved;
    }


    public List<Message> getConversation(Long user1Id, Long user2Id) {
        return messageRepository.findConversationBetween(user1Id, user2Id);
    }

    public void markAsRead(String messageId) {
        messageRepository.findById(messageId).ifPresent(msg -> {
            msg.setIsRead(true);
            messageRepository.save(msg);
        });
    }

    public void markConversationAsRead(Long currentUserId, Long otherUserId) {

        List<Message> unread = messageRepository.findUnreadMessages(currentUserId);
        unread.stream()
                .filter(msg -> msg.getSenderId().equals(otherUserId))
                .forEach(msg -> {
                    msg.setIsRead(true);
                    messageRepository.save(msg);
                });
    }


    public Long getUnreadCount(Long userId) {
        return messageRepository.countUnreadMessages(userId);
    }

    public List<Message> getRecentMessages() {
        return messageRepository.findRecentMessages();
    }

}
