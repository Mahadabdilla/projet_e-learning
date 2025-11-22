package com.eduafrica.controller;

import com.eduafrica.model.Review;
import com.eduafrica.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    
    @Autowired
    private ReviewService reviewService;
    
    /**
     * Créer un avis pour une formation
     */
    @PostMapping("/formation/{formationId}")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<Review> createReview(
            @PathVariable Long formationId,
            @RequestBody CreateReviewRequest request,
            Authentication authentication
    ) {
        try {
            String userEmail = authentication.getName();
            Review review = reviewService.createReview(
                    formationId,
                    request.getRating(),
                    request.getComment(),
                    userEmail
            );
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Mettre à jour un avis
     */
    @PutMapping("/{reviewId}")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<Review> updateReview(
            @PathVariable Long reviewId,
            @RequestBody UpdateReviewRequest request,
            Authentication authentication
    ) {
        try {
            String userEmail = authentication.getName();
            Review review = reviewService.updateReview(
                    reviewId,
                    request.getRating(),
                    request.getComment(),
                    userEmail
            );
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Supprimer un avis
     */
    @DeleteMapping("/{reviewId}")
    @PreAuthorize("hasAnyRole('APPRENANT', 'ADMIN')")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long reviewId,
            Authentication authentication
    ) {
        try {
            String userEmail = authentication.getName();
            reviewService.deleteReview(reviewId, userEmail);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Récupérer tous les avis d'une formation
     */
    @GetMapping("/formation/{formationId}")
    public ResponseEntity<List<Review>> getFormationReviews(@PathVariable Long formationId) {
        try {
            List<Review> reviews = reviewService.getFormationReviews(formationId);
            return ResponseEntity.ok(reviews);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Récupérer tous les avis de l'utilisateur connecté
     */
    @GetMapping("/my-reviews")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<List<Review>> getMyReviews(Authentication authentication) {
        String userEmail = authentication.getName();
        List<Review> reviews = reviewService.getUserReviews(userEmail);
        return ResponseEntity.ok(reviews);
    }
    
    /**
     * Vérifier si l'utilisateur peut laisser un avis
     */
    @GetMapping("/formation/{formationId}/can-review")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<Boolean> canReview(
            @PathVariable Long formationId,
            Authentication authentication
    ) {
        try {
            String userEmail = authentication.getName();
            boolean canReview = reviewService.canUserReview(formationId, userEmail);
            return ResponseEntity.ok(canReview);
        } catch (RuntimeException e) {
            return ResponseEntity.ok(false);
        }
    }
    
    /**
     * Approuver/rejeter un avis (admin uniquement)
     */
    @PutMapping("/{reviewId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Review> approveReview(
            @PathVariable Long reviewId,
            @RequestParam boolean approve
    ) {
        try {
            Review review = reviewService.approveReview(reviewId, approve);
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Récupérer les avis en attente de modération (admin)
     */
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Review>> getPendingReviews() {
        List<Review> reviews = reviewService.getPendingReviews();
        return ResponseEntity.ok(reviews);
    }
    
    // Classes internes pour les requêtes
    public static class CreateReviewRequest {
        private Integer rating;
        private String comment;
        
        public Integer getRating() {
            return rating;
        }
        
        public void setRating(Integer rating) {
            this.rating = rating;
        }
        
        public String getComment() {
            return comment;
        }
        
        public void setComment(String comment) {
            this.comment = comment;
        }
    }
    
    public static class UpdateReviewRequest {
        private Integer rating;
        private String comment;
        
        public Integer getRating() {
            return rating;
        }
        
        public void setRating(Integer rating) {
            this.rating = rating;
        }
        
        public String getComment() {
            return comment;
        }
        
        public void setComment(String comment) {
            this.comment = comment;
        }
    }
}



