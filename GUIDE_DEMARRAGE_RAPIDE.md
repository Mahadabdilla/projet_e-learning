# 🚀 Guide de Démarrage Rapide - EduAfrica

**Date** : 2025-01-27

---

## ⚡ Démarrage Sans Services Externes (Mode Développement)

Le projet fonctionne **sans configuration externe** en mode développement :

### 1. Démarrer la Base de Données

```bash
docker-compose up -d
```

### 2. Démarrer le Backend

```bash
cd eduafrica-backend/eduafrica-backend
mvn spring-boot:run
```

Le backend démarre sur `http://localhost:8080`

### 3. Démarrer le Frontend

```bash
cd eduafrica-frontend/eduafrica-frontend
npm install
npm start
```

Le frontend démarre sur `http://localhost:4200`

---

## ✅ Configuration Par Défaut

Le projet est configuré pour fonctionner **sans services externes** :

- ✅ **Stockage** : Local (`uploads/` directory)
- ✅ **Mobile Money** : Mode sandbox/simulation
- ✅ **Blockchain** : Simulation locale
- ✅ **Base de données** : PostgreSQL via Docker

---

## 🔧 Activer les Services Externes (Production)

### Option 1 : Firebase Storage

1. Créer un projet Firebase
2. Télécharger le fichier de credentials JSON
3. Modifier `application.properties` :

```properties
storage.provider=firebase
storage.enabled=true
firebase.storage.bucket=votre-bucket.appspot.com
firebase.storage.credentials.path=/chemin/vers/key.json
firebase.storage.enabled=true
```

### Option 2 : AWS S3

1. Créer un bucket S3
2. Créer un utilisateur IAM avec permissions S3
3. Modifier `application.properties` :

```properties
storage.provider=s3
storage.enabled=true
aws.s3.bucket=votre-bucket
aws.s3.region=us-east-1
aws.s3.access-key=votre-access-key
aws.s3.secret-key=votre-secret-key
aws.s3.enabled=true
```

### Mobile Money

Pour chaque provider, ajouter les clés dans `application.properties` :

```properties
# Wave
wave.api.key=votre_cle
wave.api.secret=votre_secret
wave.sandbox=false

# Orange Money
orange.money.merchant.key=votre_cle
orange.money.sandbox=false

# M-Pesa
mpesa.consumer.key=votre_cle
mpesa.consumer.secret=votre_secret
mpesa.shortcode=votre_shortcode
mpesa.passkey=votre_passkey
mpesa.sandbox=false
```

---

## 📚 Documentation Complète

Voir `CONFIGURATION_SERVICES_EXTERNES.md` pour les détails complets.

---

## 🆘 Problèmes Courants

### Erreur : "NoClassDefFoundError: com/google/auth/Credentials"

**Solution** : Les dépendances Firebase sont optionnelles. Si vous n'utilisez pas Firebase, le backend fonctionne normalement avec le stockage local.

### Le backend ne démarre pas

**Vérifier** :
1. PostgreSQL est démarré : `docker-compose ps`
2. Port 8080 est libre
3. Les dépendances Maven sont installées : `mvn clean install`

### Le frontend ne compile pas

**Vérifier** :
1. Node.js est installé : `node --version`
2. Les dépendances sont installées : `npm install`
3. Port 4200 est libre

---

**Le projet est prêt à être utilisé en mode développement !**

