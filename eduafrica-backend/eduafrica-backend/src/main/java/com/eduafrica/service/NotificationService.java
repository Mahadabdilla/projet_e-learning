package com.eduafrica.service;

import com.eduafrica.model.Notification;
import com.eduafrica.model.User;
import com.eduafrica.model.enums.NotificationType;
import com.eduafrica.repository.NotificationRepository;
import com.eduafrica.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Créer une notification
     */
    @Transactional
    public Notification createNotification(
            Long userId,
            NotificationType type,
            String title,
            String message,
            String link
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .title(title)
                .message(message)
                .link(link)
                .isRead(false)
                .build();
        
        return notificationRepository.save(notification);
    }
    
    /**
     * Créer une notification par email
     */
    @Transactional
    public Notification createNotificationByEmail(
            String userEmail,
            NotificationType type,
            String title,
            String message,
            String link
    ) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        return createNotification(user.getId(), type, title, message, link);
    }
    
    /**
     * Récupérer toutes les notifications d'un utilisateur
     */
    public List<Notification> getUserNotifications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    /**
     * Récupérer les notifications non lues d'un utilisateur
     */
    public List<Notification> getUnreadNotifications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        return notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
    }
    
    /**
     * Compter les notifications non lues
     */
    public Long getUnreadCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        return notificationRepository.countByUserAndIsReadFalse(user);
    }
    
    /**
     * Marquer une notification comme lue
     */
    @Transactional
    public void markAsRead(Long notificationId, String userEmail) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée"));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // Vérifier que la notification appartient à l'utilisateur
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Cette notification ne vous appartient pas");
        }
        
        notificationRepository.markAsRead(notificationId);
    }
    
    /**
     * Marquer toutes les notifications comme lues
     */
    @Transactional
    public void markAllAsRead(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        notificationRepository.markAllAsRead(user);
    }
    
    /**
     * Supprimer une notification
     */
    @Transactional
    public void deleteNotification(Long notificationId, String userEmail) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée"));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // Vérifier que la notification appartient à l'utilisateur
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Cette notification ne vous appartient pas");
        }
        
        notificationRepository.delete(notification);
    }
    
    /**
     * Supprimer toutes les notifications lues d'un utilisateur
     */
    @Transactional
    public void deleteAllReadNotifications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        List<Notification> readNotifications = notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .filter(Notification::getIsRead)
                .toList();
        
        notificationRepository.deleteAll(readNotifications);
    }
}



