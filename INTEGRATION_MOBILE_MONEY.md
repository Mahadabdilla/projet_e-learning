# Intégration Mobile Money - EduAfrica

## Vue d'ensemble

Cette documentation décrit l'intégration des services de paiement Mobile Money (Wave, Orange Money, M-Pesa) dans la plateforme EduAfrica.

## Architecture

### Backend

#### Services créés

1. **`MobileMoneyProvider`** (Interface)
   - Interface commune pour tous les providers Mobile Money
   - Méthodes : `initiatePayment()`, `checkPaymentStatus()`, `processCallback()`, `simulatePayment()`

2. **`WavePaymentService`**
   - Service d'intégration avec Wave API
   - Configuration : `wave.api.key`, `wave.api.secret`, `wave.api.url`, `wave.sandbox`

3. **`OrangeMoneyService`**
   - Service d'intégration avec Orange Money API
   - Configuration : `orange.money.merchant.key`, `orange.money.api.url`, `orange.money.sandbox`

4. **`MPesaService`**
   - Service d'intégration avec M-Pesa API (Safaricom)
   - Configuration : `mpesa.consumer.key`, `mpesa.consumer.secret`, `mpesa.api.url`, `mpesa.shortcode`, `mpesa.passkey`, `mpesa.sandbox`

#### Endpoints API

**POST** `/api/payments/formation/{formationId}`
- Crée un paiement pour une formation
- Body: `{ "paymentMethod": "WAVE" | "ORANGE_MONEY" | "M_PESA" }`

**POST** `/api/payments/{paymentId}/initiate`
- Initie un paiement Mobile Money
- Body: `{ "phoneNumber": "+221 77 123 45 67" }`

**POST** `/api/payments/webhooks/wave`
- Webhook pour recevoir les callbacks de Wave

**POST** `/api/payments/webhooks/orange`
- Webhook pour recevoir les callbacks d'Orange Money

**POST** `/api/payments/webhooks/mpesa`
- Webhook pour recevoir les callbacks de M-Pesa

### Frontend

#### Composant de paiement mis à jour

Le composant `PaymentComponent` a été mis à jour pour :
- Demander le numéro de téléphone pour les paiements Mobile Money
- Initier le paiement via l'API backend
- Afficher le statut du paiement en temps réel

## Configuration

### Variables d'environnement

Ajoutez ces variables dans `application.properties` :

```properties
# Wave
wave.api.key=votre_cle_api_wave
wave.api.secret=votre_secret_wave
wave.api.url=https://api.wave.com/v1
wave.sandbox=true

# Orange Money
orange.money.merchant.key=votre_cle_merchant_orange
orange.money.api.url=https://api.orange.com/orange-money-webpay
orange.money.sandbox=true

# M-Pesa
mpesa.consumer.key=votre_consumer_key
mpesa.consumer.secret=votre_consumer_secret
mpesa.api.url=https://sandbox.safaricom.co.ke
mpesa.shortcode=votre_shortcode
mpesa.passkey=votre_passkey
mpesa.sandbox=true
```

### Mode Sandbox vs Production

- **Sandbox** : Mode test avec simulation des paiements
- **Production** : Mode réel avec intégration aux APIs réelles

Pour activer le mode production, mettez `sandbox=false` dans les propriétés.

## Flux de paiement

1. **Création du paiement**
   - L'utilisateur sélectionne une formation et une méthode de paiement
   - Le frontend appelle `POST /api/payments/formation/{formationId}`
   - Un paiement avec statut `PENDING` est créé

2. **Initiation du paiement Mobile Money**
   - L'utilisateur entre son numéro de téléphone
   - Le frontend appelle `POST /api/payments/{paymentId}/initiate`
   - Le backend contacte le provider Mobile Money approprié
   - Un ID de transaction est retourné

3. **Confirmation du paiement**
   - Le provider envoie un callback/webhook au backend
   - Le backend traite le callback et met à jour le statut du paiement
   - Si le paiement est complété, l'utilisateur est automatiquement inscrit à la formation
   - Une notification est envoyée à l'utilisateur

## Intégration avec les APIs réelles

### Wave

1. Créez un compte développeur sur https://wave.com/
2. Obtenez vos clés API
3. Configurez l'URL de callback : `https://votre-domaine.com/api/payments/webhooks/wave`
4. Mettez à jour `application.properties` avec vos clés

### Orange Money

1. Créez un compte développeur sur https://developer.orange.com/
2. Obtenez votre clé merchant
3. Configurez l'URL de callback : `https://votre-domaine.com/api/payments/webhooks/orange`
4. Mettez à jour `application.properties` avec vos clés

### M-Pesa

1. Créez un compte développeur sur https://developer.safaricom.co.ke/
2. Obtenez vos credentials (Consumer Key, Consumer Secret, Shortcode, Passkey)
3. Configurez l'URL de callback : `https://votre-domaine.com/api/payments/webhooks/mpesa`
4. Mettez à jour `application.properties` avec vos credentials

## Tests

### Mode Sandbox

En mode sandbox, les paiements sont simulés automatiquement. Vous pouvez tester le flux complet sans avoir besoin de vraies clés API.

### Tests manuels

1. Créez un paiement via le frontend
2. Entrez un numéro de téléphone de test
3. Le paiement sera simulé et complété automatiquement
4. Vérifiez que l'utilisateur est bien inscrit à la formation

## Sécurité

- Les webhooks doivent être sécurisés avec une authentification (à implémenter)
- Validez toujours les callbacks reçus des providers
- Utilisez HTTPS en production
- Ne stockez jamais les secrets dans le code source (utilisez des variables d'environnement)

## Prochaines étapes

1. Implémenter l'authentification des webhooks
2. Ajouter la gestion des erreurs et retry logic
3. Implémenter les appels réels aux APIs (actuellement en mode simulation)
4. Ajouter des logs détaillés pour le debugging
5. Créer des tests unitaires et d'intégration

## Support

Pour toute question ou problème, consultez :
- Documentation Wave : https://docs.wave.com/
- Documentation Orange Money : https://developer.orange.com/
- Documentation M-Pesa : https://developer.safaricom.co.ke/


