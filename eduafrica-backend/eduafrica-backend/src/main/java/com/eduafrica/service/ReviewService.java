package com.eduafrica.service;

import com.eduafrica.model.Enrollment;
import com.eduafrica.model.Formation;
import com.eduafrica.model.Review;
import com.eduafrica.model.User;
import com.eduafrica.repository.EnrollmentRepository;
import com.eduafrica.repository.FormationRepository;
import com.eduafrica.repository.ReviewRepository;
import com.eduafrica.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FormationRepository formationRepository;
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    /**
     * Créer un avis pour une formation
     * L'utilisateur doit avoir complété la formation (progression >= 100%)
     */
    @Transactional
    public Review createReview(Long formationId, Integer rating, String comment, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation non trouvée"));
        
        // Vérifier si l'utilisateur a déjà laissé un avis
        Optional<Review> existingReview = reviewRepository.findByUserAndFormation(user, formation);
        if (existingReview.isPresent()) {
            throw new RuntimeException("Vous avez déjà laissé un avis pour cette formation");
        }
        
        // Vérifier si l'utilisateur a complété la formation
        Optional<Enrollment> enrollment = enrollmentRepository.findByUserAndFormation(user, formation);
        if (enrollment.isEmpty()) {
            throw new RuntimeException("Vous devez être inscrit à cette formation pour laisser un avis");
        }
        
        Enrollment enrollmentObj = enrollment.get();
        if (enrollmentObj.getProgress() == null || enrollmentObj.getProgress() < 100) {
            throw new RuntimeException("Vous devez compléter la formation (100%) avant de laisser un avis");
        }
        
        // Créer l'avis
        Review review = Review.builder()
                .user(user)
                .formation(formation)
                .rating(rating)
                .comment(comment)
                .isApproved(true) // Par défaut approuvé
                .build();
        
        review = reviewRepository.save(review);
        
        // Recalculer la note moyenne de la formation
        updateFormationAverageRating(formation);
        
        return review;
    }
    
    /**
     * Mettre à jour un avis existant
     */
    @Transactional
    public Review updateReview(Long reviewId, Integer rating, String comment, String userEmail) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé"));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // Vérifier que l'avis appartient à l'utilisateur
        if (!review.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier cet avis");
        }
        
        // Mettre à jour
        if (rating != null) {
            review.setRating(rating);
        }
        if (comment != null) {
            review.setComment(comment);
        }
        
        review = reviewRepository.save(review);
        
        // Recalculer la note moyenne
        updateFormationAverageRating(review.getFormation());
        
        return review;
    }
    
    /**
     * Supprimer un avis
     */
    @Transactional
    public void deleteReview(Long reviewId, String userEmail) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé"));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // Vérifier que l'avis appartient à l'utilisateur ou que l'utilisateur est admin
        if (!review.getUser().getId().equals(user.getId()) && user.getRole() != com.eduafrica.model.enums.Role.ADMIN) {
            throw new RuntimeException("Vous n'êtes pas autorisé à supprimer cet avis");
        }
        
        Formation formation = review.getFormation();
        reviewRepository.delete(review);
        
        // Recalculer la note moyenne
        updateFormationAverageRating(formation);
    }
    
    /**
     * Récupérer tous les avis d'une formation (approuvés uniquement)
     */
    public List<Review> getFormationReviews(Long formationId) {
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation non trouvée"));
        
        return reviewRepository.findByFormationAndIsApprovedTrue(formation);
    }
    
    /**
     * Récupérer tous les avis d'un utilisateur
     */
    public List<Review> getUserReviews(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        return reviewRepository.findByUser(user);
    }
    
    /**
     * Récupérer un avis spécifique
     */
    public Optional<Review> getReview(Long reviewId) {
        return reviewRepository.findById(reviewId);
    }
    
    /**
     * Vérifier si un utilisateur peut laisser un avis pour une formation
     */
    public boolean canUserReview(Long formationId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation non trouvée"));
        
        // Vérifier si l'utilisateur a déjà laissé un avis
        if (reviewRepository.findByUserAndFormation(user, formation).isPresent()) {
            return false;
        }
        
        // Vérifier si l'utilisateur a complété la formation
        Optional<Enrollment> enrollment = enrollmentRepository.findByUserAndFormation(user, formation);
        if (enrollment.isEmpty()) {
            return false;
        }
        
        Enrollment enrollmentObj = enrollment.get();
        return enrollmentObj.getProgress() != null && enrollmentObj.getProgress() >= 100;
    }
    
    /**
     * Recalculer et mettre à jour la note moyenne d'une formation
     */
    @Transactional
    private void updateFormationAverageRating(Formation formation) {
        Double averageRating = reviewRepository.calculateAverageRating(formation);
        if (averageRating == null) {
            averageRating = 0.0;
        }
        
        formation.setAverageRating(averageRating);
        formationRepository.save(formation);
    }
    
    /**
     * Approuver/rejeter un avis (admin uniquement)
     */
    @Transactional
    public Review approveReview(Long reviewId, boolean approve) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé"));
        
        review.setIsApproved(approve);
        review = reviewRepository.save(review);
        
        // Recalculer la note moyenne
        updateFormationAverageRating(review.getFormation());
        
        return review;
    }
    
    /**
     * Récupérer tous les avis en attente de modération (admin)
     */
    public List<Review> getPendingReviews() {
        return reviewRepository.findByIsApprovedFalse();
    }
}



