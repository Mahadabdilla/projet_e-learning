package com.eduafrica.service.mobilemoney;

import com.eduafrica.model.Payment;
import com.eduafrica.model.enums.PaymentStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * Service d'intégration avec Orange Money API
 * Documentation: https://developer.orange.com/
 */
@Service
public class OrangeMoneyService implements MobileMoneyProvider {
    
    @Value("${orange.money.merchant.key:}")
    private String merchantKey;
    
    @Value("${orange.money.api.url:https://api.orange.com/orange-money-webpay}")
    private String orangeApiUrl;
    
    @Value("${orange.money.sandbox:true}")
    private boolean sandboxMode;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    @Override
    public String initiatePayment(Payment payment, String phoneNumber) {
        if (sandboxMode || merchantKey.isEmpty()) {
            return "ORANGE_" + System.currentTimeMillis() + "_" + payment.getId();
        }
        
        // TODO: Implémenter l'appel réel à l'API Orange Money
        /*
        String url = orangeApiUrl + "/api/v1/webpayment";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + merchantKey);
        
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("merchant_key", merchantKey);
        requestBody.put("currency", "XOF");
        requestBody.put("order_id", "EDUAFRICA_" + payment.getId());
        requestBody.put("amount", payment.getAmount().doubleValue());
        requestBody.put("return_url", "http://localhost:8080/api/payments/webhooks/orange");
        requestBody.put("cancel_url", "http://localhost:8080/api/payments/webhooks/orange/cancel");
        requestBody.put("notif_url", "http://localhost:8080/api/payments/webhooks/orange");
        requestBody.put("lang", "fr");
        requestBody.put("reference", phoneNumber);
        
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
        
        Map<String, Object> responseBody = response.getBody();
        return (String) responseBody.get("pay_token");
        */
        
        return "ORANGE_" + System.currentTimeMillis() + "_" + payment.getId();
    }
    
    @Override
    public boolean checkPaymentStatus(String transactionId) {
        if (sandboxMode || merchantKey.isEmpty()) {
            return true;
        }
        
        // TODO: Implémenter la vérification réelle
        return true;
    }
    
    @Override
    public PaymentCallbackResult processCallback(Object callbackData) {
        Map<String, Object> data = (Map<String, Object>) callbackData;
        
        String orderId = (String) data.get("order_id");
        String status = (String) data.get("status");
        String txnid = (String) data.get("txnid");
        String message = (String) data.getOrDefault("message", "Paiement traité");
        
        // Extraire l'ID de transaction depuis order_id (format: EDUAFRICA_XXX)
        String transactionId = orderId != null && orderId.startsWith("EDUAFRICA_") 
            ? orderId.substring(10) 
            : txnid;
        
        PaymentStatus paymentStatus = "SUCCESS".equals(status) || "SUCCESSFUL".equals(status)
            ? PaymentStatus.COMPLETED
            : PaymentStatus.PENDING;
        
        return new PaymentCallbackResult(transactionId, paymentStatus, txnid, message);
    }
    
    @Override
    public boolean simulatePayment(String transactionId) {
        return true;
    }
}


