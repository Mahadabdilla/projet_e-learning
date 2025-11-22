# 🚀 Guide de Démarrage - EduAfrica

## ⚠️ Erreur HTTP 0 - Solution

L'erreur **"Http failure response for http://localhost:8080/api/auth/register: 0 Unknown Error"** signifie que le **backend n'est pas accessible**.

## ✅ Étapes pour Résoudre

### 1. Démarrer PostgreSQL (si pas déjà démarré)

```powershell
docker ps
```

Si PostgreSQL n'est pas dans la liste :
```powershell
docker-compose up -d
```

### 2. Démarrer le Backend

**Ouvrir un terminal PowerShell et exécuter :**

```powershell
cd "C:\Users\hp\Downloads\files (5)\eduafrica-backend\eduafrica-backend"
mvn spring-boot:run
```

**⚠️ IMPORTANT :** Attendre que le backend démarre complètement. Vous verrez dans les logs :
- `Started EduafricaApplication` (quand le serveur est prêt)
- `🔧 Création du compte administrateur...` (au premier démarrage)
- `✅ Compte admin créé avec succès`

**⏱️ Temps d'attente :** 30-60 secondes

### 3. Vérifier que le Backend est Accessible

**Dans un nouveau terminal PowerShell :**

```powershell
netstat -ano | findstr ":8080"
```

Vous devriez voir une ligne avec `LISTENING` sur le port 8080.

### 4. Démarrer le Frontend (dans un autre terminal)

```powershell
cd "C:\Users\hp\Downloads\files (5)\eduafrica-frontend\eduafrica-frontend"
ng serve
```

### 5. Tester l'Application

1. Aller sur `http://localhost:4200/register`
2. Remplir le formulaire d'inscription
3. **Ouvrir la console du navigateur (F12)** pour voir les logs :
   - `📡 Envoi de la requête d'inscription à: ...`
   - `✅ Inscription réussie: ...` (en cas de succès)
   - `❌ Erreur lors de l'inscription: ...` (en cas d'erreur)

## 🔍 Messages d'Erreur Améliorés

Le frontend affiche maintenant des messages plus clairs :

- **HTTP 0** : "⚠️ Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur http://localhost:8080"
- **HTTP 400** : "Les données fournies sont invalides. Vérifiez tous les champs."
- **HTTP 409** : "Cet email est déjà utilisé."
- **HTTP 500** : "Erreur serveur. Veuillez réessayer plus tard."

## 📝 Comptes de Test

### Compte Admin
- **Email:** `admin@eduafrica.com`
- **Mot de passe:** `admin123`
- **Rôle:** `ADMIN`

### Compte Apprenant
- **Email:** `apprenant@eduafrica.com`
- **Mot de passe:** `password123`
- **Rôle:** `APPRENANT`

### Compte Formateur
- **Email:** `formateur@eduafrica.com`
- **Mot de passe:** `password123`
- **Rôle:** `FORMATEUR`

### Compte Mentor
- **Email:** `mentor@eduafrica.com`
- **Mot de passe:** `password123`
- **Rôle:** `MENTOR`

## 🚨 Si le Problème Persiste

1. **Vérifier que le port 8080 n'est pas utilisé :**
   ```powershell
   netstat -ano | findstr ":8080"
   ```

2. **Arrêter tous les processus Java :**
   ```powershell
   Get-Process | Where-Object {$_.ProcessName -like "*java*"} | Stop-Process -Force
   ```

3. **Redémarrer le backend :**
   ```powershell
   cd "C:\Users\hp\Downloads\files (5)\eduafrica-backend\eduafrica-backend"
   mvn clean spring-boot:run
   ```

4. **Vérifier les logs du backend** pour voir les erreurs éventuelles

5. **Vérifier que PostgreSQL est bien démarré :**
   ```powershell
   docker ps | findstr postgres
   ```

## 📞 Support

Si le problème persiste après avoir suivi ces étapes, vérifiez :
- Les logs du backend dans le terminal
- La console du navigateur (F12) pour les erreurs frontend
- Que PostgreSQL est bien accessible sur le port 5433



