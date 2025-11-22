package com.eduafrica.controller;

import com.eduafrica.model.MentorProfile;
import com.eduafrica.service.MentorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/mentors")
public class MentorController {
    
    @Autowired
    private MentorService mentorService;
    
    @GetMapping("/list")
    public ResponseEntity<Page<MentorProfile>> getAllMentors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return ResponseEntity.ok(mentorService.getAllMentors(page, size));
    }
    
    @GetMapping("/available")
    public ResponseEntity<Page<MentorProfile>> getAvailableMentors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return ResponseEntity.ok(mentorService.getAvailableMentors(page, size));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MentorProfile> getMentorById(@PathVariable Long id) {
        return ResponseEntity.ok(mentorService.getMentorById(id));
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<MentorProfile>> searchMentors(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return ResponseEntity.ok(mentorService.searchMentors(keyword, page, size));
    }
    
    /**
     * Obtenir les statistiques du mentor connecté
     */
    @GetMapping("/my-stats")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<Map<String, Object>> getMyStats(Authentication authentication) {
        String userEmail = authentication.getName();
        Map<String, Object> stats = mentorService.getMentorStats(userEmail);
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Mettre à jour la disponibilité
     */
    @PutMapping("/availability")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<MentorProfile> updateAvailability(
            @RequestParam boolean isAvailable,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        MentorProfile mentorProfile = mentorService.updateAvailability(userEmail, isAvailable);
        return ResponseEntity.ok(mentorProfile);
    }
}

