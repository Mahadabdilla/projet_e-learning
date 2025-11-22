package com.eduafrica.service;

import com.eduafrica.model.Message;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests du service WebSocketMessageService")
class WebSocketMessageServiceTest {
    
    @Mock
    private SimpMessagingTemplate messagingTemplate;
    
    @InjectMocks
    private WebSocketMessageService webSocketMessageService;
    
    private Message testMessage;
    
    @BeforeEach
    void setUp() {
        testMessage = Message.builder()
                .id(1L)
                .content("Test message")
                .build();
    }
    
    @Test
    @DisplayName("Devrait envoyer un message à un utilisateur spécifique")
    void shouldSendMessageToUser() {
        // When
        webSocketMessageService.sendMessageToUser(1L, testMessage);
        
        // Then
        verify(messagingTemplate).convertAndSend(eq("/queue/messages/1"), eq(testMessage));
    }
    
    @Test
    @DisplayName("Devrait envoyer un message à une conversation")
    void shouldSendMessageToConversation() {
        // When
        webSocketMessageService.sendMessageToConversation(1L, testMessage);
        
        // Then
        verify(messagingTemplate).convertAndSend(eq("/topic/conversation/1"), eq(testMessage));
    }
    
    @Test
    @DisplayName("Devrait notifier un nouvel message non lu")
    void shouldNotifyNewMessage() {
        // When
        webSocketMessageService.notifyNewMessage(1L, 5L);
        
        // Then
        verify(messagingTemplate).convertAndSend(eq("/queue/notifications/1"), any(Map.class));
    }
    
    @Test
    @DisplayName("Devrait envoyer plusieurs messages à différents utilisateurs")
    void shouldSendMultipleMessagesToDifferentUsers() {
        // When
        webSocketMessageService.sendMessageToUser(1L, testMessage);
        webSocketMessageService.sendMessageToUser(2L, testMessage);
        webSocketMessageService.sendMessageToUser(3L, testMessage);
        
        // Then
        verify(messagingTemplate, times(3)).convertAndSend(anyString(), eq(testMessage));
        verify(messagingTemplate).convertAndSend(eq("/queue/messages/1"), eq(testMessage));
        verify(messagingTemplate).convertAndSend(eq("/queue/messages/2"), eq(testMessage));
        verify(messagingTemplate).convertAndSend(eq("/queue/messages/3"), eq(testMessage));
    }
}

