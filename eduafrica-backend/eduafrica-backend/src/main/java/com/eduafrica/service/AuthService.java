package com.eduafrica.service;

import com.eduafrica.dto.AuthResponse;
import com.eduafrica.dto.LoginRequest;
import com.eduafrica.dto.RegisterRequest;
import com.eduafrica.model.User;
import com.eduafrica.repository.UserRepository;
import com.eduafrica.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    public AuthResponse register(RegisterRequest request) {
        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé");
        }
        
        // Créer le nouvel utilisateur
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .country(request.getCountry())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();
        
        userRepository.save(user);
        
        // Générer le token JWT
        String token = jwtUtil.generateToken(user.getEmail());
        
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();
    }
    
    public AuthResponse login(LoginRequest request) {
        try {
            // Vérifier d'abord si l'utilisateur existe
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));
            
            // Authentifier l'utilisateur
            try {
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );
            } catch (org.springframework.security.authentication.BadCredentialsException e) {
                throw new RuntimeException("Email ou mot de passe incorrect", e);
            } catch (Exception e) {
                throw new RuntimeException("Erreur d'authentification: " + e.getMessage(), e);
            }
            
            // Générer le token JWT
            String token = jwtUtil.generateToken(user.getEmail());
            
            return AuthResponse.builder()
                    .token(token)
                    .id(user.getId())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .role(user.getRole())
                    .build();
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la connexion: " + e.getMessage(), e);
        }
    }
}
