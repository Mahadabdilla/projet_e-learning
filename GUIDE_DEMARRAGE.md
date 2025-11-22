# 🎓 EduAfrica - Plateforme E-Learning Complète

## 📋 Vue d'ensemble

EduAfrica est une plateforme e-learning complète conçue spécialement pour l'Afrique avec :
- **Backend** : Spring Boot 3 + PostgreSQL + JWT
- **Frontend** : Angular 17 + Design moderne SaaS
- **4 rôles** : Apprenant, Formateur, Mentor, Admin
- **Fonctionnalités** : Formations, Mentorat, Certifications, Paiements locaux

---

## 🚀 GUIDE DE DÉMARRAGE RAPIDE

### Prérequis

- **Java 17+**
- **Maven 3.6+**
- **Node.js 18+** et npm
- **PostgreSQL 12+**
- **Angular CLI 17** : `npm install -g @angular/cli@17`

---

## 📦 ÉTAPE 1 : Configuration de la Base de Données

### 1. Installer PostgreSQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql
brew services start postgresql
```

### 2. Créer la base de données

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base de données
CREATE DATABASE eduafrica;

# Créer un utilisateur (optionnel)
CREATE USER eduafrica_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE eduafrica TO eduafrica_user;

# Quitter
\q
```

---

## 🔧 ÉTAPE 2 : Lancer le Backend

### 1. Extraire le code backend

```bash
tar -xzf eduafrica-backend.tar.gz
cd eduafrica-backend
```

### 2. Configuration

Modifier `src/main/resources/application.properties` :

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/eduafrica
spring.datasource.username=postgres
spring.datasource.password=votre_mot_de_passe
```

### 3. Lancer l'application

```bash
# Compiler et lancer
mvn clean install
mvn spring-boot:run
```

✅ Le backend sera accessible sur : **http://localhost:8080**

### 4. Vérifier que ça fonctionne

```bash
curl http://localhost:8080/api/auth/login
```

---

## 🎨 ÉTAPE 3 : Lancer le Frontend

### 1. Installer les dépendances

```bash
cd eduafrica-frontend
npm install
```

### 2. Lancer le serveur de développement

```bash
ng serve
```

✅ Le frontend sera accessible sur : **http://localhost:4200**

---

## 👥 COMPTES DE TEST

Après le premier lancement du backend, ces comptes seront créés automatiquement :

| Rôle | Email | Mot de passe | Dashboard |
|------|-------|--------------|-----------|
| **Apprenant** | apprenant@eduafrica.com | password123 | /dashboard/apprenant |
| **Formateur** | formateur@eduafrica.com | password123 | /dashboard/formateur |
| **Mentor** | mentor@eduafrica.com | password123 | /dashboard/mentor |
| **Admin** | admin@eduafrica.com | admin123 | /dashboard/admin |

---

## 📡 ENDPOINTS API PRINCIPAUX

### Authentification

```bash
# Inscription
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@example.com",
  "phone": "+221771234567",
  "country": "Sénégal",
  "password": "password123",
  "role": "APPRENANT"
}

# Connexion
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "apprenant@eduafrica.com",
  "password": "password123"
}

# Profil utilisateur (nécessite JWT)
GET http://localhost:8080/api/auth/me
Authorization: Bearer {votre_token}
```

### Formations

```bash
# Liste des formations
GET http://localhost:8080/api/formations?page=0&size=12

# Détail d'une formation
GET http://localhost:8080/api/formations/{id}

# Recherche
GET http://localhost:8080/api/formations/search?keyword=React

# Filtres
GET http://localhost:8080/api/formations/filter?category=DEVELOPPEMENT&level=DEBUTANT

# Créer une formation (FORMATEUR uniquement)
POST http://localhost:8080/api/formations
Authorization: Bearer {token_formateur}
Content-Type: application/json

{
  "title": "Ma nouvelle formation",
  "description": "Description détaillée",
  "category": "DEVELOPPEMENT",
  "level": "DEBUTANT",
  "price": 50000,
  "duration": 40,
  "tags": ["#React", "#JavaScript"]
}
```

### Inscriptions

```bash
# S'inscrire à une formation (APPRENANT)
POST http://localhost:8080/api/enrollments/{formationId}
Authorization: Bearer {token_apprenant}

# Mes inscriptions
GET http://localhost:8080/api/enrollments/my-enrollments
Authorization: Bearer {token_apprenant}

# Mettre à jour la progression
PUT http://localhost:8080/api/enrollments/{enrollmentId}/progress?progress=50
Authorization: Bearer {token_apprenant}
```

### Contact

```bash
# Envoyer un message
POST http://localhost:8080/api/contact
Content-Type: application/json

