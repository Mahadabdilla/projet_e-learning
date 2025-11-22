package com.eduafrica.service.mobilemoney;

import com.eduafrica.model.Payment;
import com.eduafrica.model.enums.PaymentStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

/**
 * Service d'intégration avec M-Pesa API (Safaricom)
 * Documentation: https://developer.safaricom.co.ke/
 */
@Service
public class MPesaService implements MobileMoneyProvider {
    
    @Value("${mpesa.consumer.key:}")
    private String consumerKey;
    
    @Value("${mpesa.consumer.secret:}")
    private String consumerSecret;
    
    @Value("${mpesa.api.url:https://sandbox.safaricom.co.ke}")
    private String mpesaApiUrl;
    
    @Value("${mpesa.sandbox:true}")
    private boolean sandboxMode;
    
    @Value("${mpesa.shortcode:}")
    private String shortcode;
    
    @Value("${mpesa.passkey:}")
    private String passkey;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private String accessToken = null;
    
    private String getAccessToken() {
        if (sandboxMode || consumerKey.isEmpty()) {
            return "sandbox_token";
        }
        
        // TODO: Implémenter l'obtention du token d'accès
        /*
        String credentials = consumerKey + ":" + consumerSecret;
        String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());
        
        String url = mpesaApiUrl + "/oauth/v1/generate?grant_type=client_credentials";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + encodedCredentials);
        HttpEntity<?> request = new HttpEntity<>(headers);
        
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
        Map<String, Object> responseBody = response.getBody();
        return (String) responseBody.get("access_token");
        */
        
        return "sandbox_token";
    }
    
    @Override
    public String initiatePayment(Payment payment, String phoneNumber) {
        if (sandboxMode || consumerKey.isEmpty()) {
            return "MPESA_" + System.currentTimeMillis() + "_" + payment.getId();
        }
        
        // TODO: Implémenter l'appel réel à l'API M-Pesa
        /*
        String accessToken = getAccessToken();
        String url = mpesaApiUrl + "/mpesa/stkpush/v1/processrequest";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);
        
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("BusinessShortCode", shortcode);
        requestBody.put("Password", generatePassword());
        requestBody.put("Timestamp", getTimestamp());
        requestBody.put("TransactionType", "CustomerPayBillOnline");
        requestBody.put("Amount", payment.getAmount().intValue());
        requestBody.put("PartyA", phoneNumber);
        requestBody.put("PartyB", shortcode);
        requestBody.put("PhoneNumber", phoneNumber);
        requestBody.put("CallBackURL", "http://localhost:8080/api/payments/webhooks/mpesa");
        requestBody.put("AccountReference", "EDUAFRICA_" + payment.getId());
        requestBody.put("TransactionDesc", "Paiement formation " + payment.getFormation().getTitle());
        
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
        
        Map<String, Object> responseBody = response.getBody();
        return (String) responseBody.get("CheckoutRequestID");
        */
        
        return "MPESA_" + System.currentTimeMillis() + "_" + payment.getId();
    }
    
    @Override
    public boolean checkPaymentStatus(String transactionId) {
        if (sandboxMode || consumerKey.isEmpty()) {
            return true;
        }
        
        // TODO: Implémenter la vérification réelle
        return true;
    }
    
    @Override
    public PaymentCallbackResult processCallback(Object callbackData) {
        Map<String, Object> data = (Map<String, Object>) callbackData;
        
        Map<String, Object> body = (Map<String, Object>) data.get("Body");
        Map<String, Object> stkCallback = (Map<String, Object>) body.get("stkCallback");
        
        String resultCode = (String) stkCallback.get("ResultCode");
        String checkoutRequestId = (String) stkCallback.get("CheckoutRequestID");
        String merchantRequestId = (String) stkCallback.get("MerchantRequestID");
        String resultDesc = (String) stkCallback.get("ResultDesc");
        
        PaymentStatus paymentStatus = "0".equals(resultCode)
            ? PaymentStatus.COMPLETED
            : PaymentStatus.PENDING;
        
        return new PaymentCallbackResult(checkoutRequestId, paymentStatus, merchantRequestId, resultDesc);
    }
    
    @Override
    public boolean simulatePayment(String transactionId) {
        return true;
    }
    
    private String generatePassword() {
        // Générer le mot de passe pour M-Pesa (Base64(Shortcode+Passkey+Timestamp))
        String timestamp = getTimestamp();
        String passwordString = shortcode + passkey + timestamp;
        return Base64.getEncoder().encodeToString(passwordString.getBytes());
    }
    
    private String getTimestamp() {
        return String.valueOf(System.currentTimeMillis() / 1000);
    }
}


