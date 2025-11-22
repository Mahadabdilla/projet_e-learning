# PWA (Progressive Web App) - EduAfrica

## Vue d'ensemble

Cette documentation décrit l'implémentation du mode PWA (Progressive Web App) pour EduAfrica, permettant l'utilisation hors-ligne et l'installation sur appareils mobiles.

## Fonctionnalités implémentées

### 1. Service Worker
- **Fichier**: `src/ngsw-config.json`
- **Fonctionnalités**:
  - Mise en cache des assets statiques (CSS, JS, images)
  - Mise en cache des données API avec stratégies différentes
  - Mise à jour automatique en arrière-plan
  - Support du mode hors-ligne

### 2. Manifest.json
- **Fichier**: `src/manifest.json`
- **Fonctionnalités**:
  - Métadonnées de l'application
  - Icônes pour différentes tailles d'écran
  - Raccourcis vers les sections principales
  - Configuration pour installation sur appareil

### 3. Service PWA
- **Fichier**: `src/app/core/services/pwa.service.ts`
- **Fonctionnalités**:
  - Détection des mises à jour
  - Gestion de l'invite d'installation
  - Détection du mode hors-ligne
  - Écoute des changements de statut réseau

### 4. Composants UI

#### OfflineBannerComponent
- Affiche une bannière en haut de l'écran quand l'app est hors-ligne
- Indique à l'utilisateur que certaines fonctionnalités peuvent être limitées

#### InstallPromptComponent
- Affiche une invite d'installation après 5 secondes
- Permet à l'utilisateur d'installer l'app sur son appareil
- Se souvient si l'utilisateur a refusé l'invite

## Configuration

### Angular.json
- Service Worker activé en mode production
- Configuration du service worker pointant vers `ngsw-config.json`
- Manifest.json ajouté aux assets

### App.config.ts
- Service Worker enregistré avec stratégie `registerWhenStable:30000`
- Désactivé en mode développement (activé uniquement en production)

### Index.html
- Lien vers le manifest.json
- Métadonnées pour iOS (Apple)
- Theme color configuré

## Stratégies de cache

### Assets statiques
- **Stratégie**: `prefetch` (installation immédiate)
- **Ressources**: CSS, JS, images, fonts

### Données API
- **Stratégie Freshness**: Pour les données dynamiques
  - Cache max: 100 requêtes
  - Durée: 1 heure
  - Timeout: 10 secondes
  
- **Stratégie Performance**: Pour les ressources statiques
  - Cache max: 50 requêtes
  - Durée: 1 jour
  - URLs: `/api/formations/**`, `/api/mentors/**`

## Installation

### Pour les développeurs

1. **Installer les dépendances**:
```bash
npm install
```

2. **Construire en mode production**:
```bash
npm run build
```

3. **Servir avec un serveur HTTP** (le service worker nécessite HTTPS en production):
```bash
npx http-server -p 8080 -c-1 dist/eduafrica-frontend
```

### Pour les utilisateurs

1. **Sur mobile (Android)**:
   - Ouvrir l'app dans Chrome
   - Menu → "Ajouter à l'écran d'accueil"

2. **Sur mobile (iOS)**:
   - Ouvrir l'app dans Safari
   - Partager → "Sur l'écran d'accueil"

3. **Sur desktop**:
   - Chrome/Edge affichera une invite d'installation
   - Cliquer sur l'icône d'installation dans la barre d'adresse

## Fonctionnalités hors-ligne

### Disponibles hors-ligne
- Navigation dans l'application
- Consultation des formations mises en cache
- Consultation des mentors mis en cache
- Affichage des pages statiques

### Limitées hors-ligne
- Envoi de messages (nécessite connexion)
- Paiements (nécessite connexion)
- Soumission de quiz (nécessite connexion)
- Mise à jour du profil (nécessite connexion)

## Mises à jour

Le service worker vérifie automatiquement les mises à jour :
- Toutes les 6 heures en arrière-plan
- Lors du rechargement de la page
- L'utilisateur est notifié quand une nouvelle version est disponible

## Icônes nécessaires

Pour une expérience complète, créer les icônes suivantes dans `src/assets/icons/`:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## Prochaines améliorations

1. **Cache plus intelligent**:
   - Mise en cache des vidéos pour lecture hors-ligne
   - Synchronisation des données lors du retour en ligne

2. **Notifications push**:
   - Notifications pour nouveaux messages
   - Rappels de formations
   - Notifications de nouveaux contenus

3. **Background sync**:
   - Synchronisation automatique des données en arrière-plan
   - Envoi différé des messages

4. **Share API**:
   - Partage natif des formations
   - Partage des certificats

## Tests

Pour tester le PWA :

1. **Mode développement**:
   - Le service worker est désactivé
   - Utiliser `ng serve` normalement

2. **Mode production**:
   - Construire avec `ng build`
   - Servir avec un serveur HTTP/HTTPS
   - Ouvrir dans le navigateur
   - Ouvrir DevTools → Application → Service Workers

3. **Test hors-ligne**:
   - Ouvrir DevTools → Network
   - Cocher "Offline"
   - L'app devrait continuer à fonctionner avec les données mises en cache

## Notes importantes

- Le service worker nécessite HTTPS en production (sauf localhost)
- Les mises à jour ne sont appliquées qu'après rechargement de la page
- Le cache peut être vidé via DevTools → Application → Clear storage
- Les données sensibles ne doivent pas être mises en cache


