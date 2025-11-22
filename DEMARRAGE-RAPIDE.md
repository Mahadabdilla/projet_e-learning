# 🚀 DÉMARRAGE RAPIDE - EduAfrica

## 📦 Fichiers fournis

Vous avez reçu les fichiers suivants :

1. **eduafrica-backend.tar.gz** - Archive complète du backend
2. **GUIDE-COMPLET-EDUAFRICA.md** - Guide complet du projet
3. **API-TESTS-COLLECTION.md** - Collection de tests API
4. **ARCHITECTURE-TECHNIQUE.md** - Documentation d'architecture
5. **CHECKLIST-PROGRESSION.md** - Checklist détaillée
6. **start-backend.sh** - Script de lancement
7. **Ce fichier (DEMARRAGE-RAPIDE.md)**

---

## ⚡ Lancer le projet en 5 minutes

### Étape 1 : Extraire l'archive
```bash
tar -xzf eduafrica-backend.tar.gz
cd eduafrica-backend
```

### Étape 2 : Créer la base de données
```bash
# Se connecter à PostgreSQL
psql -U postgres

# Dans psql, exécuter :
CREATE DATABASE eduafrica_db;
\q
```

### Étape 3 : Configurer l'application (optionnel)
Si besoin, modifiez `src/main/resources/application.properties` :
```properties
spring.datasource.username=votre_user
spring.datasource.password=votre_password
```

### Étape 4 : Lancer l'application
```bash
mvn spring-boot:run
```

**✅ C'est tout ! L'API est accessible sur http://localhost:8080**

---

## 🧪 Tester rapidement

### Option 1 : Avec curl

**Connexion Admin:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@eduafrica.com",
    "password": "admin123"
  }'
```

**Liste des formations:**
```bash
curl http://localhost:8080/api/formations?page=0&size=10
```

### Option 2 : Avec navigateur

Ouvrez dans votre navigateur :
```
http://localhost:8080/api/formations
```

---

## 📚 Ce qui fonctionne déjà

### ✅ Authentification
- Inscription (avec choix de rôle)
- Connexion (retourne un JWT)
- Récupération du profil utilisateur

### ✅ Formations
- Liste paginée des formations
- Recherche par mots-clés
- Filtrage par catégorie, niveau, gratuit/payant
- CRUD complet pour les formateurs
- Détails d'une formation

### ✅ Données de test
5 comptes créés automatiquement :
- **Admin** : admin@eduafrica.com / admin123
- **Formateur 1** : amadou.diallo@eduafrica.com / password123
- **Formateur 2** : fatou.sow@eduafrica.com / password123
- **Mentor** : moussa.ndiaye@eduafrica.com / password123
- **Apprenant** : aissatou.ba@gmail.com / password123

4 formations de test :
- Développement Web avec React et Node.js
- Intelligence Artificielle
- Marketing Digital
- Cybersécurité

---

## 🎯 Que faire maintenant ?

### Option A : Continuer le Backend (Recommandé)

**Implémenter les services manquants :**

1. **EnrollmentService** (inscriptions)
   ```java
   // Permettre aux apprenants de s'inscrire aux formations
   POST /api/apprenant/enrollments
   ```

2. **MentorService** (mentorat)
   ```java
   // Liste des mentors et demandes de mentorat
   GET /api/mentors
   POST /api/apprenant/mentoring-requests
   ```

3. **ContactService** (formulaire de contact)
   ```java
   POST /api/contact
   ```

4. **DashboardService** (statistiques)
   ```java
   GET /api/apprenant/dashboard
   GET /api/formateur/dashboard
   ```

**Temps estimé : 2-3 jours**

### Option B : Commencer le Frontend Angular

**Créer le projet Angular :**
```bash
ng new eduafrica-frontend
cd eduafrica-frontend

# Installer Tailwind (optionnel)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

**Créer les services de base :**
```typescript
ng generate service core/services/auth
ng generate service core/services/formation
ng generate service core/services/enrollment
```

**Créer les pages :**
```typescript
ng generate component features/home
ng generate component features/formations
ng generate component features/auth/login
ng generate component features/auth/register
```

