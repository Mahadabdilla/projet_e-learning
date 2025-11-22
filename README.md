# 🎓 EduAfrica - Plateforme E-Learning pour l'Afrique

<div align="center">

![EduAfrica Logo](https://via.placeholder.com/200x200/667eea/ffffff?text=EduAfrica)

**Transformez votre carrière avec des formations de qualité adaptées au marché africain**

[![Java](https://img.shields.io/badge/Java-17-orange)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-17-red)](https://angular.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

</div>

---

## 📖 À propos

EduAfrica est une plateforme e-learning complète conçue pour répondre aux besoins spécifiques du marché africain. Elle offre :

- 🎯 **Formations certifiantes** dans des domaines variés (Développement, Marketing, IA, Business...)
- 👨‍🏫 **Mentorat personnalisé** avec des experts locaux
- 💳 **Paiements locaux** (Orange Money, Wave, M-Pesa)
- 📱 **Mode hors-ligne** pour apprendre sans connexion permanente
- 🌍 **Contenu adapté** au contexte africain

---

## ✨ Fonctionnalités principales

### Pour les Apprenants 👨‍🎓
- Parcourir et rechercher des formations
- S'inscrire et suivre des cours
- Suivre sa progression
- Obtenir des certificats
- Demander du mentorat
- Dashboard personnalisé

### Pour les Formateurs 👨‍🏫
- Créer et gérer des formations
- Ajouter du contenu multimédia
- Voir les statistiques d'inscription
- Communiquer avec les apprenants
- Dashboard formateur

### Pour les Mentors 🧑‍💼
- Créer un profil mentor
- Recevoir et gérer les demandes de mentorat
- Planifier des séances
- Suivre ses mentees
- Dashboard mentor

### Pour les Administrateurs 👑
- Gérer tous les utilisateurs
- Modérer les formations
- Consulter les statistiques globales
- Dashboard admin complet

---

## 🏗️ Architecture

### Stack Technique

**Backend**
- Java 17
- Spring Boot 3.2.0
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL
- Maven

**Frontend**
- Angular 17
- TypeScript
- RxJS
- Tailwind CSS / CSS Grid-Flexbox
- Standalone Components

### Structure

```
eduafrica/
├── backend/          # API REST Spring Boot
│   ├── config/       # Configuration (Security, CORS, JWT)
│   ├── model/        # Entités JPA
│   ├── repository/   # Repositories
│   ├── service/      # Logique métier
│   ├── controller/   # Contrôleurs REST
│   ├── dto/          # Data Transfer Objects
│   └── security/     # JWT et sécurité
│
└── frontend/         # Application Angular
    ├── core/         # Services, Guards, Interceptors
    ├── shared/       # Composants partagés, Models
    └── features/     # Modules fonctionnels
        ├── landing/
        ├── auth/
        ├── formations/
        ├── mentors/
        └── dashboard/
```

---

## 🚀 Installation

### Prérequis

- Java 17 ou supérieur
- Maven 3.6+
- Node.js 18+
- PostgreSQL 12+
- Angular CLI 17

### Méthode 1 : Script automatique (recommandé)

```bash
# Rendre le script exécutable
chmod +x start-eduafrica.sh

# Lancer le script
./start-eduafrica.sh
```

Le script va :
1. ✅ Vérifier tous les prérequis
2. ✅ Créer la base de données
3. ✅ Compiler et lancer le backend
4. ✅ Installer et lancer le frontend

### Méthode 2 : Installation manuelle

#### 1. Base de données

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base de données
CREATE DATABASE eduafrica;
\q
```

#### 2. Backend

```bash
cd eduafrica-backend

# Configuration (modifier application.properties si nécessaire)
# spring.datasource.url=jdbc:postgresql://localhost:5432/eduafrica
# spring.datasource.username=postgres
# spring.datasource.password=votre_mot_de_passe

# Compiler et lancer
mvn clean install
mvn spring-boot:run
```

Le backend sera disponible sur **http://localhost:8080**

#### 3. Frontend

```bash
cd eduafrica-frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
ng serve
```

Le frontend sera disponible sur **http://localhost:4200**

---

## 👥 Comptes de test

Des comptes de test sont créés automatiquement au premier démarrage :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Apprenant | apprenant@eduafrica.com | password123 |
| Formateur | formateur@eduafrica.com | password123 |
| Mentor | mentor@eduafrica.com | password123 |
| Admin | admin@eduafrica.com | admin123 |

---

## 📡 API Endpoints

### Authentification

```http
POST /api/auth/register    # Inscription
POST /api/auth/login       # Connexion
GET  /api/auth/me          # Profil utilisateur (JWT requis)
```

### Formations

```http
GET    /api/formations                    # Liste des formations
GET    /api/formations/{id}               # Détail d'une formation
GET    /api/formations/search?keyword=... # Recherche
GET    /api/formations/filter?...         # Filtres
POST   /api/formations                    # Créer (FORMATEUR)
PUT    /api/formations/{id}               # Modifier (FORMATEUR)
DELETE /api/formations/{id}               # Supprimer (FORMATEUR/ADMIN)
```

### Inscriptions

```http
POST /api/enrollments/{formationId}                    # S'inscrire (APPRENANT)
GET  /api/enrollments/my-enrollments                  # Mes inscriptions
PUT  /api/enrollments/{id}/progress?progress=50       # Progression
```

### Contact

```http
POST /api/contact    # Envoyer un message
```

Documentation complète : [API Documentation](docs/API.md)

---

## 🎨 Captures d'écran

### Page d'accueil
![Landing Page](screenshots/landing.png)

### Catalogue de formations
![Formations](screenshots/formations.png)

### Dashboard Apprenant
![Dashboard](screenshots/dashboard.png)

---

## 🔒 Sécurité

- ✅ Authentification JWT
- ✅ Mots de passe hashés (BCrypt)
- ✅ Protection CORS
- ✅ Validation des données
- ✅ Guards Angular pour les routes protégées
- ✅ Intercepteurs HTTP pour les tokens

---

## 📊 Données de démonstration

Le backend inclut 6 formations de test dans différents domaines :
- Développement Web (React, Node.js)
- Marketing Digital
- Intelligence Artificielle
- Applications mobiles (Flutter)
- Cybersécurité
- Cloud Computing (AWS)

---

## 🛠️ Développement

### Commandes utiles

```bash
# Backend
cd eduafrica-backend
mvn clean install          # Compiler
mvn spring-boot:run        # Lancer
mvn test                   # Tests

# Frontend
cd eduafrica-frontend
npm install                # Dépendances
ng serve                   # Dev server
ng build                   # Build prod
ng test                    # Tests
```

### Structure des branches

- `main` - Production
- `develop` - Développement
- `feature/*` - Nouvelles fonctionnalités
- `fix/*` - Corrections de bugs

---

## 📈 Roadmap

### Phase 1 - MVP (Complété ✅)
- [x] Authentification et autorisation
- [x] Gestion des formations
- [x] Inscriptions et progression
- [x] Dashboards par rôle
- [x] Design responsive

### Phase 2 - Fonctionnalités avancées
- [ ] Système de paiement Mobile Money
- [ ] Mode hors-ligne (PWA)
- [ ] Chat en temps réel
- [ ] Système de notation et avis
- [ ] Certificats PDF

### Phase 3 - Optimisations
- [ ] Performance et caching
- [ ] Analytics avancés
- [ ] Application mobile native
- [ ] Intégration vidéo
- [ ] API publique

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 📞 Contact et Support

- 📧 Email : support@eduafrica.com
- 🌐 Site web : https://eduafrica.com
- 💬 Discord : [Rejoindre la communauté](https://discord.gg/eduafrica)
- 🐛 Issues : [GitHub Issues](https://github.com/eduafrica/issues)

---

## 🙏 Remerciements

- Spring Boot Community
- Angular Team
- Contributeurs open source
- Testeurs et utilisateurs

---

<div align="center">

**Fait avec ❤️ pour l'Afrique**

⭐ Si vous aimez ce projet, n'hésitez pas à lui donner une étoile !

</div>
