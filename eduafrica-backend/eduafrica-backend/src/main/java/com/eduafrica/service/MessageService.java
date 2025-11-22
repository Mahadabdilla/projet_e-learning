package com.eduafrica.service;

import com.eduafrica.model.Conversation;
import com.eduafrica.model.Message;
import com.eduafrica.model.User;
import com.eduafrica.repository.ConversationRepository;
import com.eduafrica.repository.MessageRepository;
import com.eduafrica.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MessageService {
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private ConversationRepository conversationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired(required = false)
    private NotificationService notificationService;
    
    @Autowired(required = false)
    private WebSocketMessageService webSocketMessageService;
    
    @Transactional
    public Message sendMessage(Long receiverId, String senderEmail, String content) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Expéditeur non trouvé"));
        
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Destinataire non trouvé"));
        
        if (sender.getId().equals(receiverId)) {
            throw new RuntimeException("Vous ne pouvez pas vous envoyer un message à vous-même");
        }
        
        // Trouver ou créer la conversation
        Conversation conversation = conversationRepository
                .findConversationBetweenUsers(sender, receiver)
                .orElseGet(() -> {
                    Conversation newConversation = Conversation.builder()
                            .participant1(sender)
                            .participant2(receiver)
                            .build();
                    return conversationRepository.save(newConversation);
                });
        
        // Créer le message
        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .conversation(conversation)
                .content(content)
                .isRead(false)
                .build();
        
        message = messageRepository.save(message);
        
        // Mettre à jour la conversation avec le dernier message
        conversation.setLastMessage(message);
        conversation.setLastMessageAt(message.getCreatedAt());
        conversationRepository.save(conversation);
        
        // Créer une notification pour le destinataire
        if (notificationService != null) {
            notificationService.createNotificationByEmail(
                    receiver.getEmail(),
                    com.eduafrica.model.enums.NotificationType.NEW_MESSAGE,
                    "Nouveau message de " + sender.getFirstName() + " " + sender.getLastName(),
                    content.length() > 100 ? content.substring(0, 100) + "..." : content,
                    "/messages"
            );
        }
        
        // Envoyer le message via WebSocket en temps réel
        if (webSocketMessageService != null) {
            webSocketMessageService.sendMessageToUser(receiver.getId(), message);
            webSocketMessageService.sendMessageToConversation(conversation.getId(), message);
            
            // Notifier le nombre de messages non lus
            Long unreadCount = messageRepository.countUnreadMessagesByReceiver(receiver);
            webSocketMessageService.notifyNewMessage(receiver.getId(), unreadCount);
        }
        
        return message;
    }
    
    @Transactional
    public List<Message> getConversationMessages(Long conversationId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation non trouvée"));
        
        if (!conversation.involvesUser(user)) {
            throw new RuntimeException("Vous n'avez pas accès à cette conversation");
        }
        
        // Marquer les messages non lus comme lus
        List<Message> unreadMessages = messageRepository.findUnreadMessagesInConversation(conversation, user);
        for (Message message : unreadMessages) {
            message.markAsRead();
            messageRepository.save(message);
        }
        
        return messageRepository.findByConversationOrderByCreatedAtAsc(conversation);
    }
    
    public List<Conversation> getUserConversations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        return conversationRepository.findByParticipantOrderByLastMessage(user);
    }
    
    @Transactional
    public Conversation getOrCreateConversation(Long otherUserId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        return conversationRepository
                .findConversationBetweenUsers(user, otherUser)
                .orElseGet(() -> {
                    Conversation newConversation = Conversation.builder()
                            .participant1(user)
                            .participant2(otherUser)
                            .build();
                    return conversationRepository.save(newConversation);
                });
    }
    
    @Transactional
    public void markMessagesAsRead(Long conversationId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation non trouvée"));
        
        if (!conversation.involvesUser(user)) {
            throw new RuntimeException("Vous n'avez pas accès à cette conversation");
        }
        
        List<Message> unreadMessages = messageRepository.findUnreadMessagesInConversation(conversation, user);
        for (Message message : unreadMessages) {
            message.markAsRead();
            messageRepository.save(message);
        }
    }
    
    public Long getUnreadMessageCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        return messageRepository.countUnreadMessagesByReceiver(user);
    }
    
    public List<Message> getUnreadMessages(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        return messageRepository.findUnreadMessagesByReceiver(user);
    }
}

