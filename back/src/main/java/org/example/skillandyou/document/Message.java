package org.example.skillandyou.document;

import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "messages")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@CompoundIndexes({
        @CompoundIndex(name = "sender_receiver_idx", def = "{'senderId': 1, 'receiverId': 1, 'sentAt': 1}"),
        @CompoundIndex(name = "receiver_read_idx", def = "{'receiverId': 1, 'isRead': 1}")
})
public class Message {

    @Id
    private String id;

    @Indexed
    private Long senderId;

    @Indexed
    private Long receiverId;

    @Indexed
    private Long exchangeId;

    private String content;

    @Indexed
    private LocalDateTime sentAt;

    private Boolean isRead = false;
}
