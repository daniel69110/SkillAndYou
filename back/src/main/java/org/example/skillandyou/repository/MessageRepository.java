package org.example.skillandyou.repository;

import org.example.skillandyou.document.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {


    @Query("{ $or: [ " +
            "{ 'senderId': ?0, 'receiverId': ?1 }, " +
            "{ 'senderId': ?1, 'receiverId': ?0 } " +
            "] }")
    List<Message> findConversationBetween(Long user1Id, Long user2Id);


    @Query("{ 'receiverId': ?0, 'isRead': false }")
    List<Message> findUnreadMessages(Long receiverId);


    @Query(value = "{ 'receiverId': ?0, 'isRead': false }", count = true)
    Long countUnreadMessages(Long receiverId);


    @Query(value = "{}", sort = "{ 'sentAt': -1 }")
    List<Message> findRecentMessages();

}