**Temps estimé : 1 semaine pour les bases**

---

## 📖 Documentation utile

### Pour le Backend
1. Consultez **GUIDE-COMPLET-EDUAFRICA.md** pour la vue d'ensemble
2. Utilisez **API-TESTS-COLLECTION.md** pour tester les endpoints
3. Référez-vous à **ARCHITECTURE-TECHNIQUE.md** pour comprendre l'architecture

### Pour le Frontend (à venir)
1. Angular 17 Documentation : https://angular.io/docs
2. Tailwind CSS : https://tailwindcss.com/docs
3. Angular Material : https://material.angular.io/

---

## 🐛 Problèmes courants

### "Port 8080 déjà utilisé"
```bash
# Linux/Mac
lsof -i :8080
kill -9 <PID>

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### "Cannot connect to database"
```bash
# Vérifier que PostgreSQL est démarré
sudo service postgresql status
sudo service postgresql start
```

### "JWT token expired"
```bash
# Se reconnecter pour obtenir un nouveau token
curl -X POST http://localhost:8080/api/auth/login ...
```

---

## 📞 Prochaines actions recommandées

### Priorité 1 : Compléter le Backend (1-2 semaines)
- [ ] Implémenter EnrollmentService + Controller
- [ ] Implémenter MentorService + Controller
- [ ] Implémenter ContactService + Controller
- [ ] Implémenter DashboardService + Controller
- [ ] Tests des nouveaux endpoints

### Priorité 2 : Initialiser le Frontend (1 semaine)
- [ ] Créer projet Angular 17
- [ ] Configurer Tailwind ou Angular Material
- [ ] Créer la structure de base (modules, services, guards)
- [ ] Créer les pages publiques (home, formations, mentors)

### Priorité 3 : Intégration (1-2 semaines)
- [ ] Connecter le frontend au backend
- [ ] Implémenter l'authentification côté Angular
- [ ] Créer les dashboards par rôle
- [ ] Tests end-to-end

---

## 💡 Conseils

1. **Backend d'abord** : Complétez tous les endpoints backend avant d'attaquer le frontend
2. **Testez au fur et à mesure** : Utilisez Postman pour tester chaque endpoint
3. **Commitez régulièrement** : Faites des commits à chaque fonctionnalité complétée
4. **Documentez** : Ajoutez des commentaires dans le code
5. **Restez simple** : Implémentez le MVP d'abord, les features avancées après

---

## 🎓 Ressources supplémentaires

### Backend Java/Spring
- Spring Boot Docs : https://spring.io/projects/spring-boot
- Spring Security : https://spring.io/projects/spring-security
- Baeldung (Tutoriels) : https://www.baeldung.com/

### Frontend Angular
- Angular.io : https://angular.io/
- RxJS : https://rxjs.dev/
- Angular HTTP : https://angular.io/guide/http

### Design
- Tailwind CSS : https://tailwindcss.com/
- Material Design : https://material.io/design
- Dribbble (Inspiration) : https://dribbble.com/

---

## ✅ Checklist rapide

- [ ] Backend extrait et lancé
- [ ] Base de données créée
- [ ] Testé la connexion avec un compte de test
- [ ] Testé la liste des formations
- [ ] Lu la documentation complète
- [ ] Compris l'architecture
- [ ] Prêt à continuer le développement

---

## 🎉 Félicitations !

Vous avez maintenant une base solide pour développer EduAfrica. Le backend est fonctionnel, sécurisé et bien structuré.

**Prochaine étape recommandée :**
Complétez les services backend restants (Enrollment, Mentor, Dashboard) pour avoir une API 100% opérationnelle.

**Temps estimé pour le MVP complet : 8-12 semaines**

Bon courage ! 🚀

---

**Questions ? Besoin d'aide ?**
- Consultez d'abord la documentation fournie
- Vérifiez les logs du backend
- Testez les endpoints un par un
- Utilisez Postman pour débugger

**Version :** 1.0  
**Dernière mise à jour :** 2025  
**Auteur :** Équipe EduAfrica
