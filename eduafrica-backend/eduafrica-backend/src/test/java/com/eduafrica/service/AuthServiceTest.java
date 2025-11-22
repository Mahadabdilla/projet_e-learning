package com.eduafrica.service;

import com.eduafrica.dto.AuthResponse;
import com.eduafrica.dto.LoginRequest;
import com.eduafrica.dto.RegisterRequest;
import com.eduafrica.model.User;
import com.eduafrica.model.enums.Role;
import com.eduafrica.repository.UserRepository;
import com.eduafrica.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests du service AuthService")
class AuthServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @Mock
    private JwtUtil jwtUtil;
    
    @Mock
    private AuthenticationManager authenticationManager;
    
    @InjectMocks
    private AuthService authService;
    
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User testUser;
    
    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest(
                "John",
                "Doe",
                "john@eduafrica.com",
                "+221771234567",
                "Senegal",
                "password123",
                Role.APPRENANT
        );
        
        loginRequest = new LoginRequest(
                "john@eduafrica.com",
                "password123"
        );
        
        testUser = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@eduafrica.com")
                .phone("+221771234567")
                .country("Senegal")
                .password("encodedPassword")
                .role(Role.APPRENANT)
                .build();
    }
    
    @Test
    @DisplayName("Devrait enregistrer un nouvel utilisateur avec succès")
    void shouldRegisterNewUserSuccessfully() {
        // Given
        when(userRepository.existsByEmail("john@eduafrica.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            return user;
        });
        when(jwtUtil.generateToken("john@eduafrica.com")).thenReturn("test-jwt-token");
        
        // When
        AuthResponse response = authService.register(registerRequest);
        
        // Then
        assertNotNull(response);
        assertEquals("john@eduafrica.com", response.getEmail());
        assertEquals("John", response.getFirstName());
        assertEquals("Doe", response.getLastName());
        assertEquals(Role.APPRENANT, response.getRole());
        assertEquals("test-jwt-token", response.getToken());
        verify(userRepository).save(any(User.class));
        verify(jwtUtil).generateToken("john@eduafrica.com");
    }
    
    @Test
    @DisplayName("Devrait lancer une exception si l'email existe déjà")
    void shouldThrowExceptionIfEmailAlreadyExists() {
        // Given
        when(userRepository.existsByEmail("john@eduafrica.com")).thenReturn(true);
        
        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.register(registerRequest);
        });
        
        assertTrue(exception.getMessage().contains("déjà utilisé"));
        verify(userRepository, never()).save(any(User.class));
    }
    
    @Test
    @DisplayName("Devrait connecter un utilisateur avec succès")
    void shouldLoginUserSuccessfully() {
        // Given
        when(userRepository.findByEmail("john@eduafrica.com")).thenReturn(Optional.of(testUser));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(jwtUtil.generateToken("john@eduafrica.com")).thenReturn("test-jwt-token");
        
        // When
        AuthResponse response = authService.login(loginRequest);
        
        // Then
        assertNotNull(response);
        assertEquals("john@eduafrica.com", response.getEmail());
        assertEquals("test-jwt-token", response.getToken());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtUtil).generateToken("john@eduafrica.com");
    }
    
    @Test
    @DisplayName("Devrait lancer une exception si l'email n'existe pas")
    void shouldThrowExceptionIfEmailNotFound() {
        // Given
        when(userRepository.findByEmail("john@eduafrica.com")).thenReturn(Optional.empty());
        
        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(loginRequest);
        });
        
        assertTrue(exception.getMessage().contains("incorrect"));
    }
    
    @Test
    @DisplayName("Devrait lancer une exception si le mot de passe est incorrect")
    void shouldThrowExceptionIfPasswordIncorrect() {
        // Given
        when(userRepository.findByEmail("john@eduafrica.com")).thenReturn(Optional.of(testUser));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));
        
        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(loginRequest);
        });
        
        assertTrue(exception.getMessage().contains("incorrect"));
        verify(jwtUtil, never()).generateToken(any());
    }
}

