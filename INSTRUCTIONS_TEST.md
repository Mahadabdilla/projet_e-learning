# 🧪 Instructions de Test - Fonctionnalités Implémentées

## 🚀 **DÉMARRAGE**

### 1. Vérifier PostgreSQL
```bash
docker ps
```
Si PostgreSQL n'est pas démarré :
```bash
docker-compose up -d
```

### 2. Backend
Le backend devrait être en cours d'exécution sur `http://localhost:8080`

Si besoin de redémarrer :
```bash
cd eduafrica-backend/eduafrica-backend
mvn spring-boot:run
```

### 3. Frontend
Le frontend devrait être en cours de démarrage sur `http://localhost:4200`

Si besoin de redémarrer :
```bash
cd eduafrica-frontend/eduafrica-frontend
npm start
```

---

## 🔐 **CONNEXION**

1. Ouvrir `http://localhost:4200` dans votre navigateur
2. Cliquer sur "Se connecter"
3. Utiliser un des comptes suivants :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Apprenant | `apprenant@eduafrica.com` | `password123` |
| Formateur | `formateur@eduafrica.com` | `password123` |
| Mentor | `mentor@eduafrica.com` | `password123` |
| Admin | `admin@eduafrica.com` | `admin123` |

---

## ✅ **FONCTIONNALITÉS À TESTER**

### 1. ⭐ **Système de Notation et Avis**

**Test rapide** :
1. Se connecter en tant qu'**Apprenant**
2. Aller sur une formation : `http://localhost:4200/formations/{id}`
3. **Prérequis** : Avoir complété la formation (100%)
4. Scroller en bas de la page
5. Voir le formulaire "Laisser un avis"
6. Donner une note (1-5 étoiles) et un commentaire
7. Cliquer sur "Publier mon avis"
8. Vérifier que l'avis apparaît dans la liste
9. Vérifier que la note moyenne est affichée en haut de la page

---

### 2. 🔔 **Système de Notifications**

**Test rapide** :
1. Se connecter en tant qu'**Apprenant**
2. Regarder l'icône de cloche 🔔 en haut à droite (navbar)
3. Vérifier le badge rouge avec le nombre de notifications non lues
4. Cliquer sur la cloche
5. Voir le dropdown avec les notifications
6. Cliquer sur une notification pour la marquer comme lue
7. Cliquer sur "Tout marquer comme lu"
8. Tester les notifications automatiques :
   - S'inscrire à une formation → Notification "Inscription réussie"
   - Compléter un paiement → Notification "Paiement complété"
   - Compléter une formation → Notification "Formation complétée"

---

### 3. 📤 **Upload de Fichiers**

**Test rapide** :
1. Se connecter en tant que **Formateur**
2. Aller sur : `http://localhost:4200/formateur/formations/create`
3. Scroller jusqu'à "Image de la formation"
4. **Option 1** : Glisser-déposer une image dans la zone
5. **Option 2** : Cliquer sur la zone et sélectionner un fichier
6. Vérifier la barre de progression
7. Vérifier que l'image apparaît dans "Fichiers uploadés"
8. Vérifier le bouton "👁️ Voir" pour prévisualiser
9. Compléter le formulaire et créer la formation
10. Vérifier que l'image est utilisée dans la formation

---

### 4. 🎯 **Dashboard Mentor**

**Test rapide** :
1. Se connecter en tant que **Mentor**
2. Aller sur : `http://localhost:4200/dashboard/mentor`
3. Vérifier les 6 cartes de statistiques :
   - Mentees actifs
   - Demandes en attente
   - Séances complétées
   - Note moyenne
   - Revenus estimés
   - Total demandes
4. Tester le toggle de disponibilité :
   - Cliquer sur "Se rendre disponible" / "Se rendre indisponible"
   - Vérifier que le statut change
5. Gérer les demandes :
   - Voir les demandes en attente
   - Accepter une demande → Vérifier qu'elle passe dans "Acceptées"
   - Rejeter une demande
   - Marquer une séance comme complétée

---

### 5. ⚙️ **Dashboard Admin**

**Test rapide** :
1. Se connecter en tant qu'**Admin**
2. Aller sur : `http://localhost:4200/dashboard/admin`
3. Vérifier les 12 cartes de statistiques :
   - Total utilisateurs
   - Apprenants, Formateurs, Mentors
   - Total formations (gratuites/payantes)
   - Total inscriptions
   - Paiements complétés
   - Mentors disponibles
   - Demandes de mentorat
   - Total avis
4. Gestion des utilisateurs :
   - Cliquer sur "Afficher la liste"
   - Vérifier que tous les utilisateurs s'affichent dans un tableau
   - Cliquer sur "Changer rôle" pour un utilisateur
   - Sélectionner un nouveau rôle
   - Confirmer → Vérifier que le rôle change
   - Tester la suppression d'un utilisateur (attention : irréversible)

---

## 🐛 **EN CAS DE PROBLÈME**

### Backend ne démarre pas :
- Vérifier que PostgreSQL est démarré : `docker ps`
- Vérifier que le port 8080 est libre
- Vérifier les logs : `mvn spring-boot:run`

### Frontend ne démarre pas :
- Vérifier que le port 4200 est libre
- Vérifier que Node.js est installé : `node --version`
- Réinstaller les dépendances : `npm install`

### Erreurs CORS :
- Vérifier que le backend est bien sur le port 8080
- Vérifier la configuration CORS dans `CorsConfig.java`

### Notifications ne s'affichent pas :
- Attendre 30 secondes (polling automatique)
- Vérifier la console du navigateur pour les erreurs
- Vérifier que vous êtes bien connecté

### Upload ne fonctionne pas :
- Vérifier que le répertoire `uploads/` existe (créé automatiquement)
- Vérifier la taille du fichier (< 5MB pour images)
- Vérifier le type de fichier (images uniquement)

---

## 📊 **ÉTAT DES FONCTIONNALITÉS**

| Fonctionnalité | Backend | Frontend | Statut |
|----------------|---------|----------|--------|
| Notation et Avis | ✅ | ✅ | **Complet** |
| Notifications | ✅ | ✅ | **Complet** |
| Upload Fichiers | ✅ | ✅ | **Complet** |
| Dashboard Mentor | ✅ | ✅ | **Complet** |
| Dashboard Admin | ✅ | ✅ | **Complet** |

---

**Tout est prêt pour les tests ! 🎉**



