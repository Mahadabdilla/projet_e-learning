# 🚀 Démarrage Complet - EduAfrica

**Date** : 2025-01-27

---

## ✅ État des Services

### PostgreSQL
- ✅ **Démarré** avec Docker
- ✅ **Port** : 5433
- ✅ **Statut** : Healthy
- ✅ **Base de données** : eduafrica

### Backend Spring Boot
- ✅ **Démarré** et accessible
- ✅ **Port** : 8080
- ✅ **URL** : http://localhost:8080
- ✅ **Swagger UI** : http://localhost:8080/swagger-ui.html
- ✅ **API Docs** : http://localhost:8080/api-docs

### Frontend Angular
- ⏳ **En cours de démarrage**
- ⏳ **Port** : 4200
- ⏳ **URL** : http://localhost:4200
- ⏳ **Temps estimé** : 30-60 secondes pour la compilation

---

## 📋 Commandes de Démarrage

### Démarrer PostgreSQL
```powershell
docker-compose up -d postgres
```

### Démarrer le Backend
```powershell
cd eduafrica-backend\eduafrica-backend
mvn spring-boot:run
```

### Démarrer le Frontend
```powershell
cd eduafrica-frontend\eduafrica-frontend
npm start
```

---

## 🔗 URLs d'Accès

Une fois tous les services démarrés :

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:4200 | Application Angular |
| **Backend API** | http://localhost:8080/api | API REST |
| **Swagger UI** | http://localhost:8080/swagger-ui.html | Documentation API interactive |
| **API Docs** | http://localhost:8080/api-docs | Documentation API JSON |

---

## 🧪 Comptes de Test

Ces comptes sont créés automatiquement au démarrage :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **Apprenant** | apprenant@eduafrica.com | password123 |
| **Formateur** | formateur@eduafrica.com | password123 |
| **Mentor** | mentor@eduafrica.com | password123 |
| **Admin** | admin@eduafrica.com | admin123 |

---

## 🧪 Tester l'Application

### 1. Tester le Backend

```powershell
# Test de base - Liste des formations
Invoke-WebRequest -Uri "http://localhost:8080/api/formations" -Method GET

# Test d'authentification
$loginBody = @{
    email = "apprenant@eduafrica.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody

$token = ($response.Content | ConvertFrom-Json).token
Write-Host "Token: $token"
```

### 2. Tester le Frontend

1. Ouvrez votre navigateur
2. Allez sur http://localhost:4200
3. Vous devriez voir la page d'accueil d'EduAfrica

---

## 🐛 Dépannage

### Le frontend ne démarre pas

1. **Vérifier Node.js** :
   ```powershell
   node --version  # Doit être 18+
   npm --version
   ```

2. **Réinstaller les dépendances** :
   ```powershell
   cd eduafrica-frontend\eduafrica-frontend
   rm -r node_modules
   npm install
   ```

3. **Vérifier les erreurs de compilation** :
   - Regardez la fenêtre PowerShell où `npm start` a été lancé
   - Cherchez les erreurs TypeScript ou de dépendances

4. **Port 4200 déjà utilisé** :
   ```powershell
   # Trouver le processus
   netstat -ano | findstr :4200
   
   # Ou utiliser un autre port
   ng serve --port 4201
   ```

### Le backend ne démarre pas

1. **Vérifier Java** :
   ```powershell
   java -version  # Doit être Java 17+
   ```

2. **Vérifier Maven** :
   ```powershell
   mvn -version
   ```

3. **Vérifier PostgreSQL** :
   ```powershell
   docker ps --filter "name=eduafrica-postgres"
   ```

4. **Voir les logs** :
   - Les logs s'affichent dans le terminal où vous avez lancé `mvn spring-boot:run`
   - Cherchez les erreurs de connexion à la base de données

---

## 📝 Scripts de Démarrage

J'ai créé des scripts pour faciliter le démarrage :

### Script PowerShell Backend
```powershell
.\start-backend.ps1
```

### Script PowerShell Frontend
```powershell
.\start-frontend.ps1
```

---

## ✅ Vérification Finale

Une fois tout démarré, vous devriez pouvoir :

1. ✅ Accéder au frontend : http://localhost:4200
2. ✅ Accéder au backend : http://localhost:8080
3. ✅ Voir Swagger UI : http://localhost:8080/swagger-ui.html
4. ✅ Se connecter avec un compte de test
5. ✅ Voir les formations sur le frontend

---

## 🎯 Prochaines Étapes

1. **Tester l'application** :
   - Se connecter avec un compte de test
   - Parcourir les formations
   - Tester les fonctionnalités

2. **Développer** :
   - Le frontend est accessible sur http://localhost:4200
   - Les modifications sont rechargées automatiquement (hot reload)
   - Le backend est accessible sur http://localhost:8080

3. **Documentation** :
   - Swagger UI pour tester l'API
   - Documentation dans les fichiers .md

---

**Dernière mise à jour** : 2025-01-27

