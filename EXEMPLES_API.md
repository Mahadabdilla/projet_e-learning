# 📡 EduAfrica - Exemples de Requêtes API

Ce fichier contient des exemples de requêtes pour tester l'API EduAfrica.

---

## 🔐 Authentification

### 1. Inscription (Register)

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Marie",
    "lastName": "Sow",
    "email": "marie.sow@example.com",
    "phone": "+221771234567",
    "country": "Sénégal",
    "password": "password123",
    "role": "APPRENANT"
  }'
```

**Réponse attendue:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 5,
  "email": "marie.sow@example.com",
  "firstName": "Marie",
  "lastName": "Sow",
  "role": "APPRENANT"
}
```

### 2. Connexion (Login)

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apprenant@eduafrica.com",
    "password": "password123"
  }'
```

**Réponse attendue:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 1,
  "email": "apprenant@eduafrica.com",
  "firstName": "Jean",
  "lastName": "Dupont",
  "role": "APPRENANT"
}
```

### 3. Profil utilisateur (nécessite JWT)

```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

---

## 📚 Formations

### 1. Liste toutes les formations

```bash
curl -X GET "http://localhost:8080/api/formations?page=0&size=12"
```

**Réponse:**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Développement Web Full Stack avec React et Node.js",
      "description": "Apprenez à créer des applications web modernes...",
      "category": "DEVELOPPEMENT",
      "level": "INTERMEDIAIRE",
      "price": 150000,
      "isFree": false,
      "duration": 120,
      "formateur": {
        "id": 2,
        "firstName": "Aminata",
        "lastName": "Diallo"
      },
      "tags": ["#React", "#NodeJS", "#JavaScript", "#FullStack"],
      "averageRating": 4.7,
      "nbStudents": 234
    }
  ],
  "totalElements": 6,
  "totalPages": 1,
  "size": 12,
  "number": 0
}
```

### 2. Détail d'une formation

```bash
curl -X GET http://localhost:8080/api/formations/1
```

### 3. Rechercher des formations

```bash
curl -X GET "http://localhost:8080/api/formations/search?keyword=React&page=0&size=12"
```

### 4. Filtrer les formations

```bash
# Par catégorie
curl -X GET "http://localhost:8080/api/formations/filter?category=DEVELOPPEMENT"

# Par niveau
curl -X GET "http://localhost:8080/api/formations/filter?level=DEBUTANT"

# Formations gratuites
curl -X GET "http://localhost:8080/api/formations/filter?isFree=true"

# Combinaison de filtres
curl -X GET "http://localhost:8080/api/formations/filter?category=DEVELOPPEMENT&level=INTERMEDIAIRE&isFree=false"
```

### 5. Créer une formation (FORMATEUR uniquement)

**Étape 1:** Se connecter en tant que formateur pour obtenir le token

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "formateur@eduafrica.com",
    "password": "password123"
  }'
```

**Étape 2:** Créer la formation avec le token

```bash
curl -X POST http://localhost:8080/api/formations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_FORMATEUR" \
  -d '{
    "title": "Python pour Data Science",
    "description": "Apprenez Python et les librairies essentielles pour la Data Science",
    "programme": "Module 1: Python basics\nModule 2: NumPy\nModule 3: Pandas\nModule 4: Matplotlib",
    "category": "DATA_SCIENCE",
    "level": "DEBUTANT",
    "price": 80000,
    "isFree": false,
    "duration": 60,
    "tags": ["#Python", "#DataScience", "#Pandas", "#NumPy"]
  }'
```

### 6. Modifier une formation (FORMATEUR)

```bash
curl -X PUT http://localhost:8080/api/formations/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_FORMATEUR" \
  -d '{
    "title": "Titre modifié",
    "description": "Description modifiée",
    "price": 200000,
    "duration": 150
  }'
```

### 7. Supprimer une formation (FORMATEUR/ADMIN)

```bash
curl -X DELETE http://localhost:8080/api/formations/1 \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

### 8. Mes formations (FORMATEUR)

```bash
curl -X GET http://localhost:8080/api/formations/my-formations \
  -H "Authorization: Bearer VOTRE_TOKEN_FORMATEUR"
```

---

## 🎓 Inscriptions (Enrollments)

### 1. S'inscrire à une formation (APPRENANT)

**Étape 1:** Se connecter en tant qu'apprenant

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apprenant@eduafrica.com",
    "password": "password123"
  }'
```

**Étape 2:** S'inscrire à la formation (ex: formation ID 1)

```bash
curl -X POST http://localhost:8080/api/enrollments/1 \
  -H "Authorization: Bearer VOTRE_TOKEN_APPRENANT"
