package com.eduafrica.service;

import com.eduafrica.model.Certificate;
import com.eduafrica.model.Enrollment;
import com.eduafrica.model.Formation;
import com.eduafrica.model.User;
import com.eduafrica.model.enums.Role;
import com.eduafrica.repository.CertificateRepository;
import com.eduafrica.repository.EnrollmentRepository;
import com.eduafrica.repository.UserRepository;
import com.eduafrica.service.blockchain.BlockchainService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests du service CertificateService")
class CertificateServiceTest {
    
    @Mock
    private CertificateRepository certificateRepository;
    
    @Mock
    private EnrollmentRepository enrollmentRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private BlockchainService blockchainService;
    
    @InjectMocks
    private CertificateService certificateService;
    
    private User testUser;
    private Formation testFormation;
    private Enrollment testEnrollment;
    private Certificate testCertificate;
    
    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@eduafrica.com")
                .firstName("Test")
                .lastName("User")
                .role(Role.APPRENANT)
                .build();
        
        testFormation = Formation.builder()
                .id(1L)
                .title("Formation Test")
                .duration(10)
                .price(BigDecimal.valueOf(5000))
                .build();
        
        testEnrollment = Enrollment.builder()
                .id(1L)
                .user(testUser)
                .formation(testFormation)
                .progress(100)
                .completedAt(java.time.LocalDateTime.now())
                .build();
        
        testCertificate = Certificate.builder()
                .id(1L)
                .user(testUser)
                .formation(testFormation)
                .certificateCode("CERT-TEST-123")
                .blockchainHash("test-hash-123")
                .build();
    }
    
    @Test
    @DisplayName("Devrait générer un certificat pour une formation complétée")
    void shouldGenerateCertificateForCompletedFormation() {
        // Given
        when(enrollmentRepository.findById(1L)).thenReturn(Optional.of(testEnrollment));
        when(userRepository.findByEmail("test@eduafrica.com")).thenReturn(Optional.of(testUser));
        when(certificateRepository.findByUserAndFormation(testUser, testFormation))
                .thenReturn(Optional.empty());
        when(certificateRepository.save(any(Certificate.class))).thenAnswer(invocation -> {
            Certificate cert = invocation.getArgument(0);
            cert.setId(1L);
            return cert;
        });
        when(blockchainService.generateCertificateHash(any(), any(), any(), any(), any()))
                .thenReturn("blockchain-hash-123");
        when(blockchainService.registerCertificate(any(), any()))
                .thenReturn(com.eduafrica.service.blockchain.BlockchainTransaction.builder()
                        .transactionHash("txn-hash-123")
                        .blockNumber(1L)
                        .timestamp(LocalDateTime.now())
                        .status("CONFIRMED")
                        .build());
        
        // When
        byte[] pdfBytes = certificateService.generateCertificate(1L, "test@eduafrica.com");
        
        // Then
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
        verify(certificateRepository, times(2)).save(any(Certificate.class));
        verify(blockchainService).generateCertificateHash(any(), any(), any(), any(), any());
        verify(blockchainService).registerCertificate(any(), any());
    }
    
    @Test
    @DisplayName("Devrait lancer une exception si la formation n'est pas complétée")
    void shouldThrowExceptionIfFormationNotCompleted() {
        // Given
        testEnrollment.setProgress(50);
        testEnrollment.setCompletedAt(null);
        when(enrollmentRepository.findById(1L)).thenReturn(Optional.of(testEnrollment));
        when(userRepository.findByEmail("test@eduafrica.com")).thenReturn(Optional.of(testUser));
        
        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            certificateService.generateCertificate(1L, "test@eduafrica.com");
        });
        
        assertTrue(exception.getMessage().contains("compléter la formation"));
    }
    
    @Test
    @DisplayName("Devrait retourner un certificat existant s'il existe déjà")
    void shouldReturnExistingCertificateIfAlreadyExists() {
        // Given
        when(enrollmentRepository.findById(1L)).thenReturn(Optional.of(testEnrollment));
        when(userRepository.findByEmail("test@eduafrica.com")).thenReturn(Optional.of(testUser));
        when(certificateRepository.findByUserAndFormation(testUser, testFormation))
                .thenReturn(Optional.of(testCertificate));
        when(certificateRepository.findByCertificateCode("CERT-TEST-123"))
                .thenReturn(Optional.of(testCertificate));
        
        // When
        byte[] pdfBytes = certificateService.generateCertificate(1L, "test@eduafrica.com");
        
        // Then
        assertNotNull(pdfBytes);
        verify(certificateRepository, never()).save(any(Certificate.class));
    }
    
    @Test
    @DisplayName("Devrait vérifier qu'un certificat peut être généré")
    void shouldCheckIfCertificateCanBeGenerated() {
        // Given
        when(enrollmentRepository.findById(1L)).thenReturn(Optional.of(testEnrollment));
        when(userRepository.findByEmail("test@eduafrica.com")).thenReturn(Optional.of(testUser));
        
        // When
        boolean canGenerate = certificateService.canGenerateCertificate(1L, "test@eduafrica.com");
        
        // Then
        assertTrue(canGenerate);
    }
    
    @Test
    @DisplayName("Devrait retourner false si la progression est inférieure à 100%")
    void shouldReturnFalseIfProgressLessThan100() {
        // Given
        testEnrollment.setProgress(50);
        when(enrollmentRepository.findById(1L)).thenReturn(Optional.of(testEnrollment));
        when(userRepository.findByEmail("test@eduafrica.com")).thenReturn(Optional.of(testUser));
        
        // When
        boolean canGenerate = certificateService.canGenerateCertificate(1L, "test@eduafrica.com");
        
        // Then
        assertFalse(canGenerate);
    }
    
    @Test
    @DisplayName("Devrait vérifier un certificat par son code")
    void shouldVerifyCertificateByCode() {
        // Given
        when(certificateRepository.findByCertificateCode("CERT-TEST-123"))
                .thenReturn(Optional.of(testCertificate));
        
        // When
        Certificate certificate = certificateService.verifyCertificate("CERT-TEST-123");
        
        // Then
        assertNotNull(certificate);
        assertEquals("CERT-TEST-123", certificate.getCertificateCode());
    }
    
    @Test
    @DisplayName("Devrait lancer une exception si le certificat n'existe pas")
    void shouldThrowExceptionIfCertificateNotFound() {
        // Given
        when(certificateRepository.findByCertificateCode("INVALID-CODE"))
                .thenReturn(Optional.empty());
        
        // When & Then
        assertThrows(RuntimeException.class, () -> {
            certificateService.verifyCertificate("INVALID-CODE");
        });
    }
    
    @Test
    @DisplayName("Devrait vérifier un certificat sur la blockchain")
    void shouldVerifyCertificateOnBlockchain() {
        // Given
        when(blockchainService.verifyCertificate("blockchain-hash-123")).thenReturn(true);
        
        // When
        boolean isValid = certificateService.verifyCertificateOnBlockchain("blockchain-hash-123");
        
        // Then
        assertTrue(isValid);
        verify(blockchainService).verifyCertificate("blockchain-hash-123");
    }
}

