package com.eduafrica.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quiz_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizQuestion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "La question est obligatoire")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String question;
    
    @Column(name = "question_order", nullable = false)
    @NotNull(message = "L'ordre de la question est obligatoire")
    private Integer order;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "question_type", nullable = false)
    @Builder.Default
    private QuestionType questionType = QuestionType.MULTIPLE_CHOICE;
    
    @Column(name = "points")
    @Builder.Default
    private Integer points = 1; // Points attribués pour cette question
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;
    
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("order ASC")
    @Builder.Default
    private List<QuizAnswer> answers = new ArrayList<>();
    
    @Column(columnDefinition = "TEXT")
    private String explanation; // Explication affichée après la réponse
    
    public enum QuestionType {
        MULTIPLE_CHOICE, // Choix multiple (une seule bonne réponse)
        MULTIPLE_SELECT, // Choix multiple (plusieurs bonnes réponses)
        TRUE_FALSE,      // Vrai/Faux
        SHORT_ANSWER,    // Réponse courte
        ESSAY           // Réponse longue (essai)
    }
}


