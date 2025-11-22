# 🔧 Configuration des Services Externes - EduAfrica

**Date** : 2025-01-27  
**Version** : 1.0

---

## 📋 Vue d'ensemble

Ce guide explique comment configurer les services externes nécessaires pour la production :
1. **Stockage Cloud** (Firebase Storage ou AWS S3)
2. **Mobile Money** (Wave, Orange Money, M-Pesa)
3. **Blockchain** (optionnel pour production)

---

## ☁️ 1. STOCKAGE CLOUD

### Option A : Firebase Storage (Recommandé pour débuter)

#### Étape 1 : Créer un projet Firebase

1. Aller sur https://console.firebase.google.com/
2. Cliquer sur "Ajouter un projet"
3. Entrer le nom du projet (ex: `eduafrica-storage`)
4. Suivre les étapes de création

#### Étape 2 : Activer Firebase Storage

1. Dans la console Firebase, aller dans "Storage"
2. Cliquer sur "Commencer"
3. Choisir "Mode production" ou "Mode test"
4. Sélectionner une région (ex: `europe-west1`)

#### Étape 3 : Créer une clé de compte de service

1. Aller dans "Paramètres du projet" → "Comptes de service"
2. Cliquer sur "Générer une nouvelle clé privée"
3. Télécharger le fichier JSON (ex: `eduafrica-firebase-key.json`)
4. **IMPORTANT** : Ne jamais commiter ce fichier dans Git !

#### Étape 4 : Configurer dans application.properties

```properties
# Activer le stockage cloud
storage.provider=firebase
storage.enabled=true

# Firebase Storage Configuration
firebase.storage.bucket=eduafrica-storage.appspot.com
firebase.storage.credentials.path=/path/to/eduafrica-firebase-key.json
firebase.storage.enabled=true
```

**Note** : Remplacer `/path/to/` par le chemin absolu vers votre fichier JSON.

#### Étape 5 : Configurer les règles de sécurité

Dans Firebase Console → Storage → Règles :

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Autoriser la lecture pour les fichiers publics
      allow read: if true;
      
      // Autoriser l'écriture uniquement pour les utilisateurs authentifiés
      allow write: if request.auth != null;
    }
  }
}
```

---

### Option B : AWS S3

#### Étape 1 : Créer un bucket S3

1. Aller sur https://console.aws.amazon.com/s3/
2. Cliquer sur "Create bucket"
3. Nommer le bucket (ex: `eduafrica-storage`)
4. Choisir une région (ex: `eu-west-1`)
5. Désactiver "Block all public access" si vous voulez des fichiers publics
6. Créer le bucket

#### Étape 2 : Créer un utilisateur IAM

1. Aller dans IAM → Users → "Add users"
2. Nommer l'utilisateur (ex: `eduafrica-s3-user`)
3. Sélectionner "Programmatic access"
4. Attacher la politique `AmazonS3FullAccess` (ou créer une politique personnalisée)
5. Télécharger les credentials (Access Key ID et Secret Access Key)

#### Étape 3 : Configurer dans application.properties

```properties
# Activer le stockage cloud
storage.provider=s3
storage.enabled=true

# AWS S3 Configuration
aws.s3.bucket=eduafrica-storage
aws.s3.region=eu-west-1
aws.s3.access-key=AKIAIOSFODNN7EXAMPLE
aws.s3.secret-key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
aws.s3.enabled=true
```

**Note** : Remplacer les valeurs d'exemple par vos vraies clés.

#### Étape 4 : Configurer les permissions du bucket

Dans S3 → Bucket → Permissions → Bucket Policy :

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::eduafrica-storage/*"
    }
  ]
}
```

---

## 💰 2. MOBILE MONEY

### Wave

#### Étape 1 : Créer un compte développeur

1. Aller sur https://wave.com/
2. Créer un compte développeur
3. Accéder au dashboard développeur

#### Étape 2 : Obtenir les clés API

1. Dans le dashboard, aller dans "API Keys"
2. Créer une nouvelle clé API
3. Copier l'API Key et l'API Secret

#### Étape 3 : Configurer le webhook

1. Dans le dashboard, aller dans "Webhooks"
2. Ajouter une URL de callback : `https://votre-domaine.com/api/payments/webhooks/wave`
3. Activer le webhook

#### Étape 4 : Configurer dans application.properties

```properties
# Wave Configuration
wave.api.key=votre_api_key_wave
wave.api.secret=votre_api_secret_wave
wave.api.url=https://api.wave.com/v1
wave.sandbox=false
```

**Note** : Pour les tests, utilisez `wave.sandbox=true` avec les clés de sandbox.

---

### Orange Money

#### Étape 1 : Contacter Orange

1. Aller sur https://developer.orange.com/
2. Créer un compte développeur
3. Contacter le support commercial pour obtenir les credentials

#### Étape 2 : Obtenir les credentials

Orange vous fournira :
- Merchant Key
- API URL
- Documentation d'intégration

#### Étape 3 : Configurer dans application.properties

```properties
# Orange Money Configuration
orange.money.merchant.key=votre_merchant_key
orange.money.api.url=https://api.orange.com/orange-money-webpay
orange.money.sandbox=false
```

#### Étape 4 : Configurer le webhook

Dans le dashboard Orange, configurer l'URL de callback :
`https://votre-domaine.com/api/payments/webhooks/orange`

---

### M-Pesa (Safaricom)

#### Étape 1 : Créer un compte développeur

1. Aller sur https://developer.safaricom.co.ke/
2. Créer un compte développeur
3. Créer une application

