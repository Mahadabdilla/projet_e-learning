package com.eduafrica.controller;

import com.eduafrica.model.Notification;
import com.eduafrica.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    /**
     * Récupérer toutes les notifications de l'utilisateur connecté
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Notification>> getMyNotifications(Authentication authentication) {
        String userEmail = authentication.getName();
        List<Notification> notifications = notificationService.getUserNotifications(userEmail);
        return ResponseEntity.ok(notifications);
    }
    
    /**
     * Récupérer les notifications non lues
     */
    @GetMapping("/unread")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Notification>> getUnreadNotifications(Authentication authentication) {
        String userEmail = authentication.getName();
        List<Notification> notifications = notificationService.getUnreadNotifications(userEmail);
        return ResponseEntity.ok(notifications);
    }
    
    /**
     * Compter les notifications non lues
     */
    @GetMapping("/unread/count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Long> getUnreadCount(Authentication authentication) {
        String userEmail = authentication.getName();
        Long count = notificationService.getUnreadCount(userEmail);
        return ResponseEntity.ok(count);
    }
    
    /**
     * Marquer une notification comme lue
     */
    @PutMapping("/{notificationId}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long notificationId,
            Authentication authentication
    ) {
        try {
            String userEmail = authentication.getName();
            notificationService.markAsRead(notificationId, userEmail);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Marquer toutes les notifications comme lues
     */
    @PutMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        String userEmail = authentication.getName();
        notificationService.markAllAsRead(userEmail);
        return ResponseEntity.ok().build();
    }
    
    /**
     * Supprimer une notification
     */
    @DeleteMapping("/{notificationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long notificationId,
            Authentication authentication
    ) {
        try {
            String userEmail = authentication.getName();
            notificationService.deleteNotification(notificationId, userEmail);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Supprimer toutes les notifications lues
     */
    @DeleteMapping("/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteAllReadNotifications(Authentication authentication) {
        String userEmail = authentication.getName();
        notificationService.deleteAllReadNotifications(userEmail);
        return ResponseEntity.noContent().build();
    }
}



