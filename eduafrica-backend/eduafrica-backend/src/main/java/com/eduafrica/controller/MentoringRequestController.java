package com.eduafrica.controller;

import com.eduafrica.model.MentoringRequest;
import com.eduafrica.model.enums.MentoringStatus;
import com.eduafrica.service.MentoringRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mentoring-requests")
public class MentoringRequestController {
    
    @Autowired
    private MentoringRequestService mentoringRequestService;
    
    @PostMapping("/mentor/{mentorProfileId}")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<MentoringRequest> createMentoringRequest(
            @PathVariable Long mentorProfileId,
            @RequestBody Map<String, String> request,
            Authentication authentication
    ) {
        try {
            String email = authentication.getName();
            String message = request.get("message");
            MentoringRequest mentoringRequest = mentoringRequestService.createMentoringRequest(
                    mentorProfileId, email, message);
            return ResponseEntity.ok(mentoringRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<List<MentoringRequest>> getMyMentoringRequests(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(mentoringRequestService.getMyMentoringRequests(email));
    }
    
    @GetMapping("/mentor/{mentorProfileId}")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<List<MentoringRequest>> getMentorRequests(@PathVariable Long mentorProfileId) {
        return ResponseEntity.ok(mentoringRequestService.getMentorRequests(mentorProfileId));
    }
    
    @GetMapping("/my-mentor-requests")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<List<MentoringRequest>> getMyMentorRequests(Authentication authentication) {
        String mentorEmail = authentication.getName();
        return ResponseEntity.ok(mentoringRequestService.getMyMentorRequests(mentorEmail));
    }
    
    @PutMapping("/{requestId}/status")
    @PreAuthorize("hasRole('MENTOR') or hasRole('APPRENANT')")
    public ResponseEntity<MentoringRequest> updateRequestStatus(
            @PathVariable Long requestId,
            @RequestBody Map<String, String> request
    ) {
        try {
            MentoringStatus status = MentoringStatus.valueOf(request.get("status"));
            MentoringRequest updated = mentoringRequestService.updateRequestStatus(requestId, status);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{requestId}")
    @PreAuthorize("hasRole('APPRENANT') or hasRole('MENTOR')")
    public ResponseEntity<MentoringRequest> getRequestById(@PathVariable Long requestId) {
        try {
            MentoringRequest request = mentoringRequestService.getRequestById(requestId);
            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

