package com.eduafrica.service;

import com.eduafrica.model.*;
import com.eduafrica.model.enums.LessonType;
import com.eduafrica.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class QuizService {
    
    @Autowired
    private QuizRepository quizRepository;
    
    @Autowired
    private QuizAttemptRepository quizAttemptRepository;
    
    @Autowired
    private LessonRepository lessonRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private LessonProgressService lessonProgressService;
    
    public Quiz getQuizByLessonId(Long lessonId) {
        return quizRepository.findByLessonId(lessonId)
                .orElseThrow(() -> new RuntimeException("Quiz non trouvé pour cette leçon"));
    }
    
    @Transactional
    public QuizAttempt startQuizAttempt(Long lessonId, Long userId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Leçon non trouvée"));
        
        if (lesson.getLessonType() != LessonType.QUIZ) {
            throw new RuntimeException("Cette leçon n'est pas un quiz");
        }
        
        Quiz quiz = quizRepository.findByLessonId(lessonId)
                .orElseThrow(() -> new RuntimeException("Quiz non trouvé"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // Vérifier les tentatives maximales
        if (quiz.getMaxAttempts() != null) {
            long attemptCount = quizAttemptRepository.countByUserIdAndQuizId(userId, quiz.getId());
            if (attemptCount >= quiz.getMaxAttempts()) {
                throw new RuntimeException("Nombre maximum de tentatives atteint");
            }
        }
        
        QuizAttempt attempt = QuizAttempt.builder()
                .quiz(quiz)
                .user(user)
                .startedAt(LocalDateTime.now())
                .build();
        
        return quizAttemptRepository.save(attempt);
    }
    
    @Transactional
    public QuizAttempt submitQuizAttempt(Long attemptId, Map<Long, List<Long>> answers, Integer timeSpentSeconds) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Tentative non trouvée"));
        
        if (attempt.getCompletedAt() != null) {
            throw new RuntimeException("Cette tentative a déjà été complétée");
        }
        
        Quiz quiz = attempt.getQuiz();
        int totalPoints = 0;
        int maxPoints = quiz.getQuestions().stream()
                .mapToInt(q -> q.getPoints() != null ? q.getPoints() : 1)
                .sum();
        
        // Traiter chaque réponse
        for (QuizQuestion question : quiz.getQuestions()) {
            List<Long> selectedAnswerIds = answers.get(question.getId());
            
            QuizAttemptAnswer attemptAnswer = QuizAttemptAnswer.builder()
                    .attempt(attempt)
                    .question(question)
                    .build();
            
            if (selectedAnswerIds != null && !selectedAnswerIds.isEmpty()) {
                // Récupérer les réponses sélectionnées
                List<QuizAnswer> selectedAnswers = question.getAnswers().stream()
                        .filter(a -> selectedAnswerIds.contains(a.getId()))
                        .collect(Collectors.toList());
                attemptAnswer.setSelectedAnswers(selectedAnswers);
                
                // Pour les questions à réponse courte
                if (question.getQuestionType() == QuizQuestion.QuestionType.SHORT_ANSWER ||
                    question.getQuestionType() == QuizQuestion.QuestionType.ESSAY) {
                    // TODO: Comparaison basique (peut être améliorée avec NLP)
                    attemptAnswer.setAnswerText(selectedAnswerIds.toString());
                }
            }
            
            // Vérifier si la réponse est correcte
            boolean isCorrect = checkAnswer(question, attemptAnswer);
            attemptAnswer.setIsCorrect(isCorrect);
            
            if (isCorrect) {
                int points = question.getPoints() != null ? question.getPoints() : 1;
                attemptAnswer.setPointsEarned(points);
                totalPoints += points;
            } else {
                attemptAnswer.setPointsEarned(0);
            }
            
            attempt.getAnswers().add(attemptAnswer);
        }
        
        // Calculer le score sur 100
        int score = maxPoints > 0 ? (totalPoints * 100) / maxPoints : 0;
        attempt.setScore(score);
        attempt.setIsPassed(score >= quiz.getPassingScore());
        attempt.setTimeSpentSeconds(timeSpentSeconds);
        attempt.setCompletedAt(LocalDateTime.now());
        
        attempt = quizAttemptRepository.save(attempt);
        
        // Mettre à jour la progression de la leçon
        if (attempt.getIsPassed()) {
            // Trouver l'enrollment
            // TODO: Récupérer l'enrollment depuis l'utilisateur et la formation
            // lessonProgressService.completeLesson(enrollmentId, lessonId, score);
        }
        
        return attempt;
    }
    
    private boolean checkAnswer(QuizQuestion question, QuizAttemptAnswer attemptAnswer) {
        switch (question.getQuestionType()) {
            case MULTIPLE_CHOICE:
            case TRUE_FALSE:
                // Une seule bonne réponse doit être sélectionnée
                List<QuizAnswer> correctAnswers = question.getAnswers().stream()
                        .filter(QuizAnswer::getIsCorrect)
                        .collect(Collectors.toList());
                return attemptAnswer.getSelectedAnswers().size() == 1 &&
                       correctAnswers.size() == 1 &&
                       attemptAnswer.getSelectedAnswers().get(0).getId().equals(correctAnswers.get(0).getId());
            
            case MULTIPLE_SELECT:
                // Toutes les bonnes réponses doivent être sélectionnées, et aucune mauvaise
                List<Long> correctIds = question.getAnswers().stream()
                        .filter(QuizAnswer::getIsCorrect)
                        .map(QuizAnswer::getId)
                        .collect(Collectors.toList());
                List<Long> selectedIds = attemptAnswer.getSelectedAnswers().stream()
                        .map(QuizAnswer::getId)
                        .collect(Collectors.toList());
                return selectedIds.size() == correctIds.size() &&
                       selectedIds.containsAll(correctIds);
            
            case SHORT_ANSWER:
            case ESSAY:
                // Pour l'instant, nécessite une correction manuelle
                // TODO: Implémenter une comparaison basique ou marquer comme nécessitant une correction
                return false;
            
            default:
                return false;
        }
    }
    
    public List<QuizAttempt> getUserQuizAttempts(Long userId, Long quizId) {
        return quizAttemptRepository.findByUserIdAndQuizId(userId, quizId);
    }
    
    public QuizAttempt getLatestAttempt(Long userId, Long quizId) {
        return quizAttemptRepository.findFirstByUserIdAndQuizIdOrderByStartedAtDesc(userId, quizId)
                .orElse(null);
    }
}


