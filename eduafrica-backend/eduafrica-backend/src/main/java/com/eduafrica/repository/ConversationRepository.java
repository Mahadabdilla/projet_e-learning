package com.eduafrica.repository;

import com.eduafrica.model.Conversation;
import com.eduafrica.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    
    @Query("SELECT c FROM Conversation c WHERE " +
           "(c.participant1 = :user OR c.participant2 = :user) " +
           "ORDER BY c.lastMessageAt DESC NULLS LAST, c.createdAt DESC")
    List<Conversation> findByParticipantOrderByLastMessage(@Param("user") User user);
    
    @Query("SELECT c FROM Conversation c WHERE " +
           "((c.participant1 = :user1 AND c.participant2 = :user2) OR " +
           "(c.participant1 = :user2 AND c.participant2 = :user1))")
    Optional<Conversation> findConversationBetweenUsers(@Param("user1") User user1, @Param("user2") User user2);
    
    @Query("SELECT COUNT(c) FROM Conversation c WHERE " +
           "(c.participant1 = :user OR c.participant2 = :user)")
    Long countByParticipant(@Param("user") User user);
}


