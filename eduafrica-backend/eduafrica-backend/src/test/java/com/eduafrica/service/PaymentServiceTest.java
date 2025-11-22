package com.eduafrica.service;

import com.eduafrica.model.Formation;
import com.eduafrica.model.Payment;
import com.eduafrica.model.User;
import com.eduafrica.model.enums.PaymentMethod;
import com.eduafrica.model.enums.PaymentStatus;
import com.eduafrica.model.enums.Role;
import com.eduafrica.repository.FormationRepository;
import com.eduafrica.repository.PaymentRepository;
import com.eduafrica.repository.UserRepository;
import com.eduafrica.service.mobilemoney.PaymentCallbackResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests du service PaymentService")
class PaymentServiceTest {
    
    @Mock
    private PaymentRepository paymentRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private FormationRepository formationRepository;
    
    @Mock
    private NotificationService notificationService;
    
    @Mock
    private EnrollmentService enrollmentService;
    
    @Mock
    private com.eduafrica.service.mobilemoney.WavePaymentService wavePaymentService;
    
    @Mock
    private com.eduafrica.service.mobilemoney.OrangeMoneyService orangeMoneyService;
    
    @Mock
    private com.eduafrica.service.mobilemoney.MPesaService mPesaService;
    
    @InjectMocks
    private PaymentService paymentService;
    
    private User testUser;
    private Formation testFormation;
    private Payment testPayment;
    
    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("apprenant@eduafrica.com")
                .firstName("Apprenant")
                .lastName("Test")
                .role(Role.APPRENANT)
                .build();
        
        testFormation = Formation.builder()
                .id(1L)
                .title("Formation Test")
                .price(BigDecimal.valueOf(5000))
                .isFree(false)
                .build();
        
