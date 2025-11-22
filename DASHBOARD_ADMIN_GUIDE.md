# 🎯 Guide du Dashboard Admin - EduAfrica

## 📋 Vue d'ensemble

Le dashboard admin est une console d'administration complète permettant de gérer tous les aspects de la plateforme EduAfrica.

## 🚀 Démarrage

### Backend
```bash
cd eduafrica-backend/eduafrica-backend
mvn spring-boot:run
```
Le backend démarre sur `http://localhost:8080`

### Frontend
```bash
cd eduafrica-frontend/eduafrica-frontend
npm start
```
Le frontend démarre sur `http://localhost:4200`

## 🔐 Connexion Admin

**Email:** `admin@eduafrica.com`  
**Mot de passe:** `admin123`

## 📍 Accès au Dashboard

URL: `http://localhost:4200/dashboard/admin`

## 🎨 Structure du Dashboard

### Layout avec Sidebar

Le dashboard utilise un layout avec sidebar collapsible contenant :
- 📊 Vue d'ensemble
- 👥 Utilisateurs
- 📚 Formations
- 🎯 Mentors & Formateurs

### 1. Vue d'ensemble (`/dashboard/admin`)

**Fonctionnalités :**
- Cartes de statistiques principales :
  - Total utilisateurs (avec taux de croissance)
  - Total formations (avec % gratuites)
  - Total inscriptions
  - Paiements complétés
- Graphiques et visualisations :
  - Répartition des rôles utilisateurs
  - Statistiques des formations
- Indicateurs rapides :
  - Mentors disponibles
  - Demandes de mentorat
  - Note moyenne

### 2. Gestion des Utilisateurs (`/dashboard/admin/users`)

**Fonctionnalités :**
- **Tableau paginé** avec :
  - Nom complet
  - Email
  - Rôle (avec badge coloré)
  - Pays
- **Recherche** : Par nom, email, pays
- **Filtres** : Par rôle (Apprenant, Formateur, Mentor, Admin)
- **Tri** : Par colonne (nom, email, rôle, pays)
- **Actions** :
  - Changer le rôle d'un utilisateur
  - Supprimer un utilisateur
- **Pagination** : 10 utilisateurs par page

### 3. Gestion des Formations (`/dashboard/admin/formations`)

**Fonctionnalités :**
- **Vue en grille** de toutes les formations
- **Informations affichées** :
  - Titre
  - Formateur
  - Catégorie
  - Niveau
  - Prix (gratuit/payant)
  - Nombre d'étudiants
  - Note moyenne
- **Actions** :
  - Voir la formation
  - Supprimer une formation

### 4. Gestion des Mentors & Formateurs (`/dashboard/admin/mentors`)

**Fonctionnalités :**
- **Onglets** : Mentors / Formateurs

**Mentors :**
- Liste des profils mentors
- Informations : Nom, spécialité, note, sessions, tarif
- Statut : Disponible/Indisponible
- Action : Activer/désactiver la disponibilité

**Formateurs :**
- Tableau des formateurs
- Informations : Nom, email, pays
- Action : Voir les formations du formateur

## 🔧 Endpoints Backend

### Statistiques
- `GET /api/admin/stats` - Statistiques globales

### Utilisateurs
- `GET /api/admin/users` - Liste tous les utilisateurs
- `PUT /api/admin/users/{id}/role?role=ROLE` - Changer le rôle
- `DELETE /api/admin/users/{id}` - Supprimer un utilisateur

### Formations
- `GET /api/admin/formations` - Liste toutes les formations
- `DELETE /api/admin/formations/{id}` - Supprimer une formation

### Paiements
- `GET /api/admin/payments` - Liste tous les paiements

### Avis
- `GET /api/admin/reviews` - Liste tous les avis
- `DELETE /api/admin/reviews/{id}` - Supprimer un avis

**Tous les endpoints sont protégés et nécessitent le rôle ADMIN.**

## 🎨 Design

Le dashboard utilise un design moderne avec :
- Sidebar sombre avec navigation
- Cartes de statistiques avec icônes
- Tableaux avec tri et filtres
- Modals pour les actions
- Responsive design

## 🔒 Sécurité

- Toutes les routes sont protégées par `authGuard` et `roleGuard`
- Seuls les utilisateurs avec le rôle `ADMIN` peuvent accéder
- Les endpoints backend vérifient également le rôle via `@PreAuthorize("hasRole('ADMIN')")`

## 📝 Notes

- Le panneau de debug peut être retiré en production
- Les graphiques peuvent être améliorés avec Chart.js ou une autre librairie
- La pagination côté backend peut être ajoutée pour de meilleures performances avec beaucoup d'utilisateurs

## 🐛 Dépannage

Si le dashboard est vide :
1. Vérifiez que vous êtes connecté avec le compte admin
2. Vérifiez que le backend est démarré
3. Ouvrez la console du navigateur (F12) pour voir les erreurs
4. Vérifiez le panneau de debug en haut du dashboard

## ✅ Fonctionnalités Implémentées

- ✅ Layout avec sidebar
- ✅ Vue d'ensemble avec statistiques
- ✅ Gestion complète des utilisateurs (recherche, filtres, tri, pagination)
- ✅ Gestion des formations
- ✅ Gestion des mentors et formateurs
- ✅ Changement de rôle utilisateur
- ✅ Suppression d'utilisateurs/formations/avis
- ✅ Interface moderne et responsive



