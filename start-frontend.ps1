# Script de démarrage pour EduAfrica Frontend
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Démarrage EduAfrica Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier Node.js
Write-Host "[1/3] Vérification de Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js n'est pas installé!" -ForegroundColor Red
    Write-Host "   Veuillez installer Node.js 18+ depuis https://nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green
Write-Host ""

# Aller dans le répertoire frontend
Set-Location "eduafrica-frontend\eduafrica-frontend"

# Vérifier/Installer les dépendances
Write-Host "[2/3] Vérification des dépendances..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "   Installation des dépendances npm (cela peut prendre quelques minutes)..." -ForegroundColor Gray
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dépendances installées" -ForegroundColor Green
} else {
    Write-Host "✅ Dépendances déjà installées" -ForegroundColor Green
}
Write-Host ""

# Démarrer le serveur Angular
Write-Host "[3/3] Démarrage du serveur Angular..." -ForegroundColor Yellow
Write-Host "   Le serveur sera accessible sur http://localhost:4200" -ForegroundColor Gray
Write-Host "   Appuyez sur Ctrl+C pour arrêter le serveur" -ForegroundColor Gray
Write-Host ""

npm start

