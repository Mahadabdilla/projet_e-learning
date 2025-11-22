package com.eduafrica.controller;

import com.eduafrica.dto.AuthResponse;
import com.eduafrica.dto.LoginRequest;
import com.eduafrica.dto.RegisterRequest;
import com.eduafrica.model.User;
import com.eduafrica.repository.UserRepository;
import com.eduafrica.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // L'exception sera gérée par GlobalExceptionHandler
            throw e;
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Retourner une erreur plus claire
            return ResponseEntity.status(401).body(
                java.util.Map.of(
                    "error", "Erreur d'authentification",
                    "message", e.getMessage()
                )
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                java.util.Map.of(
                    "error", "Erreur serveur",
                    "message", "Une erreur est survenue lors de la connexion"
                )
            );
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        return ResponseEntity.ok(user);
    }
}
