package com.eduafrica.repository;

import com.eduafrica.model.Conversation;
import com.eduafrica.model.Message;
import com.eduafrica.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    List<Message> findByConversationOrderByCreatedAtAsc(Conversation conversation);
    
    @Query("SELECT m FROM Message m WHERE m.conversation = :conversation " +
           "ORDER BY m.createdAt DESC")
    List<Message> findByConversationOrderByCreatedAtDesc(@Param("conversation") Conversation conversation);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiver = :user AND m.isRead = false")
    Long countUnreadMessagesByReceiver(@Param("user") User user);
    
    @Query("SELECT m FROM Message m WHERE m.conversation = :conversation AND m.receiver = :user AND m.isRead = false")
    List<Message> findUnreadMessagesInConversation(@Param("conversation") Conversation conversation, @Param("user") User user);
    
    @Query("SELECT m FROM Message m WHERE m.receiver = :user AND m.isRead = false " +
           "ORDER BY m.createdAt DESC")
    List<Message> findUnreadMessagesByReceiver(@Param("user") User user);
}


