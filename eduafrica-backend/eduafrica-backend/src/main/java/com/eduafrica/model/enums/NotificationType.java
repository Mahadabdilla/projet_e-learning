package com.eduafrica.model.enums;

public enum NotificationType {
    ENROLLMENT,           // Nouvelle inscription à une formation
    PAYMENT_COMPLETED,    // Paiement complété
    PAYMENT_FAILED,       // Paiement échoué
    MENTORING_REQUEST,    // Nouvelle demande de mentorat
    MENTORING_ACCEPTED,   // Demande de mentorat acceptée
    MENTORING_REJECTED,   // Demande de mentorat rejetée
    FORMATION_COMPLETED,  // Formation complétée (certificat disponible)
    NEW_MESSAGE,          // Nouveau message (si chat implémenté)
    REVIEW_RECEIVED,      // Nouvel avis reçu (pour formateur)
    SYSTEM                // Notification système
}



