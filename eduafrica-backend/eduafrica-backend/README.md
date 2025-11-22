# EduAfrica Backend - Spring Boot 3

## 📋 Prérequis

- Java 17+
- Maven 3.6+
- PostgreSQL 12+

## 🚀 Installation et lancement

### 1. Créer la base de données PostgreSQL

```sql
CREATE DATABASE eduafrica;
```

### 2. Configuration

Modifier `src/main/resources/application.properties` si nécessaire :

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/eduafrica
spring.datasource.username=postgres
spring.datasource.password=postgres
```

### 3. Lancer l'application

```bash
cd eduafrica-backend
mvn clean install
mvn spring-boot:run
```

L'API sera accessible sur : `http://localhost:8080`

## 👥 Comptes de test

Après le premier lancement, les comptes suivants seront créés automatiquement :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Apprenant | apprenant@eduafrica.com | password123 |
| Formateur | formateur@eduafrica.com | password123 |
| Mentor | mentor@eduafrica.com | password123 |
| Admin | admin@eduafrica.com | admin123 |

## 📡 Endpoints principaux

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

### Formations
- `GET /api/formations` - Liste des formations
- `GET /api/formations/{id}` - Détail d'une formation
- `GET /api/formations/search?keyword={keyword}` - Recherche
- `GET /api/formations/filter?category={category}&level={level}` - Filtres
- `POST /api/formations` - Créer une formation (FORMATEUR)
- `PUT /api/formations/{id}` - Modifier une formation (FORMATEUR)
- `DELETE /api/formations/{id}` - Supprimer une formation (FORMATEUR/ADMIN)

### Inscriptions
- `POST /api/enrollments/{formationId}` - S'inscrire à une formation (APPRENANT)
- `GET /api/enrollments/my-enrollments` - Mes inscriptions (APPRENANT)
- `PUT /api/enrollments/{enrollmentId}/progress?progress={0-100}` - Mettre à jour la progression

### Contact
- `POST /api/contact` - Envoyer un message de contact

## 🔒 Sécurité

L'API utilise JWT pour l'authentification. Pour accéder aux endpoints protégés :

```
Authorization: Bearer {votre_token_jwt}
```

## 📦 Technologies utilisées

- Spring Boot 3.2.0
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL
- Lombok
- Maven
