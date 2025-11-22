package com.eduafrica.controller;

import com.eduafrica.dto.FormateurStatsResponse;
import com.eduafrica.model.Formation;
import com.eduafrica.model.enums.FormationCategory;
import com.eduafrica.model.enums.FormationLevel;
import com.eduafrica.service.FormationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/formations")
public class FormationController {
    
    @Autowired
    private FormationService formationService;
    
    @GetMapping
    public ResponseEntity<Page<Formation>> getAllFormations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return ResponseEntity.ok(formationService.getAllFormations(page, size));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Formation> getFormationById(@PathVariable Long id) {
        return ResponseEntity.ok(formationService.getFormationById(id));
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<Formation>> searchFormations(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return ResponseEntity.ok(formationService.searchFormations(keyword, page, size));
    }
    
    @GetMapping("/filter")
    public ResponseEntity<Page<Formation>> filterFormations(
            @RequestParam(required = false) FormationCategory category,
            @RequestParam(required = false) FormationLevel level,
            @RequestParam(required = false) Boolean isFree,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return ResponseEntity.ok(formationService.getFormationsByFilters(category, level, isFree, page, size));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('FORMATEUR')")
    public ResponseEntity<Formation> createFormation(
            @Valid @RequestBody Formation formation,
            Authentication authentication
    ) {
        String email = authentication.getName();
        Formation created = formationService.createFormation(formation, email);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('FORMATEUR')")
    public ResponseEntity<Formation> updateFormation(
            @PathVariable Long id,
            @Valid @RequestBody Formation formation
    ) {
        Formation updated = formationService.updateFormation(id, formation);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('FORMATEUR') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFormation(@PathVariable Long id) {
        formationService.deleteFormation(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/my-formations")
    @PreAuthorize("hasRole('FORMATEUR')")
    public ResponseEntity<List<Formation>> getMyFormations(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(formationService.getFormationsByFormateur(email));
    }
    
    @GetMapping("/formateur/stats")
    @PreAuthorize("hasRole('FORMATEUR')")
    public ResponseEntity<FormateurStatsResponse> getFormateurStats(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(formationService.getFormateurStats(email));
    }
}