        testPayment = Payment.builder()
                .id(1L)
                .user(testUser)
                .formation(testFormation)
                .amount(BigDecimal.valueOf(5000))
                .paymentMethod(PaymentMethod.WAVE)
                .status(PaymentStatus.PENDING)
                .transactionId("TXN123456789")
                .build();
    }
    
    @Test
    @DisplayName("Devrait créer un paiement avec succès")
    void shouldCreatePaymentSuccessfully() {
        // Given
        when(userRepository.findByEmail("apprenant@eduafrica.com"))
                .thenReturn(Optional.of(testUser));
        when(formationRepository.findById(1L)).thenReturn(Optional.of(testFormation));
        when(paymentRepository.existsByUserAndFormationAndStatus(testUser, testFormation, PaymentStatus.PENDING))
                .thenReturn(false);
        when(paymentRepository.existsByUserAndFormationAndStatus(testUser, testFormation, PaymentStatus.COMPLETED))
                .thenReturn(false);
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> {
            Payment p = invocation.getArgument(0);
            p.setId(1L);
            return p;
        });
        
        // When
        Payment created = paymentService.createPayment(1L, "apprenant@eduafrica.com", PaymentMethod.WAVE);
        
        // Then
        assertNotNull(created);
        assertEquals(PaymentStatus.PENDING, created.getStatus());
        assertEquals(PaymentMethod.WAVE, created.getPaymentMethod());
        verify(paymentRepository).save(any(Payment.class));
    }
    
    @Test
    @DisplayName("Devrait lancer une exception si la formation est gratuite")
    void shouldThrowExceptionIfFormationIsFree() {
        // Given
        testFormation.setIsFree(true);
        when(userRepository.findByEmail("apprenant@eduafrica.com"))
                .thenReturn(Optional.of(testUser));
        when(formationRepository.findById(1L)).thenReturn(Optional.of(testFormation));
        
        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            paymentService.createPayment(1L, "apprenant@eduafrica.com", PaymentMethod.WAVE);
        });
        
        assertTrue(exception.getMessage().contains("gratuite"));
        verify(paymentRepository, never()).save(any());
    }
    
    @Test
    @DisplayName("Devrait lancer une exception si un paiement est déjà en cours")
    void shouldThrowExceptionIfPaymentAlreadyPending() {
        // Given
        when(userRepository.findByEmail("apprenant@eduafrica.com"))
                .thenReturn(Optional.of(testUser));
        when(formationRepository.findById(1L)).thenReturn(Optional.of(testFormation));
        when(paymentRepository.existsByUserAndFormationAndStatus(testUser, testFormation, PaymentStatus.PENDING))
                .thenReturn(true);
        
        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            paymentService.createPayment(1L, "apprenant@eduafrica.com", PaymentMethod.WAVE);
        });
        
        assertTrue(exception.getMessage().contains("déjà en cours"));
    }
    
    @Test
    @DisplayName("Devrait compléter un paiement avec succès")
    void shouldCompletePaymentSuccessfully() {
        // Given
        when(paymentRepository.findByTransactionId("TXN123456789"))
                .thenReturn(Optional.of(testPayment));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);
        
        // When
        Payment completed = paymentService.completePayment("TXN123456789", "PROVIDER_REF_123");
        
        // Then
        assertNotNull(completed);
        assertEquals(PaymentStatus.COMPLETED, completed.getStatus());
        assertEquals("PROVIDER_REF_123", completed.getProviderReference());
        verify(paymentRepository).save(any(Payment.class));
    }
    
    @Test
    @DisplayName("Devrait lancer une exception si le paiement est déjà complété")
    void shouldThrowExceptionIfPaymentAlreadyCompleted() {
        // Given
        testPayment.setStatus(PaymentStatus.COMPLETED);
        when(paymentRepository.findByTransactionId("TXN123456789"))
                .thenReturn(Optional.of(testPayment));
        
        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            paymentService.completePayment("TXN123456789", "PROVIDER_REF_123");
        });
        
        assertTrue(exception.getMessage().contains("déjà été complété"));
    }
    
    @Test
    @DisplayName("Devrait annuler un paiement avec succès")
    void shouldCancelPaymentSuccessfully() {
        // Given
        when(paymentRepository.findByTransactionId("TXN123456789"))
                .thenReturn(Optional.of(testPayment));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);
        
        // When
        Payment cancelled = paymentService.cancelPayment("TXN123456789");
        
        // Then
        assertNotNull(cancelled);
        assertEquals(PaymentStatus.CANCELLED, cancelled.getStatus());
        verify(paymentRepository).save(any(Payment.class));
    }
    
    @Test
    @DisplayName("Devrait lancer une exception si on essaie d'annuler un paiement complété")
    void shouldThrowExceptionIfTryingToCancelCompletedPayment() {
        // Given
        testPayment.setStatus(PaymentStatus.COMPLETED);
        when(paymentRepository.findByTransactionId("TXN123456789"))
                .thenReturn(Optional.of(testPayment));
        
        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            paymentService.cancelPayment("TXN123456789");
        });
        
        assertTrue(exception.getMessage().contains("Impossible d'annuler"));
    }
    
    @Test
    @DisplayName("Devrait récupérer les paiements d'un utilisateur")
    void shouldGetUserPayments() {
        // Given
        List<Payment> payments = Arrays.asList(testPayment);
        when(userRepository.findByEmail("apprenant@eduafrica.com"))
                .thenReturn(Optional.of(testUser));
        when(paymentRepository.findByUser(testUser)).thenReturn(payments);
        
        // When
        List<Payment> result = paymentService.getUserPayments("apprenant@eduafrica.com");
        
        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(paymentRepository).findByUser(testUser);
    }
    
    @Test
    @DisplayName("Devrait vérifier si un utilisateur a payé pour une formation")
    void shouldCheckIfUserHasPaidForFormation() {
        // Given
        when(userRepository.findByEmail("apprenant@eduafrica.com"))
                .thenReturn(Optional.of(testUser));
        when(formationRepository.findById(1L)).thenReturn(Optional.of(testFormation));
        when(paymentRepository.existsByUserAndFormationAndStatus(testUser, testFormation, PaymentStatus.COMPLETED))
                .thenReturn(true);
        
        // When
        boolean hasPaid = paymentService.hasPaidForFormation("apprenant@eduafrica.com", 1L);
        
        // Then
        assertTrue(hasPaid);
    }
    
    @Test
    @DisplayName("Devrait initier un paiement Mobile Money")
    void shouldInitiateMobileMoneyPayment() {
        // Given
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));
        when(wavePaymentService.initiatePayment(any(), any())).thenReturn("WAVE_TXN_123");
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);
        
        // When
        Payment initiated = paymentService.initiateMobileMoneyPayment(1L, "+221771234567");
        
        // Then
        assertNotNull(initiated);
        verify(wavePaymentService).initiatePayment(any(), eq("+221771234567"));
        verify(paymentRepository).save(any(Payment.class));
    }
    
    @Test
    @DisplayName("Devrait traiter un callback de provider Mobile Money")
    void shouldProcessProviderCallback() {
        // Given
        java.util.Map<String, Object> callbackData = new java.util.HashMap<>();
        callbackData.put("transaction_id", "TXN123456789");
        callbackData.put("status", "SUCCESS");
        callbackData.put("reference", "EDUAFRICA_1");
        
        PaymentCallbackResult callbackResult = new PaymentCallbackResult(
                "TXN123456789",
                PaymentStatus.COMPLETED,
                "EDUAFRICA_1",
                "Paiement réussi"
        );
        
        when(wavePaymentService.processCallback(any())).thenReturn(callbackResult);
        when(paymentRepository.findByTransactionId("TXN123456789"))
                .thenReturn(Optional.of(testPayment));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);
        
        // When
        Payment processed = paymentService.processProviderCallback(PaymentMethod.WAVE, callbackData);
        
        // Then
        assertNotNull(processed);
        assertEquals(PaymentStatus.COMPLETED, processed.getStatus());
        verify(wavePaymentService).processCallback(any());
        verify(paymentRepository).save(any(Payment.class));
    }
}

