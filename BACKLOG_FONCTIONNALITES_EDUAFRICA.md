# 📋 Backlog des Fonctionnalités - EduAfrica

## 📅 Date d'analyse : 2025-11-20

---

## 🎯 **VUE D'ENSEMBLE**

Ce document présente le backlog complet des fonctionnalités organisé par rôles utilisateurs, basé sur les user stories (US) identifiées. Chaque fonctionnalité est classée selon son statut d'implémentation.

**Légende des statuts :**
- ✅ **Implémenté** : Fonctionnalité complète et opérationnelle
- 🟡 **Partiellement implémenté** : Fonctionnalité en cours ou incomplète
- ❌ **Non implémenté** : Fonctionnalité à développer
- 🔄 **À améliorer** : Fonctionnalité existante nécessitant des améliorations

---

## 👤 **ROLE : INTERNAUTE / VISITEUR**

### US-1 : Page d'inscription (Création de compte)
**Statut :** ✅ **Implémenté** (avec améliorations récentes)

**En tant que :** Internaute  
**Je veux :** Créer un compte sur la plateforme  
**Afin de :** Accéder aux formations et suivre des cours

**Critère d'acceptation :**
- ✅ Étant donné que l'utilisateur est sur la page de connexion
- ✅ Lorsqu'il clique sur "Créer un compte", alors il est redirigé vers un formulaire
- ✅ Lorsqu'il remplit les champs (nom, email, mot de passe) et valide
- ✅ Alors le système crée le compte et affiche la page d'accueil avec les cours disponibles

**Implémentation actuelle :**
- ✅ Formulaire d'inscription complet
- ✅ Validation côté client et serveur
- ✅ Gestion d'erreurs améliorée (GlobalExceptionHandler)
- ✅ Support des rôles (APPRENANT, FORMATEUR, MENTOR)
- ✅ Redirection vers le dashboard approprié selon le rôle

**Améliorations possibles :**
- 🔄 Vérification d'email par confirmation
- 🔄 Captcha pour prévenir les bots

---

## 👨‍🎓 **ROLE : APPRENANT**

### US-3 : Dashboard utilisateur
**Statut :** ✅ **Implémenté** (design moderne conforme aux spécifications)

**En tant que :** Apprenant  
**Je veux :** Consulter mon tableau de bord  
**Afin de :** Suivre ma progression et accéder facilement

