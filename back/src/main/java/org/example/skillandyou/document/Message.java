package org.example.skillandyou.document;

import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "messages")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Message {

    @Id
    private String id;


    private Long senderId;
    private Long receiverId;
    private Long exchangeId;

    private String content;
    private LocalDateTime sentAt;
    private Boolean isRead = false;
}
