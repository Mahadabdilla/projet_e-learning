package com.eduafrica.controller;

import com.eduafrica.model.Module;
import com.eduafrica.service.ModuleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
public class ModuleController {
    
    @Autowired
    private ModuleService moduleService;
    
    @GetMapping("/formation/{formationId}")
    public ResponseEntity<List<Module>> getModulesByFormation(@PathVariable Long formationId) {
        return ResponseEntity.ok(moduleService.getModulesByFormationId(formationId));
    }
    
    @PostMapping("/formation/{formationId}")
    @PreAuthorize("hasRole('FORMATEUR')")
    public ResponseEntity<Module> createModule(
            @PathVariable Long formationId,
            @Valid @RequestBody Module module,
            Authentication authentication
    ) {
        String email = authentication.getName();
        Module created = moduleService.createModule(module, formationId, email);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('FORMATEUR')")
    public ResponseEntity<Module> updateModule(
            @PathVariable Long id,
            @Valid @RequestBody Module module,
            Authentication authentication
    ) {
        String email = authentication.getName();
        Module updated = moduleService.updateModule(id, module, email);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('FORMATEUR')")
    public ResponseEntity<Void> deleteModule(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String email = authentication.getName();
        moduleService.deleteModule(id, email);
        return ResponseEntity.noContent().build();
    }
}




