package com.eduafrica.service;

import com.eduafrica.model.Enrollment;
import com.eduafrica.model.Lesson;
import com.eduafrica.model.LessonProgress;
import com.eduafrica.model.Module;
import com.eduafrica.repository.EnrollmentRepository;
import com.eduafrica.repository.LessonProgressRepository;
import com.eduafrica.repository.LessonRepository;
import com.eduafrica.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LessonProgressService {
    
    @Autowired
    private LessonProgressRepository lessonProgressRepository;
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    @Autowired
    private LessonRepository lessonRepository;
    
    @Autowired
    private EnrollmentService enrollmentService;
    
    @Autowired
    private ModuleRepository moduleRepository;
    
    @Transactional
    public LessonProgress updateProgress(Long enrollmentId, Long lessonId, Integer progressPercentage, Integer timeSpentSeconds) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée"));
        
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Leçon non trouvée"));
        
        // Vérifier que la leçon appartient à la formation de l'inscription
        if (!lesson.getModule().getFormation().getId().equals(enrollment.getFormation().getId())) {
            throw new RuntimeException("La leçon n'appartient pas à cette formation");
        }
        
        LessonProgress lessonProgress = lessonProgressRepository
                .findByEnrollmentIdAndLessonId(enrollmentId, lessonId)
                .orElse(LessonProgress.builder()
                        .enrollment(enrollment)
                        .lesson(lesson)
                        .build());
        
        lessonProgress.setProgressPercentage(progressPercentage);
        lessonProgress.setTimeSpentSeconds(timeSpentSeconds);
        
        // Marquer comme complété si progression >= 100%
        if (progressPercentage >= 100) {
            lessonProgress.setIsCompleted(true);
        }
        
        lessonProgress = lessonProgressRepository.save(lessonProgress);
        
        // Mettre à jour la progression globale de l'inscription
        updateEnrollmentProgress(enrollmentId);
        
        return lessonProgress;
    }
    
    @Transactional
    public LessonProgress completeLesson(Long enrollmentId, Long lessonId, Integer quizScore) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée"));
        
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Leçon non trouvée"));
        
        LessonProgress lessonProgress = lessonProgressRepository
                .findByEnrollmentIdAndLessonId(enrollmentId, lessonId)
                .orElse(LessonProgress.builder()
                        .enrollment(enrollment)
                        .lesson(lesson)
                        .build());
        
        lessonProgress.setIsCompleted(true);
        lessonProgress.setProgressPercentage(100);
        if (quizScore != null) {
            lessonProgress.setQuizScore(quizScore);
        }
        
        lessonProgress = lessonProgressRepository.save(lessonProgress);
        
        // Mettre à jour la progression globale
        updateEnrollmentProgress(enrollmentId);
        
        return lessonProgress;
    }
    
    public LessonProgress getProgress(Long enrollmentId, Long lessonId) {
        return lessonProgressRepository
                .findByEnrollmentIdAndLessonId(enrollmentId, lessonId)
                .orElse(LessonProgress.builder()
                        .enrollment(enrollmentRepository.findById(enrollmentId)
                                .orElseThrow(() -> new RuntimeException("Inscription non trouvée")))
                        .lesson(lessonRepository.findById(lessonId)
                                .orElseThrow(() -> new RuntimeException("Leçon non trouvée")))
                        .isCompleted(false)
                        .progressPercentage(0)
                        .timeSpentSeconds(0)
                        .build());
    }
    
    public List<LessonProgress> getEnrollmentProgress(Long enrollmentId) {
        return lessonProgressRepository.findByEnrollmentId(enrollmentId);
    }
    
    private void updateEnrollmentProgress(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée"));
        
        // Compter les leçons complétées
        Long completedLessons = lessonProgressRepository.countByEnrollmentIdAndIsCompletedTrue(enrollmentId);
        
        // Calculer le total de leçons dans la formation
        List<Lesson> allLessons = lessonRepository.findByModuleFormationId(enrollment.getFormation().getId());
        Long totalLessons = (long) allLessons.size();
        
        // Calculer le pourcentage de progression
        int progress = totalLessons > 0 
                ? (int) ((completedLessons * 100) / totalLessons)
                : 0;
        
        enrollmentService.updateProgress(enrollmentId, progress);
    }
}

