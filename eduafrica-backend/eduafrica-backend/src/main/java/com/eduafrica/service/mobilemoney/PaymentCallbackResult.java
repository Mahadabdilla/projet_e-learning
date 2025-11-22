package com.eduafrica.service.mobilemoney;

import com.eduafrica.model.enums.PaymentStatus;

public class PaymentCallbackResult {
    private String transactionId;
    private PaymentStatus status;
    private String providerReference;
    private String message;
    
    public PaymentCallbackResult(String transactionId, PaymentStatus status, String providerReference, String message) {
        this.transactionId = transactionId;
        this.status = status;
        this.providerReference = providerReference;
        this.message = message;
    }
    
    public String getTransactionId() {
        return transactionId;
    }
    
    public PaymentStatus getStatus() {
        return status;
    }
    
    public String getProviderReference() {
        return providerReference;
    }
    
    public String getMessage() {
        return message;
    }
}


