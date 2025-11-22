package com.eduafrica.controller;

import com.eduafrica.model.Payment;
import com.eduafrica.model.enums.PaymentMethod;
import com.eduafrica.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @PostMapping("/formation/{formationId}")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<Payment> createPayment(
            @PathVariable Long formationId,
            @RequestBody Map<String, String> request,
            Authentication authentication
    ) {
        try {
            String email = authentication.getName();
            PaymentMethod paymentMethod = PaymentMethod.valueOf(request.get("paymentMethod"));
            Payment payment = paymentService.createPayment(formationId, email, paymentMethod);
            return ResponseEntity.ok(payment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{transactionId}/complete")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<Payment> completePayment(
            @PathVariable String transactionId,
            @RequestBody Map<String, String> request
    ) {
        try {
            String providerReference = request.get("providerReference");
            Payment payment = paymentService.completePayment(transactionId, providerReference);
            return ResponseEntity.ok(payment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{transactionId}/cancel")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<Payment> cancelPayment(@PathVariable String transactionId) {
        try {
            Payment payment = paymentService.cancelPayment(transactionId);
            return ResponseEntity.ok(payment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/my-payments")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<List<Payment>> getMyPayments(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(paymentService.getUserPayments(email));
    }
    
    @GetMapping("/{paymentId}")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long paymentId) {
        try {
            Payment payment = paymentService.getPaymentById(paymentId);
            return ResponseEntity.ok(payment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/formation/{formationId}/has-paid")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<Map<String, Boolean>> hasPaidForFormation(
            @PathVariable Long formationId,
            Authentication authentication
    ) {
        String email = authentication.getName();
        boolean hasPaid = paymentService.hasPaidForFormation(email, formationId);
        return ResponseEntity.ok(Map.of("hasPaid", hasPaid));
    }
    
    @PostMapping("/{paymentId}/initiate")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<Payment> initiateMobileMoneyPayment(
            @PathVariable Long paymentId,
            @RequestBody Map<String, String> request,
            Authentication authentication
    ) {
        try {
            String phoneNumber = request.get("phoneNumber");
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            Payment payment = paymentService.initiateMobileMoneyPayment(paymentId, phoneNumber);
            return ResponseEntity.ok(payment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Webhook pour Wave
     */
    @PostMapping("/webhooks/wave")
    public ResponseEntity<Map<String, String>> waveWebhook(@RequestBody Map<String, Object> callbackData) {
        try {
            Payment payment = paymentService.processProviderCallback(PaymentMethod.WAVE, callbackData);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Callback traité"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }
    
    /**
     * Webhook pour Orange Money
     */
    @PostMapping("/webhooks/orange")
    public ResponseEntity<Map<String, String>> orangeWebhook(@RequestBody Map<String, Object> callbackData) {
        try {
            Payment payment = paymentService.processProviderCallback(PaymentMethod.ORANGE_MONEY, callbackData);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Callback traité"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }
    
    /**
     * Webhook pour M-Pesa
     */
    @PostMapping("/webhooks/mpesa")
    public ResponseEntity<Map<String, String>> mpesaWebhook(@RequestBody Map<String, Object> callbackData) {
        try {
            Payment payment = paymentService.processProviderCallback(PaymentMethod.M_PESA, callbackData);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Callback traité"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }
}


