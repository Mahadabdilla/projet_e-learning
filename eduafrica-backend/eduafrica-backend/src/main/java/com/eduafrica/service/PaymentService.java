package com.eduafrica.service;

import com.eduafrica.model.Formation;
import com.eduafrica.model.Payment;
import com.eduafrica.model.User;
import com.eduafrica.model.enums.PaymentMethod;
import com.eduafrica.model.enums.PaymentStatus;
import com.eduafrica.repository.FormationRepository;
import com.eduafrica.repository.PaymentRepository;
import com.eduafrica.repository.UserRepository;
import com.eduafrica.service.mobilemoney.MobileMoneyProvider;
import com.eduafrica.service.mobilemoney.MPesaService;
import com.eduafrica.service.mobilemoney.OrangeMoneyService;
import com.eduafrica.service.mobilemoney.WavePaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FormationRepository formationRepository;
    
    @Autowired(required = false)
    private NotificationService notificationService;
    
    @Autowired
    private WavePaymentService wavePaymentService;
    
    @Autowired
    private OrangeMoneyService orangeMoneyService;
    
    @Autowired
    private MPesaService mPesaService;
    
    @Autowired(required = false)
    private EnrollmentService enrollmentService;
    
    @Transactional
    public Payment createPayment(Long formationId, String userEmail, PaymentMethod paymentMethod) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation non trouvée"));
        
        // Vérifier si la formation est gratuite
        if (formation.getIsFree() != null && formation.getIsFree()) {
            throw new RuntimeException("Cette formation est gratuite, pas besoin de paiement");
        }
        
        // Vérifier si un paiement est déjà en cours ou complété pour cette formation
        if (paymentRepository.existsByUserAndFormationAndStatus(user, formation, PaymentStatus.PENDING)) {
            throw new RuntimeException("Un paiement est déjà en cours pour cette formation");
        }
        
        if (paymentRepository.existsByUserAndFormationAndStatus(user, formation, PaymentStatus.COMPLETED)) {
            throw new RuntimeException("Vous avez déjà payé pour cette formation");
        }
        
        BigDecimal amount = formation.getPrice() != null ? formation.getPrice() : BigDecimal.ZERO;
        
        String transactionId = "TXN_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
        
        Payment payment = Payment.builder()
                .user(user)
                .formation(formation)
                .amount(amount)
                .paymentMethod(paymentMethod)
                .status(PaymentStatus.PENDING)
                .transactionId(transactionId)
                .build();
        
        payment = paymentRepository.save(payment);
        
        // Initier le paiement avec le provider Mobile Money approprié
        // Note: Le numéro de téléphone sera fourni par le frontend
        // Pour l'instant, on crée juste le paiement en attente
        
        return payment;
    }
    
    @Transactional
    public Payment completePayment(String transactionId, String providerReference) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Paiement non trouvé"));
        
        if (payment.getStatus() == PaymentStatus.COMPLETED) {
            throw new RuntimeException("Ce paiement a déjà été complété");
        }
        
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setProviderReference(providerReference);
        
        payment = paymentRepository.save(payment);
        
        // Créer une notification pour le paiement complété
        if (notificationService != null) {
            notificationService.createNotificationByEmail(
                    payment.getUser().getEmail(),
                    com.eduafrica.model.enums.NotificationType.PAYMENT_COMPLETED,
                    "Paiement complété",
                    "Votre paiement de " + payment.getAmount() + " FCFA pour la formation \"" + payment.getFormation().getTitle() + "\" a été complété avec succès.",
                    "/formations/" + payment.getFormation().getId()
            );
        }
        
        return payment;
    }
    
    @Transactional
    public Payment cancelPayment(String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Paiement non trouvé"));
        
        if (payment.getStatus() == PaymentStatus.COMPLETED) {
            throw new RuntimeException("Impossible d'annuler un paiement complété");
        }
        
        payment.setStatus(PaymentStatus.CANCELLED);
        return paymentRepository.save(payment);
    }
    
    public List<Payment> getUserPayments(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return paymentRepository.findByUser(user);
    }
    
    public Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Paiement non trouvé"));
    }
    
    public boolean hasPaidForFormation(String userEmail, Long formationId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation non trouvée"));
        
        return paymentRepository.existsByUserAndFormationAndStatus(user, formation, PaymentStatus.COMPLETED);
    }
    
    /**
     * Initie un paiement Mobile Money avec le provider approprié
     */
    @Transactional
    public Payment initiateMobileMoneyPayment(Long paymentId, String phoneNumber) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Paiement non trouvé"));
        
        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new RuntimeException("Ce paiement n'est plus en attente");
        }
        
        MobileMoneyProvider provider = getProvider(payment.getPaymentMethod());
        String providerTransactionId = provider.initiatePayment(payment, phoneNumber);
        
        payment.setProviderReference(providerTransactionId);
        payment = paymentRepository.save(payment);
        
        return payment;
    }
    
    /**
     * Traite un callback/webhook d'un provider Mobile Money
     */
    @Transactional
    public Payment processProviderCallback(PaymentMethod paymentMethod, Object callbackData) {
        MobileMoneyProvider provider = getProvider(paymentMethod);
        com.eduafrica.service.mobilemoney.PaymentCallbackResult result = provider.processCallback(callbackData);
        
        Payment payment = paymentRepository.findByTransactionId(result.getTransactionId())
                .orElseThrow(() -> new RuntimeException("Paiement non trouvé"));
        
        if (result.getStatus() == PaymentStatus.COMPLETED) {
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setProviderReference(result.getProviderReference());
            payment = paymentRepository.save(payment);
            
            // Créer une notification
            if (notificationService != null) {
                notificationService.createNotificationByEmail(
                        payment.getUser().getEmail(),
                        com.eduafrica.model.enums.NotificationType.PAYMENT_COMPLETED,
                        "Paiement complété",
                        "Votre paiement de " + payment.getAmount() + " FCFA pour la formation \"" + 
                        payment.getFormation().getTitle() + "\" a été complété avec succès.",
                        "/formations/" + payment.getFormation().getId()
                );
            }
            
            // Auto-inscrire l'utilisateur à la formation si le paiement est complété
            if (enrollmentService != null) {
                try {
                    enrollmentService.enrollToFormation(payment.getFormation().getId(), payment.getUser().getEmail());
                } catch (Exception e) {
                    // Log l'erreur mais ne bloque pas le processus de paiement
                    System.err.println("Erreur lors de l'inscription automatique: " + e.getMessage());
                }
            }
        }
        
        return payment;
    }
    
    private MobileMoneyProvider getProvider(PaymentMethod paymentMethod) {
        switch (paymentMethod) {
            case WAVE:
                return wavePaymentService;
            case ORANGE_MONEY:
                return orangeMoneyService;
            case M_PESA:
                return mPesaService;
            default:
                throw new RuntimeException("Provider Mobile Money non supporté: " + paymentMethod);
        }
    }
}