**Critère d'acceptation :**
- ✅ Lorsqu'un utilisateur connecté clique sur "Mon compte"
- ✅ Alors il accède à son tableau de bord listant :
  - ✅ Les cours en cours
  - ✅ Leur statut
  - ✅ Les certificats obtenus (structure prête)
  - ✅ Statistiques (cours inscrits, certificats, série d'étude, temps total)
  - ✅ Objectif quotidien
  - ✅ Mentor assigné

**Implémentation actuelle :**
- ✅ Dashboard moderne avec design conforme aux spécifications
- ✅ 4 cartes de statistiques (Cours inscrits, Certificats, Série d'étude, Temps total)
- ✅ Section "Mes cours en cours" avec progression
- ✅ Section "Mon mentor" (structure prête)
- ✅ Section "Objectif quotidien" avec barre de progression

**À compléter :**
- ❌ Calcul réel de la série d'étude
- ❌ Calcul du temps total d'étude
- ❌ Intégration API pour le mentor
- ❌ Génération de certificats

---

### US-4 : Accès formations (Recherche et inscription)
**Statut :** ✅ **Implémenté**

**En tant que :** Apprenant  
**Je veux :** Rechercher et m'inscrire à une formation  
**Afin de :** Apprendre une nouvelle compétence

**Critère d'acceptation :**
- ✅ Lorsqu'un apprenant est connecté
- ✅ Il peut parcourir le catalogue
- ✅ Cliquer sur un cours
- ✅ Lire sa description
- ✅ Cliquer sur "S'inscrire"

**Implémentation actuelle :**
- ✅ Page de liste des formations avec pagination
- ✅ Page de détail d'une formation
- ✅ Affichage des modules et leçons
- ✅ Bouton d'inscription (à connecter à l'API)

**À compléter :**
- 🟡 Intégration complète du service d'inscription
- ❌ Recherche avancée avec filtres
- ❌ Système de favoris

---

### US-5 : Suivi de cours (Accès aux contenus)
**Statut :** 🟡 **Partiellement implémenté**

**En tant que :** Apprenant  
**Je veux :** Accéder aux vidéos et quiz d'un module  
**Afin de :** Apprendre à mon rythme

**Critère d'acceptation :**
- ✅ Lorsqu'un module est ouvert
- ✅ L'utilisateur voit les vidéos
- ✅ L'utilisateur voit les ressources PDF
- ✅ Un quiz à la fin
- ❌ Suivi de progression par leçon
- ❌ Marquage des leçons comme complétées

**Implémentation actuelle :**
- ✅ Structure Module/Lesson créée
- ✅ Affichage des modules et leçons dans le détail de formation
- ✅ Support des types de leçons (VIDEO, TEXT, QUIZ, EXERCISE, DOWNLOAD)
- ❌ Lecteur vidéo intégré
- ❌ Affichage des quiz interactifs
- ❌ Téléchargement des ressources PDF
- ❌ Suivi de progression détaillé

**À développer :**
- ❌ Composant lecteur vidéo
- ❌ Composant quiz interactif
- ❌ Système de suivi de progression par leçon
- ❌ Marquage automatique des leçons complétées

---

### US-6 : Mode hors-ligne (PWA)
**Statut :** ❌ **Non implémenté**

**En tant que :** Apprenant  
**Je veux :** Télécharger les modules  
**Afin de :** Pouvoir étudier sans connexion Internet

**Critère d'acceptation :**
- ❌ Sur la fiche d'un cours, l'utilisateur peut cliquer sur "Télécharger"
- ❌ Pour récupérer vidéos et ressources hors-ligne
- ❌ L'application fonctionne en mode hors-ligne

**À développer :**
- ❌ Configuration PWA (Service Worker, Manifest)
- ❌ Système de cache pour les vidéos
- ❌ Téléchargement des ressources
- ❌ Synchronisation automatique lors de la reconnexion

---

### US-7 : Certification
**Statut :** 🟡 **Partiellement implémenté** (structure prête)

**En tant que :** Apprenant  
**Je veux :** Obtenir un certificat à la fin d'un cours  
**Afin de :** Valoriser mes compétences auprès d'employeurs

**Critère d'acceptation :**
- ❌ Lorsqu'un cours est terminé (100% de progression)
- ❌ Le système génère un certificat PDF personnalisé automatiquement
- ❌ Le certificat contient : nom, cours, date, signature

**Implémentation actuelle :**
- ✅ Entité `Certificate` dans le backend
- ✅ Repository et structure prête
- ✅ Affichage dans le dashboard (structure)
- ❌ Génération PDF
- ❌ Logique de vérification de complétion
- ❌ Template de certificat

**À développer :**
- ❌ Service de génération PDF (iText ou Apache PDFBox)
- ❌ Template de certificat personnalisé
- ❌ Vérification automatique de complétion
- ❌ Téléchargement du certificat

---

### US-8 : Système de mentorat (Demande de mentor)
**Statut :** 🟡 **Partiellement implémenté** (structure prête)

**En tant que :** Apprenant  
**Je veux :** Demander un mentor  
**Afin de :** Être accompagné dans ma progression

**Critère d'acceptation :**
- ❌ Lorsqu'un apprenant clique sur "Demander un mentor"
- ❌ Le système l'associe à un mentor disponible automatiquement
- ❌ Notification au mentor

**Implémentation actuelle :**
- ✅ Entité `MentoringRequest` dans le backend
- ✅ Entité `MentorProfile` avec disponibilité
- ✅ Repository prêt
- ✅ Affichage dans le dashboard (structure)
- ❌ Interface de demande
- ❌ Algorithme d'association automatique
- ❌ Notifications

**À développer :**
- ❌ Formulaire de demande de mentor
- ❌ Service d'association automatique (basé sur spécialité, disponibilité)
- ❌ Système de notifications
- ❌ Interface de gestion des demandes

---

### US-12 : Paiement Mobile
**Statut :** ❌ **Non implémenté**

**En tant que :** Apprenant  
**Je veux :** Payer une formation via Orange Money ou Wave  
**Afin de :** Accéder à des contenus premium ou certifiant

**Critère d'acceptation :**
- ❌ Le système propose plusieurs méthodes de paiement locales
- ❌ Enregistre la transaction
- ❌ Valide le paiement
- ❌ Débloque l'accès au contenu

**À développer :**
- ❌ Intégration API Orange Money
- ❌ Intégration API Wave
- ❌ Entité `Payment` et `Transaction`
- ❌ Service de gestion des paiements
- ❌ Webhook pour validation des paiements
- ❌ Interface de paiement

---

### US-14 : Feedback Cours (Évaluation)
**Statut :** ❌ **Non implémenté**

**En tant que :** Apprenant  
**Je veux :** Laisser une évaluation sur un cours terminé  
**Afin de :** Aider les autres à choisir et améliorer les contenus

**Critère d'acceptation :**
- ❌ À la fin d'un cours, un formulaire de notation (étoiles, commentaire) est proposé
- ❌ Les notes sont visibles publiquement
- ❌ Calcul de la note moyenne

**À développer :**
- ❌ Entité `Review` ou `Rating`
- ❌ Formulaire d'évaluation
- ❌ Affichage des avis sur la page de formation
- ❌ Calcul automatique de la note moyenne
- ❌ Modération des commentaires (optionnel)

---

## 👨‍🏫 **ROLE : FORMATEUR**

### US-10 : Gestion des cours (Création)
**Statut :** ✅ **Implémenté** (partiellement)

**En tant que :** Formateur  
**Je veux :** Créer une formation complète  
**Afin de :** Mettre à disposition des modules utiles

**Critère d'acceptation :**
- ✅ Un formulaire permet de créer un cours avec :
  - ✅ Titre
  - ✅ Description
  - ✅ Catégorie, niveau, prix
  - ✅ Modules et leçons
  - 🟡 Vidéo (structure prête, upload à implémenter)
  - 🟡 Fichier (structure prête, upload à implémenter)
  - ❌ Quiz (structure prête, interface à créer)
  - ✅ Description

**Implémentation actuelle :**
- ✅ Dashboard formateur fonctionnel
- ✅ Création de formations via API
- ✅ Création de modules et leçons
- ✅ Gestion complète du contenu
- ✅ Affichage des statistiques

**À compléter :**
- ❌ Interface de création/édition de formation (formulaire complet)
- ❌ Upload de vidéos (stockage cloud ou local)
- ❌ Upload de fichiers PDF
- ❌ Créateur de quiz interactif
- ❌ Éditeur de contenu riche

---

### US-15 : Modification des formations
**Statut :** 🟡 **Partiellement implémenté**

**En tant que :** Formateur  
**Je veux :** Modifier mes formations publiées  
**Afin de :** Mettre à jour ou corriger les contenus si nécessaire

**Critère d'acceptation :**
- ✅ Le formateur peut accéder à la liste de ses cours publiés
- ✅ Cliquer sur "Modifier"
- ✅ Changer les vidéos
- ✅ Changer les quiz
- ✅ Modifier les descriptions

**Implémentation actuelle :**
- ✅ API de mise à jour de formation
- ✅ API de mise à jour de modules et leçons
- ✅ Bouton "Modifier" dans le dashboard
- ❌ Interface d'édition complète

**À compléter :**
- ❌ Formulaire d'édition de formation
- ❌ Gestion des versions (historique des modifications)
- ❌ Notification aux apprenants des mises à jour

---

### US-16 : Suivi des apprenants
**Statut :** ❌ **Non implémenté**

**En tant que :** Formateur  
**Je veux :** Consulter les performances des apprenants à mes cours  
**Afin de :** Analyser les taux de complétion, quiz réussis et autres métriques

**Critère d'acceptation :**
- ❌ Le formateur accède à un tableau de bord montrant pour chaque cours :
  - ❌ Nombre d'inscrits
  - ❌ % moyen de complétion
  - ❌ Notes moyennes aux quiz
  - ❌ Temps moyen passé
  - ❌ Liste des apprenants avec leurs progressions

**À développer :**
- ❌ Dashboard analytique pour formateur
- ❌ Service de calcul des statistiques
- ❌ Graphiques de progression
- ❌ Export des données (CSV, Excel)
- ❌ Filtres et recherches

---

## 🎯 **ROLE : MENTOR**

### US-2 : Inscription en tant que mentor
**Statut :** ✅ **Implémenté** (structure de base)

**En tant que :** Internaute  
**Je veux :** Créer un compte en tant que mentor  
**Afin de :** Pouvoir accompagner des apprenants

**Critère d'acceptation :**
- ✅ Le mentor est sur la page de connexion
- ✅ Clique sur "Créer un compte"
- ✅ Est redirigé vers un formulaire
- ✅ En saisissant ses infos, il peut finaliser son profil mentor
- 🟡 Accéder à l'interface de suivi des demandes

**Implémentation actuelle :**
- ✅ Inscription avec rôle MENTOR
- ✅ Entité `MentorProfile` avec spécialité, bio, tarif horaire
- ✅ Repository et structure prête
- ❌ Interface de finalisation du profil mentor
- ❌ Dashboard mentor complet

**À compléter :**
- ❌ Formulaire de création de profil mentor
- ❌ Upload de photo de profil
- ❌ Validation du profil par admin (optionnel)

---

### US-9 : Messagerie mentor/apprenant
**Statut :** ❌ **Non implémenté**

**En tant que :** Mentor  
**Je veux :** Échanger avec mes mentorés  
**Afin de :** Répondre à leurs questions et les guider

**Critère d'acceptation :**
- ❌ L'interface de chat permet des messages privés
- ❌ Entre mentor et apprenant attribué
- ❌ Notifications en temps réel
- ❌ Historique des conversations

**À développer :**
- ❌ Entité `Message` et `Conversation`
- ❌ Service de messagerie
- ❌ Interface de chat en temps réel (WebSocket)
- ❌ Notifications push
- ❌ Gestion des fichiers partagés

---

### US-13 : Suivi analytique (Stats des mentorés)
**Statut :** ❌ **Non implémenté**

**En tant que :** Mentor  
**Je veux :** Consulter les stats de progression de mes mentorés  
**Afin de :** Adapter mon accompagnement à leurs besoins

**Critère d'acceptation :**
- ❌ Le mentor peut accéder à un tableau avec :
  - ❌ % modules terminés
  - ❌ Notes aux quiz
  - ❌ Connexion récente
  - ❌ Temps d'étude
  - ❌ Cours en cours

**À développer :**
- ❌ Dashboard mentor avec statistiques
- ❌ Service de calcul des stats par mentoré
- ❌ Graphiques de progression
- ❌ Alertes sur les difficultés détectées

---

## 👨‍💼 **ROLE : ADMIN**

### US-11 : Gestion utilisateur
**Statut :** ❌ **Non implémenté**

**En tant que :** Admin  
**Je veux :** Gérer les comptes et les contenus  
**Afin de :** Superviser la plateforme et garantir sa qualité

**Critère d'acceptation :**
- ❌ L'admin peut activer/désactiver des comptes
- ❌ Supprimer des cours
- ❌ Consulter des stats
- ❌ Modérer les contenus

**À développer :**
- ❌ Dashboard admin complet
- ❌ Interface de gestion des utilisateurs
- ❌ Activation/désactivation de comptes
- ❌ Interface de modération des cours
- ❌ Statistiques globales de la plateforme
- ❌ Gestion des rôles et permissions

---

## 📊 **RÉCAPITULATIF PAR STATUT**

### ✅ Implémenté (7 fonctionnalités)
- US-1 : Page d'inscription
- US-3 : Dashboard utilisateur
- US-4 : Accès formations
- US-10 : Gestion des cours (création)
- US-15 : Modification des formations (API)

### 🟡 Partiellement implémenté (5 fonctionnalités)
- US-5 : Suivi de cours (structure prête, interface à compléter)
- US-7 : Certification (structure prête, génération PDF à faire)
- US-8 : Système de mentorat (structure prête, interface à créer)
- US-2 : Inscription mentor (base prête, profil à finaliser)
- US-10 : Gestion des cours (upload vidéo/fichier à implémenter)

### ❌ Non implémenté (8 fonctionnalités)
- US-6 : Mode hors-ligne (PWA)
- US-12 : Paiement Mobile
- US-14 : Feedback Cours
- US-9 : Messagerie mentor/apprenant
- US-13 : Suivi analytique mentor
- US-16 : Suivi des apprenants (formateur)
- US-11 : Gestion utilisateur (admin)

---

## 🎯 **PRIORISATION RECOMMANDÉE**

### 🔴 Priorité 1 - MVP Complet (Fonctionnalités critiques)
1. **US-5** : Compléter le suivi de cours (lecteur vidéo, quiz)
2. **US-7** : Génération de certificats PDF
3. **US-12** : Paiement Mobile (Orange Money/Wave)
4. **US-10** : Interface complète de création de formation
5. **US-11** : Dashboard admin de base

### 🟡 Priorité 2 - Expérience utilisateur améliorée
6. **US-14** : Système de notation et avis
7. **US-8** : Interface de demande de mentor
8. **US-9** : Messagerie mentor/apprenant
9. **US-16** : Suivi des apprenants pour formateur

### 🟢 Priorité 3 - Fonctionnalités avancées
10. **US-13** : Suivi analytique mentor
11. **US-6** : Mode hors-ligne (PWA)
12. **US-15** : Amélioration de l'édition de formations

---

## 📝 **NOTES IMPORTANTES**

1. **Architecture actuelle** : Le backend est bien structuré avec les entités nécessaires. Il faut principalement développer les interfaces frontend et compléter les services.

2. **Intégrations externes** : 
   - Paiement Mobile nécessite des clés API Orange Money et Wave
   - PWA nécessite une configuration spécifique Angular

3. **Sécurité** : 
   - Toutes les fonctionnalités doivent respecter les permissions par rôle
   - Validation des données côté client et serveur

4. **Performance** :
   - Optimisation des requêtes pour les statistiques
   - Cache pour les données fréquemment consultées

---

**Dernière mise à jour** : 2025-11-20  
**Version** : 1.0




