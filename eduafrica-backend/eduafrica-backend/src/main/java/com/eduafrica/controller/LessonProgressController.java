package com.eduafrica.controller;

import com.eduafrica.model.LessonProgress;
import com.eduafrica.service.LessonProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lesson-progress")
public class LessonProgressController {
    
    @Autowired
    private LessonProgressService lessonProgressService;
    
    @GetMapping("/enrollment/{enrollmentId}/lesson/{lessonId}")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<LessonProgress> getProgress(
            @PathVariable Long enrollmentId,
            @PathVariable Long lessonId,
            Authentication authentication
    ) {
        // TODO: Vérifier que l'enrollment appartient à l'utilisateur connecté
        return ResponseEntity.ok(lessonProgressService.getProgress(enrollmentId, lessonId));
    }
    
    @PutMapping("/enrollment/{enrollmentId}/lesson/{lessonId}")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<LessonProgress> updateProgress(
            @PathVariable Long enrollmentId,
            @PathVariable Long lessonId,
            @RequestParam(required = false, defaultValue = "0") Integer progressPercentage,
            @RequestParam(required = false, defaultValue = "0") Integer timeSpentSeconds,
            Authentication authentication
    ) {
        // TODO: Vérifier que l'enrollment appartient à l'utilisateur connecté
        LessonProgress updated = lessonProgressService.updateProgress(
                enrollmentId, lessonId, progressPercentage, timeSpentSeconds
        );
        return ResponseEntity.ok(updated);
    }
    
    @PostMapping("/enrollment/{enrollmentId}/lesson/{lessonId}/complete")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<LessonProgress> completeLesson(
            @PathVariable Long enrollmentId,
            @PathVariable Long lessonId,
            @RequestParam(required = false) Integer quizScore,
            Authentication authentication
    ) {
        // TODO: Vérifier que l'enrollment appartient à l'utilisateur connecté
        LessonProgress completed = lessonProgressService.completeLesson(enrollmentId, lessonId, quizScore);
        return ResponseEntity.ok(completed);
    }
    
    @GetMapping("/enrollment/{enrollmentId}")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<List<LessonProgress>> getEnrollmentProgress(
            @PathVariable Long enrollmentId,
            Authentication authentication
    ) {
        // TODO: Vérifier que l'enrollment appartient à l'utilisateur connecté
        return ResponseEntity.ok(lessonProgressService.getEnrollmentProgress(enrollmentId));
    }
}




