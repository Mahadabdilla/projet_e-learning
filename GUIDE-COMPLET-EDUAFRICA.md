# 🎓 GUIDE COMPLET - Plateforme EduAfrica

## Vue d'ensemble du projet

EduAfrica est une plateforme e-learning complète développée avec **Angular 17** (frontend) et **Spring Boot 3** (backend). Elle permet aux utilisateurs africains d'accéder à des formations, du mentorat et des certificats.

---

## 📦 Ce qui a été créé - PARTIE 1 : BACKEND

### ✅ Architecture Backend Complète

```
eduafrica-backend/
├── src/main/java/com/eduafrica/
│   ├── EduAfricaApplication.java          # Point d'entrée
│   ├── config/
│   │   ├── SecurityConfig.java            # Configuration Spring Security + JWT
│   │   ├── CorsConfig.java                # Configuration CORS
│   │   └── DataInitializer.java           # Données de test
│   ├── model/                             # 7 Entités JPA
│   │   ├── User.java
│   │   ├── Formation.java
│   │   ├── Enrollment.java
│   │   ├── MentorProfile.java
│   │   ├── MentoringRequest.java
│   │   ├── Certificate.java
│   │   └── Payment.java
│   ├── repository/                        # 7 Repositories Spring Data
│   │   ├── UserRepository.java
│   │   ├── FormationRepository.java
│   │   ├── EnrollmentRepository.java
│   │   ├── MentorProfileRepository.java
│   │   ├── MentoringRequestRepository.java
│   │   ├── CertificateRepository.java
│   │   └── PaymentRepository.java
│   ├── security/                          # Sécurité JWT
│   │   ├── JwtTokenProvider.java
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── JwtAuthenticationEntryPoint.java
│   │   ├── CustomUserDetailsService.java
│   │   └── UserPrincipal.java
│   ├── service/                           # Services métier
│   │   ├── AuthService.java
│   │   └── FormationService.java
│   ├── controller/                        # Contrôleurs REST
│   │   ├── AuthController.java
│   │   └── FormationController.java
│   ├── dto/                               # Data Transfer Objects
│   │   ├── RegisterRequest.java
│   │   ├── LoginRequest.java
│   │   ├── JwtAuthenticationResponse.java
│   │   ├── UserResponse.java
│   │   ├── ApiResponse.java
│   │   ├── FormationRequest.java
│   │   └── FormationResponse.java
│   └── enums/                             # Énumérations
│       ├── Role.java                      # APPRENANT, FORMATEUR, MENTOR, ADMIN
│       ├── FormationLevel.java            # DEBUTANT, INTERMEDIAIRE, AVANCE
│       ├── Category.java                  # 10 catégories
│       ├── PaymentStatus.java
│       └── MentoringStatus.java
├── src/main/resources/
│   └── application.properties             # Configuration
├── pom.xml                                # Dépendances Maven
└── README.md                              # Documentation

```

### 🔑 Fonctionnalités Backend Implémentées

#### 1. Authentification JWT complète ✅
- **POST** `/api/auth/register` - Inscription avec validation
- **POST** `/api/auth/login` - Connexion et génération de token
- **GET** `/api/auth/me` - Récupération du profil utilisateur

#### 2. Gestion des Formations ✅
- **GET** `/api/formations` - Liste paginée (public)
- **GET** `/api/formations/{id}` - Détails d'une formation
- **GET** `/api/formations/search?keyword=...` - Recherche
- **GET** `/api/formations/filter?categorie=...&niveau=...` - Filtres
- **POST** `/api/formateur/formations` - Créer (Formateur)
- **PUT** `/api/formateur/formations/{id}` - Modifier
- **DELETE** `/api/formateur/formations/{id}` - Supprimer
- **GET** `/api/formateur/formations` - Mes formations

#### 3. Sécurité ✅
- Hashage BCrypt des mots de passe
- Tokens JWT (expiration 24h)
- Protection par rôles (APPRENANT, FORMATEUR, MENTOR, ADMIN)
- CORS configuré
- Validation des DTOs

#### 4. Base de données ✅
- 7 entités JPA avec relations
- Hibernate DDL auto-update
- PostgreSQL / MySQL compatible

