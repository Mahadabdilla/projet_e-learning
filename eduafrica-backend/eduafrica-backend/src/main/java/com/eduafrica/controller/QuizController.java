package com.eduafrica.controller;

import com.eduafrica.model.Quiz;
import com.eduafrica.model.QuizAttempt;
import com.eduafrica.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {
    
    @Autowired
    private QuizService quizService;
    
    @GetMapping("/lesson/{lessonId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Quiz> getQuizByLesson(@PathVariable Long lessonId) {
        try {
            Quiz quiz = quizService.getQuizByLessonId(lessonId);
            return ResponseEntity.ok(quiz);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/lesson/{lessonId}/start")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<QuizAttempt> startQuiz(
            @PathVariable Long lessonId,
            Authentication authentication
    ) {
        try {
            Long userId = ((com.eduafrica.model.User) authentication.getPrincipal()).getId();
            QuizAttempt attempt = quizService.startQuizAttempt(lessonId, userId);
            return ResponseEntity.ok(attempt);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/attempts/{attemptId}/submit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<QuizAttempt> submitQuiz(
            @PathVariable Long attemptId,
            @RequestBody Map<String, Object> request,
            Authentication authentication
    ) {
        try {
            @SuppressWarnings("unchecked")
            Map<Long, List<Long>> answers = (Map<Long, List<Long>>) request.get("answers");
            Integer timeSpentSeconds = (Integer) request.get("timeSpentSeconds");
            
            QuizAttempt attempt = quizService.submitQuizAttempt(attemptId, answers, timeSpentSeconds);
            return ResponseEntity.ok(attempt);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/attempts/user/{userId}/quiz/{quizId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<QuizAttempt>> getUserAttempts(
            @PathVariable Long userId,
            @PathVariable Long quizId
    ) {
        List<QuizAttempt> attempts = quizService.getUserQuizAttempts(userId, quizId);
        return ResponseEntity.ok(attempts);
    }
    
    @GetMapping("/attempts/latest/user/{userId}/quiz/{quizId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<QuizAttempt> getLatestAttempt(
            @PathVariable Long userId,
            @PathVariable Long quizId
    ) {
        QuizAttempt attempt = quizService.getLatestAttempt(userId, quizId);
        if (attempt != null) {
            return ResponseEntity.ok(attempt);
        }
        return ResponseEntity.notFound().build();
    }
}


