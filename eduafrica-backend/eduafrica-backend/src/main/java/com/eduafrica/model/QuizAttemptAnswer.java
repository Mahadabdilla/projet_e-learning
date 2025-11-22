package com.eduafrica.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "quiz_attempt_answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAttemptAnswer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false)
    private QuizAttempt attempt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private QuizQuestion question;
    
    @Column(columnDefinition = "TEXT")
    private String answerText; // Pour les réponses courtes/essais
    
    @ManyToMany
    @JoinTable(
        name = "quiz_attempt_selected_answers",
        joinColumns = @JoinColumn(name = "attempt_answer_id"),
        inverseJoinColumns = @JoinColumn(name = "answer_id")
    )
    @Builder.Default
    private java.util.List<QuizAnswer> selectedAnswers = new java.util.ArrayList<>();
    
    @Column(name = "is_correct")
    private Boolean isCorrect;
    
    @Column(name = "points_earned")
    @Builder.Default
    private Integer pointsEarned = 0;
}