#### Étape 2 : Obtenir les credentials

1. Dans le dashboard, aller dans "My Apps"
2. Sélectionner votre application
3. Copier :
   - Consumer Key
   - Consumer Secret
   - Shortcode
   - Passkey

#### Étape 3 : Configurer dans application.properties

```properties
# M-Pesa Configuration
mpesa.consumer.key=votre_consumer_key
mpesa.consumer.secret=votre_consumer_secret
mpesa.api.url=https://api.safaricom.co.ke
mpesa.shortcode=votre_shortcode
mpesa.passkey=votre_passkey
mpesa.sandbox=false
```

#### Étape 4 : Configurer le webhook

Dans le dashboard Safaricom, configurer l'URL de callback :
`https://votre-domaine.com/api/payments/webhooks/mpesa`

---

## 🔗 3. BLOCKCHAIN (Optionnel)

### Option A : Polygon (Recommandé - Faible coût)

#### Étape 1 : Créer un wallet

1. Installer MetaMask
2. Créer un wallet
3. Ajouter le réseau Polygon

#### Étape 2 : Obtenir des MATIC

1. Acheter des MATIC sur un exchange
2. Transférer vers votre wallet MetaMask

#### Étape 3 : Déployer un Smart Contract

1. Créer un contrat Solidity pour stocker les hash de certificats
2. Déployer sur Polygon via Remix ou Hardhat
3. Copier l'adresse du contrat

#### Étape 4 : Configurer dans application.properties

```properties
# Blockchain Configuration
blockchain.network=polygon
blockchain.contract.address=0xVotreAdresseContrat
```

---

### Option B : Ethereum (Coûteux)

Même processus que Polygon mais avec des coûts de gas plus élevés.

---

## 🔐 4. SÉCURITÉ DES CREDENTIALS

### Variables d'environnement (Recommandé)

Au lieu de mettre les credentials dans `application.properties`, utilisez des variables d'environnement :

**application.properties :**
```properties
wave.api.key=${WAVE_API_KEY}
wave.api.secret=${WAVE_API_SECRET}
firebase.storage.credentials.path=${FIREBASE_CREDENTIALS_PATH}
aws.s3.access-key=${AWS_ACCESS_KEY}
aws.s3.secret-key=${AWS_SECRET_KEY}
```

**Créer un fichier `.env` (ne pas commiter) :**
```env
WAVE_API_KEY=votre_cle
WAVE_API_SECRET=votre_secret
FIREBASE_CREDENTIALS_PATH=/path/to/key.json
AWS_ACCESS_KEY=votre_access_key
AWS_SECRET_KEY=votre_secret_key
```

**Ou définir dans le système :**
```bash
# Windows PowerShell
$env:WAVE_API_KEY="votre_cle"
$env:WAVE_API_SECRET="votre_secret"

# Linux/Mac
export WAVE_API_KEY="votre_cle"
export WAVE_API_SECRET="votre_secret"
```

---

## ✅ 5. CHECKLIST DE CONFIGURATION

### Stockage Cloud
- [ ] Projet Firebase créé OU Bucket S3 créé
- [ ] Credentials téléchargés et sécurisés
- [ ] Configuration dans `application.properties`
- [ ] Test d'upload réussi
- [ ] Règles de sécurité configurées

### Mobile Money
- [ ] Compte développeur créé pour chaque provider
- [ ] Clés API obtenues
- [ ] Webhooks configurés
- [ ] Configuration dans `application.properties`
- [ ] Test de paiement en sandbox réussi
- [ ] Passage en production validé

### Blockchain (Optionnel)
- [ ] Wallet créé
- [ ] Smart contract déployé
- [ ] Configuration dans `application.properties`
- [ ] Test d'enregistrement réussi

---

## 🧪 6. TESTS

### Tester le stockage cloud

```bash
# Tester l'upload
curl -X POST http://localhost:8080/api/files/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test.jpg" \
  -F "fileType=IMAGE"
```

### Tester Mobile Money (Sandbox)

1. Créer un paiement via l'API
2. Utiliser les numéros de test fournis par le provider
3. Vérifier le callback webhook

---

## 📝 7. NOTES IMPORTANTES

1. **Ne jamais commiter les credentials** dans Git
2. Utiliser des variables d'environnement en production
3. Tester d'abord en sandbox avant la production
4. Surveiller les coûts (S3, Firebase, Blockchain)
5. Configurer des alertes pour les erreurs

---

## 🆘 8. DÉPANNAGE

### Erreur : "NoClassDefFoundError: com/google/auth/Credentials"

**Solution** : Les dépendances Firebase sont optionnelles. Si vous n'utilisez pas Firebase, désactivez-le :
```properties
firebase.storage.enabled=false
storage.enabled=false
```

### Erreur : "Access Denied" sur S3

**Solution** : Vérifier les permissions IAM et la bucket policy.

### Erreur : Webhook non reçu

**Solution** : 
- Vérifier que l'URL est accessible publiquement
- Utiliser ngrok pour le développement local
- Vérifier les logs du provider

---

## 📚 9. RESSOURCES

- **Firebase Storage** : https://firebase.google.com/docs/storage
- **AWS S3** : https://docs.aws.amazon.com/s3/
- **Wave API** : https://docs.wave.com/
- **Orange Money** : https://developer.orange.com/
- **M-Pesa** : https://developer.safaricom.co.ke/
- **Polygon** : https://polygon.technology/

---

**Dernière mise à jour :** 2025-01-27

