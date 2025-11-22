package com.eduafrica.service;

import com.eduafrica.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class WebSocketMessageService {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    public void sendMessageToUser(Long userId, Message message) {
        messagingTemplate.convertAndSend("/queue/messages/" + userId, message);
    }
    
    public void sendMessageToConversation(Long conversationId, Message message) {
        messagingTemplate.convertAndSend("/topic/conversation/" + conversationId, message);
    }
    
    public void notifyNewMessage(Long userId, Long unreadCount) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "NEW_MESSAGE");
        notification.put("unreadCount", unreadCount);
        messagingTemplate.convertAndSend("/queue/notifications/" + userId, notification);
    }
}

