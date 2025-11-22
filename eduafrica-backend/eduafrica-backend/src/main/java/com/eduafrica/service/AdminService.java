package com.eduafrica.service;

import com.eduafrica.model.*;
import com.eduafrica.model.enums.Role;
import com.eduafrica.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FormationRepository formationRepository;
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private MentorProfileRepository mentorProfileRepository;
    
    @Autowired
    private MentoringRequestRepository mentoringRequestRepository;
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    /**
     * Obtenir les statistiques globales de la plateforme avec données pour graphiques
     */
    public Map<String, Object> getPlatformStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Statistiques utilisateurs
        long totalUsers = userRepository.count();
        long apprenants = userRepository.countByRole(Role.APPRENANT);
        long formateurs = userRepository.countByRole(Role.FORMATEUR);
        long mentors = userRepository.countByRole(Role.MENTOR);
        long admins = userRepository.countByRole(Role.ADMIN);
        
        stats.put("totalUsers", totalUsers);
        stats.put("apprenants", apprenants);
        stats.put("formateurs", formateurs);
        stats.put("mentors", mentors);
        stats.put("admins", admins);
        
        // Statistiques formations
        long totalFormations = formationRepository.count();
        long freeFormations = formationRepository.countByIsFree(true);
        long paidFormations = formationRepository.countByIsFree(false);
        
        stats.put("totalFormations", totalFormations);
        stats.put("freeFormations", freeFormations);
        stats.put("paidFormations", paidFormations);
        
        // Statistiques inscriptions
        long totalEnrollments = enrollmentRepository.count();
        stats.put("totalEnrollments", totalEnrollments);
        
        // Statistiques paiements
        long totalPayments = paymentRepository.count();
        long completedPayments = paymentRepository.countByStatus(com.eduafrica.model.enums.PaymentStatus.COMPLETED);
        stats.put("totalPayments", totalPayments);
        stats.put("completedPayments", completedPayments);
        
        // Statistiques mentorat
        long totalMentors = mentorProfileRepository.count();
        long availableMentors = mentorProfileRepository.countByIsAvailable(true);
        long totalMentoringRequests = mentoringRequestRepository.count();
        stats.put("totalMentors", totalMentors);
        stats.put("availableMentors", availableMentors);
        stats.put("totalMentoringRequests", totalMentoringRequests);
        
        // Statistiques avis
        long totalReviews = reviewRepository.count();
        stats.put("totalReviews", totalReviews);
        
        // Données pour graphiques (simulées - à améliorer avec vraies données temporelles)
        Map<String, Object> chartData = new HashMap<>();
        chartData.put("enrollmentsByMonth", java.util.Arrays.asList(10, 25, 35, 45, 60, totalEnrollments));
        chartData.put("roleDistribution", java.util.Arrays.asList(apprenants, formateurs, mentors, admins));
        stats.put("chartData", chartData);
        
        return stats;
    }
    
    /**
     * Récupérer tous les utilisateurs
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    /**
     * Activer/désactiver un utilisateur
     */
    public User toggleUserStatus(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        // Note: L'entité User n'a pas de champ enabled pour l'instant
        // On pourrait ajouter ce champ si nécessaire
        return userRepository.save(user);
    }
    
    /**
     * Changer le rôle d'un utilisateur
     */
    public User changeUserRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        user.setRole(newRole);
        return userRepository.save(user);
    }
    
    /**
     * Supprimer un utilisateur
     */
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        userRepository.delete(user);
    }
    
    /**
     * Récupérer toutes les formations
     */
    public List<Formation> getAllFormations() {
        return formationRepository.findAll();
    }
    
    /**
     * Supprimer une formation
     */
    public void deleteFormation(Long formationId) {
        if (!formationRepository.existsById(formationId)) {
            throw new RuntimeException("Formation non trouvée");
        }
        formationRepository.deleteById(formationId);
    }
    
    /**
     * Récupérer tous les paiements
     */
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
    
    /**
     * Récupérer tous les avis
     */
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
    
    /**
     * Supprimer un avis
     */
    public void deleteReview(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new RuntimeException("Avis non trouvé");
        }
        reviewRepository.deleteById(reviewId);
    }
}

