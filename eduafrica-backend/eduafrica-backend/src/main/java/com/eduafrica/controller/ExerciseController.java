package com.eduafrica.controller;

import com.eduafrica.model.Exercise;
import com.eduafrica.model.ExerciseSubmission;
import com.eduafrica.service.ExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {
    
    @Autowired
    private ExerciseService exerciseService;
    
    @GetMapping("/lesson/{lessonId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Exercise> getExerciseByLesson(@PathVariable Long lessonId) {
        try {
            Exercise exercise = exerciseService.getExerciseByLessonId(lessonId);
            return ResponseEntity.ok(exercise);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/lesson/{lessonId}/submit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ExerciseSubmission> submitExercise(
            @PathVariable Long lessonId,
            @RequestBody Map<String, String> request,
            Authentication authentication
    ) {
        try {
            Long userId = ((com.eduafrica.model.User) authentication.getPrincipal()).getId();
            String submission = request.get("submission");
            
            ExerciseSubmission exerciseSubmission = exerciseService.submitExercise(lessonId, userId, submission);
            return ResponseEntity.ok(exerciseSubmission);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/submissions/{submissionId}/review")
    @PreAuthorize("hasRole('FORMATEUR')")
    public ResponseEntity<ExerciseSubmission> reviewSubmission(
            @PathVariable Long submissionId,
            @RequestBody Map<String, Object> request,
            Authentication authentication
    ) {
        try {
            Long reviewerId = ((com.eduafrica.model.User) authentication.getPrincipal()).getId();
            Boolean isCorrect = (Boolean) request.get("isCorrect");
            String feedback = (String) request.get("feedback");
            Integer score = (Integer) request.get("score");
            
            ExerciseSubmission submission = exerciseService.reviewSubmission(
                    submissionId, reviewerId, isCorrect, feedback, score
            );
            return ResponseEntity.ok(submission);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/submissions/user/{userId}/exercise/{exerciseId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ExerciseSubmission>> getUserSubmissions(
            @PathVariable Long userId,
            @PathVariable Long exerciseId
    ) {
        List<ExerciseSubmission> submissions = exerciseService.getUserSubmissions(userId, exerciseId);
        return ResponseEntity.ok(submissions);
    }
    
    @GetMapping("/submissions/latest/user/{userId}/exercise/{exerciseId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ExerciseSubmission> getLatestSubmission(
            @PathVariable Long userId,
            @PathVariable Long exerciseId
    ) {
        ExerciseSubmission submission = exerciseService.getLatestSubmission(userId, exerciseId);
        if (submission != null) {
            return ResponseEntity.ok(submission);
        }
        return ResponseEntity.notFound().build();
    }
}


