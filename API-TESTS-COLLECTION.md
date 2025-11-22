# 📡 Collection de Tests API - EduAfrica

## Configuration de base

**Base URL:** `http://localhost:8080/api`

**Headers communs:**
```
Content-Type: application/json
```

**Headers avec authentification:**
```
Content-Type: application/json
Authorization: Bearer {votre_token_jwt}
```

---

## 🔐 AUTHENTIFICATION

### 1. Inscription - Apprenant
```http
POST {{baseUrl}}/auth/register

{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "phone": "+221771234567",
  "country": "Sénégal",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "APPRENANT",
  "acceptTerms": true
}
```

### 2. Inscription - Formateur
```http
POST {{baseUrl}}/auth/register

{
  "firstName": "Marie",
  "lastName": "Martin",
  "email": "marie.martin@example.com",
  "phone": "+221771234568",
  "country": "Côte d'Ivoire",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "FORMATEUR",
  "acceptTerms": true
}
```

### 3. Inscription - Mentor
```http
POST {{baseUrl}}/auth/register

{
  "firstName": "Ibrahim",
  "lastName": "Diop",
  "email": "ibrahim.diop@example.com",
  "phone": "+221771234569",
  "country": "Mali",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "MENTOR",
  "acceptTerms": true
}
```

### 4. Connexion - Admin
```http
POST {{baseUrl}}/auth/login

{
  "email": "admin@eduafrica.com",
  "password": "admin123"
}
```

**Réponse attendue:**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "firstName": "Admin",
    "lastName": "EduAfrica",
    "email": "admin@eduafrica.com",
    "phone": "+221771234567",
    "country": "Sénégal",
    "role": "ADMIN",
    "isActive": true
  }
}
```

### 5. Connexion - Formateur
```http
POST {{baseUrl}}/auth/login

{
  "email": "amadou.diallo@eduafrica.com",
  "password": "password123"
}
```

### 6. Connexion - Apprenant
```http
POST {{baseUrl}}/auth/login

{
  "email": "aissatou.ba@gmail.com",
  "password": "password123"
}
```

### 7. Mon Profil (Authentifié)
```http
GET {{baseUrl}}/auth/me
Authorization: Bearer {token}
```

---

## 📚 FORMATIONS (Public - Sans authentification)

### 1. Liste toutes les formations
```http
GET {{baseUrl}}/formations?page=0&size=10
```

### 2. Détails d'une formation
```http
GET {{baseUrl}}/formations/1
```

### 3. Rechercher des formations
```http
GET {{baseUrl}}/formations/search?keyword=react&page=0&size=10
```

**Exemples de recherche:**
- `keyword=web` - Toutes les formations contenant "web"
- `keyword=intelligence artificielle` - Formations d'IA
- `keyword=marketing` - Formations de marketing

### 4. Filtrer par catégorie
```http
GET {{baseUrl}}/formations/filter?categorie=DEVELOPPEMENT&page=0&size=10
```

**Catégories disponibles:**
- `DEVELOPPEMENT`
- `MARKETING`
- `TECHNOLOGIE`
- `BUSINESS`
- `SECURITE`
- `AGRICULTURE`
- `DESIGN`
- `DATA_SCIENCE`
- `FINANCE`
- `SANTE`

### 5. Filtrer par niveau
```http
GET {{baseUrl}}/formations/filter?niveau=DEBUTANT&page=0&size=10
```

**Niveaux disponibles:**
- `DEBUTANT`
- `INTERMEDIAIRE`
- `AVANCE`

### 6. Formations gratuites
```http
GET {{baseUrl}}/formations/filter?isGratuit=true&page=0&size=10
```

### 7. Filtres combinés
```http
GET {{baseUrl}}/formations/filter?categorie=DATA_SCIENCE&niveau=DEBUTANT&isGratuit=true&page=0&size=10
```

---

## 👨‍🏫 FORMATEUR - Gestion des formations

⚠️ **Nécessite authentification avec rôle FORMATEUR ou ADMIN**

### 1. Mes formations
```http
GET {{baseUrl}}/formateur/formations
Authorization: Bearer {token_formateur}
```

### 2. Créer une formation
```http
POST {{baseUrl}}/formateur/formations
Authorization: Bearer {token_formateur}
Content-Type: application/json

{
  "titre": "Python pour Data Science - Niveau Avancé",
  "description": "Formation complète et avancée sur Python pour la Data Science. Apprenez NumPy, Pandas, Matplotlib, Scikit-learn et plus encore. Projets pratiques inclus.",
  "programme": "Module 1: Python Avancé (Decorators, Generators, Context Managers)\nModule 2: NumPy pour le calcul scientifique\nModule 3: Pandas pour l'analyse de données\nModule 4: Visualisation avec Matplotlib et Seaborn\nModule 5: Machine Learning avec Scikit-learn\nModule 6: Projet final - Analyse prédictive",
  "categorie": "DATA_SCIENCE",
  "niveau": "AVANCE",
  "prix": 55000,
  "isGratuit": false,
  "dureeHeures": 45,
  "imageUrl": "https://example.com/python-ds.jpg",
  "videoIntroUrl": "https://example.com/intro-video.mp4",
  "tags": ["Python", "Data Science", "ML", "Pandas", "NumPy", "Scikit-learn"],
  "isPublished": true
}
```

### 3. Créer une formation gratuite
```http
POST {{baseUrl}}/formateur/formations
Authorization: Bearer {token_formateur}
Content-Type: application/json

