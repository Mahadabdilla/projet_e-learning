# 🧪 Guide de Test des Fonctionnalités Implémentées

## 📅 Date : 2025-01-27

---

## ✅ **FONCTIONNALITÉS À TESTER**

### 1. **Système de Notation et Avis** ⭐

#### Test en tant qu'Apprenant :
1. **Prérequis** : 
   - Se connecter avec un compte APPRENANT
   - S'inscrire à une formation
   - Compléter la formation (progression à 100%)

2. **Tester la création d'avis** :
   - Aller sur la page de détail d'une formation complétée
   - Vérifier que le formulaire "Laisser un avis" apparaît
   - Donner une note (1-5 étoiles)
   - Ajouter un commentaire (optionnel)
   - Cliquer sur "Publier mon avis"
   - Vérifier que l'avis apparaît dans la liste

3. **Tester l'affichage des avis** :
   - Vérifier que tous les avis s'affichent avec :
     - Nom de l'apprenant
     - Note en étoiles
     - Commentaire
     - Date de publication
   - Vérifier que la note moyenne est affichée dans l'en-tête de la formation

4. **Tester la suppression d'avis** :
   - Vérifier que vous pouvez supprimer votre propre avis
   - Vérifier que vous ne pouvez pas supprimer les avis des autres

#### Test en tant que Formateur :
- Vérifier que les avis apparaissent sur vos formations
- Vérifier que la note moyenne est mise à jour automatiquement

---

### 2. **Système de Notifications** 🔔

#### Test des notifications automatiques :
1. **Notification d'inscription** :
   - S'inscrire à une formation (gratuite ou après paiement)
   - Vérifier qu'une notification apparaît dans la cloche (navbar)
   - Cliquer sur la notification pour voir les détails

2. **Notification de paiement** :
   - Acheter une formation payante
   - Compléter le paiement
   - Vérifier qu'une notification "Paiement complété" apparaît

3. **Notification de complétion de formation** :
   - Compléter une formation (100%)
   - Vérifier qu'une notification "Formation complétée" apparaît

4. **Notification de demande de mentorat** (en tant que Mentor) :
   - Se connecter avec un compte MENTOR
   - Demander à un apprenant de créer une demande de mentorat
   - Vérifier qu'une notification apparaît pour le mentor

5. **Test de l'interface de notifications** :
   - Cliquer sur l'icône de cloche dans la navbar
   - Vérifier que le dropdown s'ouvre
   - Vérifier le badge avec le nombre de notifications non lues
   - Marquer une notification comme lue
   - Marquer toutes les notifications comme lues
   - Supprimer une notification

---

### 3. **Upload et Gestion de Fichiers** 📤

#### Test en tant que Formateur :
1. **Upload d'image pour formation** :
   - Aller sur la page de création de formation
   - Dans la section "Image de la formation"
   - Glisser-déposer une image ou cliquer pour sélectionner
   - Vérifier que l'image s'upload correctement
   - Vérifier la barre de progression
   - Vérifier que l'image apparaît dans "Fichiers uploadés"
   - Créer la formation et vérifier que l'image est utilisée

2. **Test de validation** :
   - Essayer d'uploader un fichier trop volumineux (>5MB pour images)
   - Vérifier le message d'erreur
   - Essayer d'uploader un fichier non-image
   - Vérifier le message d'erreur

3. **Test de suppression** :
   - Supprimer un fichier uploadé
   - Vérifier qu'il disparaît de la liste

---

### 4. **Dashboard Mentor Complet** 🎯

#### Test en tant que Mentor :
1. **Accéder au dashboard** :
   - Se connecter avec un compte MENTOR
   - Aller sur le dashboard mentor

2. **Vérifier les statistiques** :
   - Nombre de mentees actifs
   - Demandes en attente
   - Séances complétées
   - Note moyenne
   - Revenus estimés
   - Total demandes

3. **Test de disponibilité** :
   - Cliquer sur "Se rendre disponible" / "Se rendre indisponible"
   - Vérifier que le statut change
   - Vérifier que cela affecte la visibilité dans la liste des mentors

4. **Gestion des demandes** :
   - Vérifier la liste des demandes en attente
   - Accepter une demande
   - Vérifier qu'elle passe dans "Acceptées"
   - Rejeter une demande
   - Marquer une séance comme complétée
   - Vérifier les différentes sections (En attente, Acceptées, Complétées)

---

### 5. **Dashboard Admin** ⚙️

#### Test en tant qu'Admin :
1. **Accéder au dashboard** :
   - Se connecter avec un compte ADMIN
   - Aller sur le dashboard admin

2. **Vérifier les statistiques globales** :
   - Total utilisateurs (par rôle)
   - Total formations (gratuites/payantes)
   - Total inscriptions
   - Paiements complétés
   - Mentors disponibles
   - Demandes de mentorat
   - Total avis

3. **Gestion des utilisateurs** :
   - Cliquer sur "Afficher la liste"
   - Vérifier que tous les utilisateurs s'affichent
   - Changer le rôle d'un utilisateur
   - Vérifier que le changement est effectif
   - Supprimer un utilisateur (attention : action irréversible)
   - Vérifier qu'il disparaît de la liste

---

## 🔍 **POINTS DE VÉRIFICATION IMPORTANTS**

### Backend :
- ✅ Toutes les API répondent correctement
- ✅ Les permissions sont respectées (rôles)
- ✅ Les validations fonctionnent
- ✅ Les notifications sont créées automatiquement

### Frontend :
- ✅ Les interfaces sont fonctionnelles
- ✅ Les erreurs sont gérées et affichées
- ✅ Les données se chargent correctement
- ✅ Les actions utilisateur fonctionnent (boutons, formulaires)

### Intégration :
- ✅ Les notifications apparaissent en temps réel (polling)
- ✅ Les avis mettent à jour la note moyenne
- ✅ Les fichiers uploadés sont accessibles
- ✅ Les statistiques sont calculées correctement

---

## 🐛 **PROBLÈMES POTENTIELS À SURVEILLER**

1. **Notifications** :
   - Vérifier que le polling fonctionne (rafraîchissement toutes les 30 secondes)
   - Vérifier que les notifications apparaissent après les actions

2. **Upload de fichiers** :
   - Vérifier que le répertoire `uploads/` est créé automatiquement
   - Vérifier que les fichiers sont accessibles via l'URL générée

3. **Dashboard Mentor** :
   - Vérifier que les statistiques sont correctes
   - Vérifier que les demandes s'affichent correctement

4. **Dashboard Admin** :
   - Vérifier que toutes les statistiques sont calculées
   - Vérifier que la gestion des utilisateurs fonctionne

---

## 📝 **COMPTES DE TEST RECOMMANDÉS**

Pour tester toutes les fonctionnalités, vous aurez besoin de :

1. **Compte APPRENANT** :
   - Pour tester les avis, notifications, upload (limité)

2. **Compte FORMATEUR** :
   - Pour tester l'upload de fichiers, création de formations

3. **Compte MENTOR** :
   - Pour tester le dashboard mentor, gestion des demandes

4. **Compte ADMIN** :
   - Pour tester le dashboard admin, gestion des utilisateurs

---

## 🚀 **DÉMARRAGE**

1. **Backend** : Déjà en cours d'exécution sur `http://localhost:8080`
2. **Frontend** : En cours de démarrage sur `http://localhost:4200`

Une fois le frontend démarré, accédez à `http://localhost:4200` dans votre navigateur.

---

**Bon test ! 🎉**



