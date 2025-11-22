package com.eduafrica.controller;

import com.eduafrica.model.Conversation;
import com.eduafrica.model.Message;
import com.eduafrica.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    
    @Autowired
    private MessageService messageService;
    
    @PostMapping("/send")
    @PreAuthorize("hasAnyRole('APPRENANT', 'FORMATEUR', 'MENTOR')")
    public ResponseEntity<Message> sendMessage(
            @RequestBody Map<String, Object> request,
            Authentication authentication
    ) {
        try {
            String senderEmail = authentication.getName();
            Long receiverId = Long.valueOf(request.get("receiverId").toString());
            String content = request.get("content").toString();
            
            Message message = messageService.sendMessage(receiverId, senderEmail, content);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/conversations")
    @PreAuthorize("hasAnyRole('APPRENANT', 'FORMATEUR', 'MENTOR')")
    public ResponseEntity<List<Conversation>> getMyConversations(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<Conversation> conversations = messageService.getUserConversations(userEmail);
            return ResponseEntity.ok(conversations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/conversations/{conversationId}/messages")
    @PreAuthorize("hasAnyRole('APPRENANT', 'FORMATEUR', 'MENTOR')")
    public ResponseEntity<List<Message>> getConversationMessages(
            @PathVariable Long conversationId,
            Authentication authentication
    ) {
        try {
            String userEmail = authentication.getName();
            List<Message> messages = messageService.getConversationMessages(conversationId, userEmail);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/conversations")
    @PreAuthorize("hasAnyRole('APPRENANT', 'FORMATEUR', 'MENTOR')")
    public ResponseEntity<Conversation> getOrCreateConversation(
            @RequestBody Map<String, Long> request,
            Authentication authentication
    ) {
        try {
            String userEmail = authentication.getName();
            Long otherUserId = request.get("otherUserId");
            Conversation conversation = messageService.getOrCreateConversation(otherUserId, userEmail);
            return ResponseEntity.ok(conversation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/conversations/{conversationId}/read")
    @PreAuthorize("hasAnyRole('APPRENANT', 'FORMATEUR', 'MENTOR')")
    public ResponseEntity<Void> markMessagesAsRead(
            @PathVariable Long conversationId,
            Authentication authentication
    ) {
        try {
            String userEmail = authentication.getName();
            messageService.markMessagesAsRead(conversationId, userEmail);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/unread/count")
    @PreAuthorize("hasAnyRole('APPRENANT', 'FORMATEUR', 'MENTOR')")
    public ResponseEntity<Long> getUnreadMessageCount(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            Long count = messageService.getUnreadMessageCount(userEmail);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/unread")
    @PreAuthorize("hasAnyRole('APPRENANT', 'FORMATEUR', 'MENTOR')")
    public ResponseEntity<List<Message>> getUnreadMessages(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<Message> messages = messageService.getUnreadMessages(userEmail);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}