---

## 🚀 Comment démarrer le Backend

### Prérequis
```bash
- Java 17+
- Maven 3.6+
- PostgreSQL 12+ (ou MySQL 8+)
```

### Étape 1 : Créer la base de données
```sql
CREATE DATABASE eduafrica_db;
```

### Étape 2 : Extraire l'archive
```bash
tar -xzf eduafrica-backend.tar.gz
cd eduafrica-backend
```

### Étape 3 : Configurer application.properties
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/eduafrica_db
spring.datasource.username=postgres
spring.datasource.password=votre_mot_de_passe
```

### Étape 4 : Lancer l'application
```bash
mvn spring-boot:run
```

**L'API sera disponible sur:** `http://localhost:8080`

---

## 👥 Comptes de test créés automatiquement

| Rôle | Email | Mot de passe | Description |
|------|-------|--------------|-------------|
| **Admin** | admin@eduafrica.com | admin123 | Accès complet |
| **Formateur** | amadou.diallo@eduafrica.com | password123 | Expert Dev Web |
| **Formateur** | fatou.sow@eduafrica.com | password123 | Expert Data Science |
| **Mentor** | moussa.ndiaye@eduafrica.com | password123 | Mentor Entrepreneuriat |
| **Apprenant** | aissatou.ba@gmail.com | password123 | Utilisateur standard |

### Formations de test créées
1. **Développement Web Complet avec React et Node.js** (45 000 XOF)
2. **Introduction à l'Intelligence Artificielle** (Gratuit)
3. **Marketing Digital pour Entrepreneurs Africains** (30 000 XOF)
4. **Cybersécurité : Protégez vos systèmes** (60 000 XOF)

---

## 📡 Tester l'API avec Postman/Insomnia

### 1. Inscription d'un nouvel utilisateur
```http
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "firstName": "Moussa",
  "lastName": "Kane",
  "email": "moussa.kane@example.com",
  "phone": "+221771234567",
  "country": "Sénégal",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "APPRENANT",
  "acceptTerms": true
}
```

**Réponse attendue:**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": 6,
    "firstName": "Moussa",
    "lastName": "Kane",
    "email": "moussa.kane@example.com",
    "role": "APPRENANT"
  }
}
```

### 2. Connexion
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "admin@eduafrica.com",
  "password": "admin123"
}
```

### 3. Liste des formations (public)
```http
GET http://localhost:8080/api/formations?page=0&size=10
```

### 4. Rechercher des formations
```http
GET http://localhost:8080/api/formations/search?keyword=react&page=0&size=10
```

### 5. Filtrer les formations
```http
GET http://localhost:8080/api/formations/filter?categorie=DEVELOPPEMENT&niveau=INTERMEDIAIRE&page=0
```

### 6. Créer une formation (Formateur)
```http
POST http://localhost:8080/api/formateur/formations
Authorization: Bearer {token}
Content-Type: application/json

{
  "titre": "Python pour Data Science",
  "description": "Formation complète sur Python et les librairies de Data Science",
  "programme": "Module 1: Intro Python\nModule 2: NumPy & Pandas\nModule 3: Matplotlib",
  "categorie": "DATA_SCIENCE",
  "niveau": "INTERMEDIAIRE",
  "prix": 35000,
  "isGratuit": false,
  "dureeHeures": 30,
  "tags": ["Python", "Data Science", "ML"],
  "isPublished": true
}
```

### 7. Récupérer mon profil
```http
GET http://localhost:8080/api/auth/me
Authorization: Bearer {token}
```

---

## 🔧 Technologies utilisées - Backend

| Technologie | Version | Usage |
|-------------|---------|-------|
| Java | 17 | Langage |
| Spring Boot | 3.2.0 | Framework |
| Spring Security | 6.x | Sécurité + JWT |
| Spring Data JPA | 3.x | ORM |
| PostgreSQL | 12+ | Base de données |
| Hibernate | 6.x | ORM Implementation |
| JWT (jjwt) | 0.12.3 | Authentification |
| Lombok | Latest | Réduction du boilerplate |
| Maven | 3.6+ | Build tool |

---

## 📊 Modèle de données

### Relations principales

