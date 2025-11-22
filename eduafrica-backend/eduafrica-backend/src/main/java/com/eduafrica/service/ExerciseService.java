package com.eduafrica.service;

import com.eduafrica.model.Exercise;
import com.eduafrica.model.ExerciseSubmission;
import com.eduafrica.model.Lesson;
import com.eduafrica.model.User;
import com.eduafrica.model.enums.LessonType;
import com.eduafrica.repository.ExerciseRepository;
import com.eduafrica.repository.ExerciseSubmissionRepository;
import com.eduafrica.repository.LessonRepository;
import com.eduafrica.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExerciseService {
    
    @Autowired
    private ExerciseRepository exerciseRepository;
    
    @Autowired
    private ExerciseSubmissionRepository exerciseSubmissionRepository;
    
    @Autowired
    private LessonRepository lessonRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Exercise getExerciseByLessonId(Long lessonId) {
        return exerciseRepository.findByLessonId(lessonId)
                .orElseThrow(() -> new RuntimeException("Exercice non trouvé pour cette leçon"));
    }
    
    @Transactional
    public ExerciseSubmission submitExercise(Long lessonId, Long userId, String submission) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Leçon non trouvée"));
        
        if (lesson.getLessonType() != LessonType.EXERCISE) {
            throw new RuntimeException("Cette leçon n'est pas un exercice");
        }
        
        Exercise exercise = exerciseRepository.findByLessonId(lessonId)
                .orElseThrow(() -> new RuntimeException("Exercice non trouvé"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        ExerciseSubmission exerciseSubmission = ExerciseSubmission.builder()
                .exercise(exercise)
                .user(user)
                .submission(submission)
                .build();
        
        // Pour l'instant, les exercices nécessitent une correction manuelle
        // TODO: Implémenter une correction automatique pour certains types d'exercices
        
        return exerciseSubmissionRepository.save(exerciseSubmission);
    }
    
    @Transactional
    public ExerciseSubmission reviewSubmission(Long submissionId, Long reviewerId, Boolean isCorrect, String feedback, Integer score) {
        ExerciseSubmission submission = exerciseSubmissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Soumission non trouvée"));
        
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new RuntimeException("Correcteur non trouvé"));
        
        submission.setIsCorrect(isCorrect);
        submission.setFeedback(feedback);
        submission.setScore(score);
        submission.setReviewedBy(reviewer);
        submission.setReviewedAt(java.time.LocalDateTime.now());
        
        return exerciseSubmissionRepository.save(submission);
    }
    
    public List<ExerciseSubmission> getUserSubmissions(Long userId, Long exerciseId) {
        return exerciseSubmissionRepository.findByUserIdAndExerciseId(userId, exerciseId);
    }
    
    public ExerciseSubmission getLatestSubmission(Long userId, Long exerciseId) {
        return exerciseSubmissionRepository.findFirstByUserIdAndExerciseIdOrderBySubmittedAtDesc(userId, exerciseId)
                .orElse(null);
    }
}


