package com.eduafrica.controller;

import com.eduafrica.dto.ContactRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {
    
    @PostMapping
    public ResponseEntity<Map<String, String>> sendContactMessage(@Valid @RequestBody ContactRequest request) {
        // Simuler l'envoi d'email
        System.out.println("Message de contact reçu:");
        System.out.println("Nom: " + request.getName());
        System.out.println("Email: " + request.getEmail());
        System.out.println("Sujet: " + request.getSubject());
        System.out.println("Message: " + request.getMessage());
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.");
        
        return ResponseEntity.ok(response);
    }
}
