package com.eduafrica.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "exercise_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseSubmission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(columnDefinition = "TEXT")
    private String submission; // Réponse/solution soumise par l'apprenant
    
    @Column(name = "is_correct")
    private Boolean isCorrect;
    
    @Column(columnDefinition = "TEXT")
    private String feedback; // Feedback du formateur ou système automatique
    
    @Column(name = "score")
    private Integer score; // Score sur 100
    
    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;
    
    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy; // Formateur qui a corrigé (si correction manuelle)
    
    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }
}


