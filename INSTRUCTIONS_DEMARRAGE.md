# 🚀 Instructions de Démarrage - EduAfrica

## ✅ État Actuel

### PostgreSQL
- ✅ **Démarré** avec Docker
- ✅ **Port** : 5433 (mappé depuis 5432)
- ✅ **Base de données** : eduafrica
- ✅ **Utilisateur** : eduafrica
- ✅ **Statut** : Healthy et prêt à accepter les connexions

### Spring Boot Backend
- ⏳ **En cours de démarrage** (processus Java détecté)
- ⏳ **Port** : 8080
- ⏳ **Temps estimé** : 30-60 secondes pour le premier démarrage

---

## 📋 Commandes Utiles

### Vérifier l'état de PostgreSQL

```powershell
# Vérifier le statut du conteneur
docker ps --filter "name=eduafrica-postgres"

# Voir les logs
docker logs eduafrica-postgres

# Vérifier la connexion
docker exec -it eduafrica-postgres psql -U eduafrica -d eduafrica
```

### Vérifier l'état du Backend

```powershell
# Vérifier si le port 8080 est actif
netstat -ano | findstr :8080

# Tester l'API
curl http://localhost:8080/api-docs

# Ou avec PowerShell
Invoke-WebRequest -Uri "http://localhost:8080/api-docs"
```

### Démarrer/Arrêter les Services

```powershell
# Démarrer PostgreSQL
docker-compose up -d postgres

# Arrêter PostgreSQL
docker-compose down

# Démarrer le backend (depuis eduafrica-backend/eduafrica-backend)
mvn spring-boot:run

# Arrêter le backend
# Appuyez sur Ctrl+C dans le terminal où il tourne
```

---

## 🔗 URLs d'Accès

Une fois le backend démarré :

- **Swagger UI** : http://localhost:8080/swagger-ui.html
- **API Docs JSON** : http://localhost:8080/api-docs
- **API Base URL** : http://localhost:8080/api

---

## 🧪 Tester l'API

### 1. Vérifier que l'API fonctionne

```powershell
# Test de base
Invoke-WebRequest -Uri "http://localhost:8080/api/formations" -Method GET
```

### 2. Tester l'authentification

```powershell
# Inscription
$body = @{
    firstName = "Test"
    lastName = "User"
    email = "test@eduafrica.com"
    phone = "+221771234567"
    country = "Senegal"
    password = "password123"
    role = "APPRENANT"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

# Connexion
$loginBody = @{
    email = "apprenant@eduafrica.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody

$token = ($response.Content | ConvertFrom-Json).token
```

### 3. Tester avec le token

```powershell
# Récupérer les formations (avec token)
Invoke-WebRequest -Uri "http://localhost:8080/api/formations" `
    -Method GET `
    -Headers @{ "Authorization" = "Bearer $token" }
```

---

## 🐛 Dépannage

### Le backend ne démarre pas

1. **Vérifier Java** :
   ```powershell
   java -version
   ```
   Doit être Java 17 ou supérieur

2. **Vérifier Maven** :
   ```powershell
   mvn -version
   ```

3. **Vérifier la connexion à PostgreSQL** :
   ```powershell
   docker exec -it eduafrica-postgres psql -U eduafrica -d eduafrica -c "SELECT 1;"
   ```

4. **Voir les logs du backend** :
   - Les logs s'affichent dans le terminal où vous avez lancé `mvn spring-boot:run`
   - Cherchez les erreurs de connexion à la base de données

### PostgreSQL ne démarre pas

1. **Vérifier Docker** :
   ```powershell
   docker ps
   ```

2. **Vérifier les logs** :
   ```powershell
   docker logs eduafrica-postgres
   ```

3. **Redémarrer** :
   ```powershell
   docker-compose down
   docker-compose up -d postgres
   ```

### Port 8080 déjà utilisé

Si le port 8080 est déjà utilisé par une autre application :

1. **Trouver le processus** :
   ```powershell
   netstat -ano | findstr :8080
   ```

2. **Arrêter le processus** ou modifier le port dans `application.properties` :
   ```properties
   server.port=8081
   ```

---

## 📝 Comptes de Test

Une fois le backend démarré, ces comptes sont automatiquement créés :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Apprenant | apprenant@eduafrica.com | password123 |
| Formateur | formateur@eduafrica.com | password123 |
| Mentor | mentor@eduafrica.com | password123 |
| Admin | admin@eduafrica.com | admin123 |

---

## ✅ Vérification Finale

Une fois tout démarré, vous devriez pouvoir :

1. ✅ Accéder à Swagger UI : http://localhost:8080/swagger-ui.html
2. ✅ Voir la documentation API
3. ✅ Tester les endpoints
4. ✅ Se connecter avec un compte de test

---

**Dernière mise à jour** : 2025-01-27

