package com.eduafrica.service.mobilemoney;

import com.eduafrica.model.Payment;

/**
 * Interface commune pour tous les providers Mobile Money
 */
public interface MobileMoneyProvider {
    
    /**
     * Initie un paiement
     * @param payment Le paiement à initier
     * @param phoneNumber Le numéro de téléphone du payeur
     * @return L'ID de transaction du provider
     */
    String initiatePayment(Payment payment, String phoneNumber);
    
    /**
     * Vérifie le statut d'un paiement
     * @param transactionId L'ID de transaction
     * @return true si le paiement est complété
     */
    boolean checkPaymentStatus(String transactionId);
    
    /**
     * Traite un callback/webhook du provider
     * @param callbackData Les données du callback
     * @return L'ID de transaction et le statut
     */
    PaymentCallbackResult processCallback(Object callbackData);
    
    /**
     * Simule un paiement (pour les tests)
     * @param transactionId L'ID de transaction
     * @return true si la simulation réussit
     */
    boolean simulatePayment(String transactionId);
}


