# Script de démarrage pour EduAfrica Backend
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Démarrage EduAfrica Backend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Docker est en cours d'exécution
Write-Host "[1/3] Vérification de Docker..." -ForegroundColor Yellow
$dockerRunning = docker ps 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker n'est pas en cours d'exécution!" -ForegroundColor Red
    Write-Host "   Veuillez démarrer Docker Desktop" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Docker est en cours d'exécution" -ForegroundColor Green
Write-Host ""

# Démarrer PostgreSQL
Write-Host "[2/3] Démarrage de PostgreSQL..." -ForegroundColor Yellow
docker-compose up -d postgres
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du démarrage de PostgreSQL" -ForegroundColor Red
    exit 1
}

# Attendre que PostgreSQL soit prêt
Write-Host "   Attente que PostgreSQL soit prêt..." -ForegroundColor Gray
Start-Sleep -Seconds 5

$postgresStatus = docker ps --filter "name=eduafrica-postgres" --format "{{.Status}}"
if ($postgresStatus -match "healthy" -or $postgresStatus -match "Up") {
    Write-Host "✅ PostgreSQL est prêt" -ForegroundColor Green
} else {
    Write-Host "⚠️  PostgreSQL démarre..." -ForegroundColor Yellow
}
Write-Host ""

# Démarrer le backend Spring Boot
Write-Host "[3/3] Démarrage du backend Spring Boot..." -ForegroundColor Yellow
Write-Host "   Cela peut prendre 30-60 secondes..." -ForegroundColor Gray
Write-Host ""

Set-Location "eduafrica-backend\eduafrica-backend"
mvn spring-boot:run