{
  "titre": "Introduction à Git et GitHub",
  "description": "Maîtrisez les bases de Git et GitHub pour versionner votre code et collaborer efficacement.",
  "programme": "Module 1: Introduction à Git\nModule 2: Commandes de base\nModule 3: Branches et merges\nModule 4: GitHub - Push et Pull\nModule 5: Collaboration sur GitHub",
  "categorie": "DEVELOPPEMENT",
  "niveau": "DEBUTANT",
  "prix": 0,
  "isGratuit": true,
  "dureeHeures": 10,
  "tags": ["Git", "GitHub", "Version Control"],
  "isPublished": true
}
```

### 4. Modifier une formation
```http
PUT {{baseUrl}}/formateur/formations/1
Authorization: Bearer {token_formateur}
Content-Type: application/json

{
  "titre": "Développement Web Complet avec React et Node.js - Édition 2025",
  "description": "Formation mise à jour avec les dernières versions de React 18 et Node.js 20",
  "programme": "Module 1: Introduction au Web moderne\nModule 2: HTML5 et CSS3 avancés\nModule 3: JavaScript ES2024\nModule 4: React 18 avec Hooks\nModule 5: Node.js 20 et Express\nModule 6: MongoDB et Mongoose\nModule 7: Projet e-commerce complet",
  "categorie": "DEVELOPPEMENT",
  "niveau": "INTERMEDIAIRE",
  "prix": 50000,
  "isGratuit": false,
  "dureeHeures": 50,
  "tags": ["React", "Node.js", "MongoDB", "JavaScript", "Web", "E-commerce"],
  "isPublished": true
}
```

### 5. Supprimer une formation (soft delete)
```http
DELETE {{baseUrl}}/formateur/formations/5
Authorization: Bearer {token_formateur}
```

---

## 🎓 APPRENANT - Inscriptions aux formations

⚠️ **Nécessite authentification avec rôle APPRENANT ou ADMIN**

### 1. S'inscrire à une formation (À implémenter)
```http
POST {{baseUrl}}/apprenant/enrollments
Authorization: Bearer {token_apprenant}
Content-Type: application/json

{
  "formationId": 1
}
```

### 2. Mes inscriptions (À implémenter)
```http
GET {{baseUrl}}/apprenant/enrollments
Authorization: Bearer {token_apprenant}
```

### 3. Mettre à jour ma progression (À implémenter)
```http
PUT {{baseUrl}}/apprenant/enrollments/1/progress
Authorization: Bearer {token_apprenant}
Content-Type: application/json

{
  "progression": 45.5,
  "prochaineLecon": "Module 3 - Lesson 2"
}
```

---

## 👨‍💼 MENTORS (À implémenter)

### 1. Liste des mentors
```http
GET {{baseUrl}}/mentors?page=0&size=10
```

### 2. Profil d'un mentor
```http
GET {{baseUrl}}/mentors/1
```

### 3. Demander un mentorat
```http
POST {{baseUrl}}/apprenant/mentoring-requests
Authorization: Bearer {token_apprenant}
Content-Type: application/json

{
  "mentorId": 1,
  "sujet": "Accompagnement projet e-commerce",
  "description": "J'ai besoin d'aide pour structurer mon projet e-commerce et définir la stack technique appropriée."
}
```

---

## 📧 CONTACT (À implémenter)

### Envoyer un message de contact
```http
POST {{baseUrl}}/contact
Content-Type: application/json

{
  "nom": "Fatou Sall",
  "email": "fatou.sall@example.com",
  "sujet": "Question sur les certifications",
  "message": "Bonjour, je voudrais savoir si vos certificats sont reconnus internationalement ?"
}
```

---

## 🔍 Codes de réponse HTTP

| Code | Signification |
|------|---------------|
| 200 | OK - Succès |
| 201 | Created - Ressource créée |
| 400 | Bad Request - Données invalides |
| 401 | Unauthorized - Non authentifié |
| 403 | Forbidden - Accès refusé |
| 404 | Not Found - Ressource non trouvée |
| 500 | Internal Server Error - Erreur serveur |

---

## 📝 Exemples de réponses d'erreur

### Erreur de validation
```json
{
  "success": false,
  "message": "Le titre est obligatoire"
}
```

### Erreur d'authentification
```json
{
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource"
}
```

### Erreur métier
```json
{
  "success": false,
  "message": "Vous n'êtes pas autorisé à modifier cette formation"
}
```

---

## 🧪 Scénarios de test

### Scénario 1: Créer un compte et explorer les formations
1. Créer un compte apprenant
2. Se connecter
3. Récupérer son profil
4. Lister les formations
5. Rechercher une formation spécifique

### Scénario 2: Formateur crée et publie une formation
1. Se connecter en tant que formateur
2. Créer une nouvelle formation
3. Vérifier qu'elle apparaît dans "Mes formations"
4. La publier
5. Vérifier qu'elle est visible dans la liste publique

### Scénario 3: Test des filtres
1. Filtrer par catégorie DEVELOPPEMENT
2. Filtrer par niveau DEBUTANT
3. Filtrer les formations gratuites
4. Combiner les filtres

---

## 💡 Tips

1. **Sauvegarder le token JWT** après connexion pour les requêtes suivantes
2. **Utiliser les variables d'environnement** dans Postman/Insomnia :
   - `{{baseUrl}}` = `http://localhost:8080/api`
   - `{{token}}` = votre JWT
3. **Tester d'abord sans auth** (endpoints publics) puis avec auth
4. **Vérifier les logs du backend** en cas d'erreur

---

**Date de création:** 2025
**Version API:** 1.0
**Prochaines fonctionnalités:** Enrollments, Mentors, Contact, Dashboards