```

**Réponse:**
```json
{
  "id": 1,
  "user": {
    "id": 1,
    "firstName": "Jean",
    "lastName": "Dupont"
  },
  "formation": {
    "id": 1,
    "title": "Développement Web Full Stack..."
  },
  "progress": 0,
  "enrolledAt": "2024-01-15T10:30:00",
  "completedAt": null
}
```

### 2. Mes inscriptions (APPRENANT)

```bash
curl -X GET http://localhost:8080/api/enrollments/my-enrollments \
  -H "Authorization: Bearer VOTRE_TOKEN_APPRENANT"
```

### 3. Mettre à jour la progression (APPRENANT)

```bash
curl -X PUT "http://localhost:8080/api/enrollments/1/progress?progress=50" \
  -H "Authorization: Bearer VOTRE_TOKEN_APPRENANT"
```

**Réponse:**
```json
{
  "id": 1,
  "progress": 50,
  "enrolledAt": "2024-01-15T10:30:00",
  "completedAt": null
}
```

---

## 📧 Contact

### Envoyer un message de contact

```bash
curl -X POST http://localhost:8080/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "email": "jean.dupont@example.com",
    "subject": "Question sur une formation",
    "message": "Bonjour, je voudrais savoir si..."
  }'
```

**Réponse:**
```json
{
  "message": "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais."
}
```

---

## 🧪 Scénarios de test complets

### Scénario 1: Parcours complet d'un apprenant

```bash
# 1. Inscription
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "+221771234567",
    "country": "Sénégal",
    "password": "test123",
    "role": "APPRENANT"
  }'

# Sauvegarder le token retourné dans une variable
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 2. Parcourir les formations
curl -X GET http://localhost:8080/api/formations

# 3. Voir le détail d'une formation
curl -X GET http://localhost:8080/api/formations/1

# 4. S'inscrire à la formation
curl -X POST http://localhost:8080/api/enrollments/1 \
  -H "Authorization: Bearer $TOKEN"

# 5. Voir mes inscriptions
curl -X GET http://localhost:8080/api/enrollments/my-enrollments \
  -H "Authorization: Bearer $TOKEN"

# 6. Mettre à jour ma progression
curl -X PUT "http://localhost:8080/api/enrollments/1/progress?progress=25" \
  -H "Authorization: Bearer $TOKEN"
```

### Scénario 2: Parcours d'un formateur

```bash
# 1. Connexion
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "formateur@eduafrica.com",
    "password": "password123"
  }'

TOKEN="..."

# 2. Voir mes formations
curl -X GET http://localhost:8080/api/formations/my-formations \
  -H "Authorization: Bearer $TOKEN"

# 3. Créer une nouvelle formation
curl -X POST http://localhost:8080/api/formations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Ma nouvelle formation",
    "description": "Description",
    "category": "DEVELOPPEMENT",
    "level": "DEBUTANT",
    "price": 50000,
    "duration": 40,
    "tags": ["#JavaScript"]
  }'

# 4. Modifier une formation
curl -X PUT http://localhost:8080/api/formations/7 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Titre mis à jour",
    "price": 60000
  }'
```

---

## 🛠️ Outils pour tester l'API

### 1. cURL (ligne de commande)
Tous les exemples ci-dessus utilisent cURL

### 2. Postman
1. Importer la collection (créer un fichier JSON avec toutes les requêtes)
2. Configurer les variables d'environnement :
   - `base_url` = `http://localhost:8080`
   - `token` = Le token JWT reçu après login

### 3. Insomnia
Alternative à Postman, interface simple

### 4. HTTPie (plus lisible que cURL)
```bash
# Installation
pip install httpie

# Exemple d'utilisation
http POST http://localhost:8080/api/auth/login \
  email=apprenant@eduafrica.com \
  password=password123
```

---

## 🐛 Débogage

### Vérifier que le backend est actif

```bash
curl http://localhost:8080/api/formations
```

Si ça fonctionne, vous devriez voir la liste des formations.

### Erreurs courantes

#### 401 Unauthorized
- Le token JWT est manquant ou invalide
- Vérifier que le token est bien dans le header `Authorization: Bearer TOKEN`

#### 403 Forbidden
- Le rôle de l'utilisateur n'a pas les permissions
- Exemple: un APPRENANT ne peut pas créer de formation

#### 404 Not Found
- L'endpoint n'existe pas
- Vérifier l'URL

#### 500 Internal Server Error
- Erreur serveur
- Consulter les logs du backend

---

## 📊 Postman Collection (JSON)

Créer un fichier `eduafrica.postman_collection.json` :

```json
{
  "info": {
    "name": "EduAfrica API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"firstName\": \"Test\",\n  \"lastName\": \"User\",\n  \"email\": \"test@example.com\",\n  \"phone\": \"+221771234567\",\n  \"country\": \"Sénégal\",\n  \"password\": \"test123\",\n  \"role\": \"APPRENANT\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/auth/register",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"apprenant@eduafrica.com\",\n  \"password\": \"password123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/auth/login",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "login"]
            }
          }
        }
      ]
    }
  ]
}
```

---

**Bon test ! 🧪**
