package com.eduafrica.controller;

import com.eduafrica.model.Lesson;
import com.eduafrica.service.LessonService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {
    
    @Autowired
    private LessonService lessonService;
    
    @GetMapping("/module/{moduleId}")
    public ResponseEntity<List<Lesson>> getLessonsByModule(@PathVariable Long moduleId) {
        return ResponseEntity.ok(lessonService.getLessonsByModuleId(moduleId));
    }
    
    @GetMapping("/formation/{formationId}")
    public ResponseEntity<List<Lesson>> getLessonsByFormation(@PathVariable Long formationId) {
        return ResponseEntity.ok(lessonService.getLessonsByFormationId(formationId));
    }
    
    @PostMapping("/module/{moduleId}")
    @PreAuthorize("hasRole('FORMATEUR')")
    public ResponseEntity<Lesson> createLesson(
            @PathVariable Long moduleId,
            @Valid @RequestBody Lesson lesson,
            Authentication authentication
    ) {
        String email = authentication.getName();
        Lesson created = lessonService.createLesson(lesson, moduleId, email);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('FORMATEUR')")
    public ResponseEntity<Lesson> updateLesson(
            @PathVariable Long id,
            @Valid @RequestBody Lesson lesson,
            Authentication authentication
    ) {
        String email = authentication.getName();
        Lesson updated = lessonService.updateLesson(id, lesson, email);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('FORMATEUR')")
    public ResponseEntity<Void> deleteLesson(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String email = authentication.getName();
        lessonService.deleteLesson(id, email);
        return ResponseEntity.noContent().build();
    }
}




