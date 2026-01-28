package org.example.skillandyou.document;


import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Notification {

    @Id
    private String id;

    private Long userId;
    private String type;
    private String message;


    private Long exchangeId;
    private String senderName;

    private Boolean read = false;
    private LocalDateTime createdAt = LocalDateTime.now();
}