{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "subject": "Question",
  "message": "Bonjour, j'ai une question..."
}
```

---

## 🏗️ STRUCTURE DU PROJET

### Backend (Spring Boot)

```
eduafrica-backend/
├── src/main/java/com/eduafrica/
│   ├── EduAfricaApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── CorsConfig.java
│   │   └── DataInitializer.java
│   ├── model/
│   │   ├── User.java
│   │   ├── Formation.java
│   │   ├── Enrollment.java
│   │   ├── MentorProfile.java
│   │   ├── MentoringRequest.java
│   │   └── Certificate.java
│   ├── repository/
│   ├── service/
│   ├── controller/
│   ├── dto/
│   └── security/
└── src/main/resources/
    └── application.properties
```

### Frontend (Angular 17)

```
eduafrica-frontend/
├── src/app/
│   ├── core/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── services/
│   ├── shared/
│   │   ├── components/
│   │   └── models/
│   └── features/
│       ├── landing/
│       ├── auth/
│       ├── formations/
│       ├── mentors/
│       ├── about/
│       ├── contact/
│       └── dashboard/
│           ├── apprenant/
│           ├── formateur/
│           ├── mentor/
│           └── admin/
```

---

## 🎯 FONCTIONNALITÉS PAR RÔLE

### 👨‍🎓 APPRENANT
- ✅ Parcourir les formations
- ✅ S'inscrire aux formations
- ✅ Suivre sa progression
- ✅ Obtenir des certificats
- ✅ Demander du mentorat
- ✅ Dashboard personnalisé

### 👨‍🏫 FORMATEUR
- ✅ Créer des formations
- ✅ Modifier ses formations
- ✅ Voir les statistiques
- ✅ Gérer les inscrits
- ✅ Dashboard formateur

### 🧑‍💼 MENTOR
- ✅ Créer un profil mentor
- ✅ Recevoir des demandes de mentorat
- ✅ Planifier des séances
- ✅ Dashboard mentor

### 👑 ADMIN
- ✅ Gérer tous les utilisateurs
- ✅ Gérer toutes les formations
- ✅ Statistiques globales
- ✅ Dashboard admin

---

## 🔒 SÉCURITÉ

### JWT (JSON Web Token)

Tous les endpoints protégés nécessitent un token JWT dans le header :

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Obtenir un token

1. Se connecter via `/api/auth/login`
2. Le token est retourné dans la réponse
3. Stocker le token (localStorage côté Angular)
4. L'envoyer dans chaque requête protégée

---

## 🛠️ DÉVELOPPEMENT

### Modifier le backend

```bash
cd eduafrica-backend

# Après modification
mvn clean compile
mvn spring-boot:run
```

### Modifier le frontend

```bash
cd eduafrica-frontend

# Le serveur se recharge automatiquement
ng serve

# Build pour production
ng build --configuration production
```

---

## 📊 DONNÉES DE TEST

Le backend inclut un `DataInitializer` qui charge automatiquement :
- ✅ 4 utilisateurs de test (1 par rôle)
- ✅ 6 formations variées
- ✅ 1 profil mentor
- ✅ Toutes les catégories et niveaux

---

## 🐛 DÉPANNAGE

### Backend ne démarre pas

```bash
# Vérifier PostgreSQL
sudo systemctl status postgresql

# Vérifier les logs
tail -f /var/log/postgresql/postgresql-*.log

# Vérifier la connexion
psql -U postgres -d eduafrica
```

### Frontend ne compile pas

```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install

# Vérifier la version d'Angular
ng version
```

### Erreur CORS

Vérifier dans `CorsConfig.java` :

```java
.allowedOrigins("http://localhost:4200")
```

---

## 📚 PROCHAINES ÉTAPES

1. ✅ Tester l'authentification
2. ✅ Parcourir les formations
3. ✅ S'inscrire à une formation
4. ✅ Créer une formation (en tant que formateur)
5. ✅ Tester les différents dashboards
6. 🔄 Personnaliser le design
7. 🔄 Ajouter plus de formations
8. 🔄 Implémenter les paiements Mobile Money
9. 🔄 Ajouter le mode hors-ligne (PWA)
10. 🔄 Déployer en production

---

## 📞 SUPPORT

Pour toute question ou problème :
- 📧 Email : support@eduafrica.com
- 🐛 Issues : GitHub Issues
- 📖 Documentation : /docs

---

## 📝 LICENCE

MIT License - Libre d'utilisation

---

**Bon développement ! 🚀**