```
User (1) ────────< (N) Formation [formateur]
User (1) ────────< (N) Enrollment [apprenant]
Formation (1) ───< (N) Enrollment
User (1) ────────< (1) MentorProfile
MentorProfile (1) < (N) MentoringRequest
Enrollment (1) ──< (1) Certificate
Enrollment (1) ──< (N) Payment
```

### Entités détaillées

#### User
- id, firstName, lastName, email (unique)
- phone, country, password (hashé)
- role (APPRENANT, FORMATEUR, MENTOR, ADMIN)
- profileImage, bio, isActive, emailVerified
- dateCreation, dateModification

#### Formation
- id, titre, description, programme
- categorie, niveau, prix, isGratuit
- dureeHeures, imageUrl, videoIntroUrl
- tags[], nbEtudiants, noteAverage, nbEvaluations
- formateur (ManyToOne User)
- isPublished, isActive, dateCreation

#### Enrollment (Inscription)
- id, apprenant, formation
- progression (0-100), isCompleted, dateCompletion
- note, commentaire, prochaineLecon

#### MentorProfile
- id, user (OneToOne)
- specialite, presentation, competences[]
- anneesExperience, nbSeances
- noteAverage, tarifHoraire, isAvailable, isVerified

#### MentoringRequest
- id, apprenant, mentor
- sujet, description, status
- dateSeance, dureeMinutes, notes, feedback

#### Certificate
- id, certificateId (UUID)
- enrollment, nomApprenant, titreFormation
- dateEmission, pdfUrl, blockchainHash

#### Payment
- id, enrollment, montant, devise (XOF)
- methodePaiement (Orange Money, Wave, M-Pesa...)
- status, transactionId, providerReference

---

## ⏭️ PROCHAINES ÉTAPES

### Phase 2 : Services et Endpoints restants
- [ ] EnrollmentService + Controller (inscriptions)
- [ ] MentorService + Controller (mentors)
- [ ] ContactService (formulaire de contact)
- [ ] DashboardService (statistiques par rôle)

### Phase 3 : Frontend Angular 17
- [ ] Configuration du projet Angular
- [ ] Services Angular (AuthService, FormationService, etc.)
- [ ] Guards (AuthGuard, RoleGuard)
- [ ] Composants des pages (Home, Formations, Mentors, About, Contact)
- [ ] Composants d'authentification (Login, Register)
- [ ] Dashboards par rôle
- [ ] Intégration avec l'API backend

### Phase 4 : Fonctionnalités avancées
- [ ] Système de paiement (Mobile Money)
- [ ] Génération de certificats PDF
- [ ] Mode hors-ligne (PWA)
- [ ] Chat en temps réel (Mentors/Apprenants)
- [ ] Notifications email
- [ ] Upload de fichiers (images, vidéos)

---

## 🐛 Dépannage

### Erreur de connexion à la base de données
```
Vérifiez que PostgreSQL est démarré:
sudo service postgresql start

Vérifiez les credentials dans application.properties
```

### Erreur "Port 8080 already in use"
```bash
# Trouver le processus
lsof -i :8080

# Tuer le processus
kill -9 <PID>
```

### Les données de test ne se créent pas
```
Supprimez la base et recréez-la:
DROP DATABASE eduafrica_db;
CREATE DATABASE eduafrica_db;

Relancez l'application
```

---

## 📞 Support

Pour toute question ou problème:
1. Vérifiez les logs dans la console
2. Consultez le README.md
3. Testez les endpoints avec Postman

---

## 📝 Résumé de l'étape actuelle

### ✅ Ce qui fonctionne
1. **Backend Spring Boot** complet et fonctionnel
2. **Authentification JWT** avec inscription/connexion
3. **API Formations** complète (CRUD + recherche + filtres)
4. **Base de données** avec 7 entités et relations
5. **Sécurité** par rôles
6. **Données de test** automatiques

### ⏭️ Prochaine étape recommandée
**Créer le frontend Angular 17** avec :
- Configuration du projet
- Services d'API
- Pages principales
- Composants d'authentification
- Guards de routing

---

**Version:** 1.0 - Backend Complete
**Date:** 2025
**Auteur:** Équipe EduAfrica
