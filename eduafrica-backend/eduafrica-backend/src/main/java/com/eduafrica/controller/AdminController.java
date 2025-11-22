package com.eduafrica.controller;

import com.eduafrica.model.*;
import com.eduafrica.model.enums.Role;
import com.eduafrica.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    /**
     * Obtenir les statistiques globales de la plateforme
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getPlatformStats() {
        Map<String, Object> stats = adminService.getPlatformStats();
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Récupérer tous les utilisateurs
     */
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    /**
     * Changer le rôle d'un utilisateur
     */
    @PutMapping("/users/{userId}/role")
    public ResponseEntity<User> changeUserRole(
            @PathVariable Long userId,
            @RequestParam Role role
    ) {
        try {
            User user = adminService.changeUserRole(userId, role);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Supprimer un utilisateur
     */
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        try {
            adminService.deleteUser(userId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Récupérer toutes les formations
     */
    @GetMapping("/formations")
    public ResponseEntity<List<Formation>> getAllFormations() {
        List<Formation> formations = adminService.getAllFormations();
        return ResponseEntity.ok(formations);
    }
    
    /**
     * Supprimer une formation
     */
    @DeleteMapping("/formations/{formationId}")
    public ResponseEntity<Void> deleteFormation(@PathVariable Long formationId) {
        try {
            adminService.deleteFormation(formationId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Récupérer tous les paiements
     */
    @GetMapping("/payments")
    public ResponseEntity<List<Payment>> getAllPayments() {
        List<Payment> payments = adminService.getAllPayments();
        return ResponseEntity.ok(payments);
    }
    
    /**
     * Récupérer tous les avis
     */
    @GetMapping("/reviews")
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = adminService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }
    
    /**
     * Supprimer un avis
     */
    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        try {
            adminService.deleteReview(reviewId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

