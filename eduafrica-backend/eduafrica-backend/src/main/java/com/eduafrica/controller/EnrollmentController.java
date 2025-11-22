package com.eduafrica.controller;

import com.eduafrica.model.Enrollment;
import com.eduafrica.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {
    
    @Autowired
    private EnrollmentService enrollmentService;
    
    @PostMapping("/{formationId}")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<Enrollment> enrollToFormation(
            @PathVariable Long formationId,
            Authentication authentication
    ) {
        try {
            String email = authentication.getName();
            Enrollment enrollment = enrollmentService.enrollToFormation(formationId, email);
            return ResponseEntity.ok(enrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/my-enrollments")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<List<Enrollment>> getMyEnrollments(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(enrollmentService.getUserEnrollments(email));
    }
    
    @PutMapping("/{enrollmentId}/progress")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<Enrollment> updateProgress(
            @PathVariable Long enrollmentId,
            @RequestParam Integer progress
    ) {
        Enrollment updated = enrollmentService.updateProgress(enrollmentId, progress);
        return ResponseEntity.ok(updated);
    }
    
    @GetMapping("/formation/{formationId}")
    @PreAuthorize("hasRole('FORMATEUR')")
    public ResponseEntity<List<Enrollment>> getFormationEnrollments(
            @PathVariable Long formationId,
            Authentication authentication
    ) {
        try {
            String email = authentication.getName();
            List<Enrollment> enrollments = enrollmentService.getFormateurFormationEnrollments(formationId, email);
            return ResponseEntity.ok(enrollments);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
