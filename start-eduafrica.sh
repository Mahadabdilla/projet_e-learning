#!/bin/bash

echo "========================================="
echo "   EduAfrica - Script de démarrage"
echo "========================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifier les prérequis
echo -e "${BLUE}🔍 Vérification des prérequis...${NC}"

# Vérifier Java
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java n'est pas installé${NC}"
    echo "Installez Java 17 ou supérieur"
    exit 1
fi
echo -e "${GREEN}✅ Java installé${NC}"

# Vérifier Maven
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}❌ Maven n'est pas installé${NC}"
    echo "Installez Maven 3.6 ou supérieur"
    exit 1
fi
echo -e "${GREEN}✅ Maven installé${NC}"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    echo "Installez Node.js 18 ou supérieur"
    exit 1
fi
echo -e "${GREEN}✅ Node.js installé${NC}"

# Vérifier PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${RED}⚠️  PostgreSQL n'est pas installé${NC}"
    echo "Installez PostgreSQL 12 ou supérieur"
    echo ""
    read -p "Voulez-vous continuer sans PostgreSQL ? (o/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Oo]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✅ PostgreSQL installé${NC}"
fi

echo ""
echo -e "${BLUE}📦 Configuration de la base de données...${NC}"
echo "Voulez-vous créer la base de données automatiquement ?"
echo "Cela nécessite les identifiants PostgreSQL"
read -p "(o/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Oo]$ ]]; then
    echo "Entrez le nom d'utilisateur PostgreSQL (défaut: postgres):"
    read PG_USER
    PG_USER=${PG_USER:-postgres}
    
    echo "Création de la base de données..."
    sudo -u $PG_USER psql -c "CREATE DATABASE eduafrica;" 2>/dev/null || echo "Base de données existe déjà"
    echo -e "${GREEN}✅ Base de données prête${NC}"
fi

echo ""
echo -e "${BLUE}🚀 Démarrage du Backend...${NC}"

# Aller dans le dossier backend
cd eduafrica-backend

# Compiler et lancer le backend en arrière-plan
echo "Compilation du backend..."
mvn clean install -DskipTests

echo "Lancement du backend sur http://localhost:8080..."
nohup mvn spring-boot:run > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Attendre que le backend démarre
echo "Attente du démarrage du backend (30 secondes)..."
sleep 30

# Vérifier si le backend est actif
if curl -s http://localhost:8080/api/auth/login > /dev/null; then
    echo -e "${GREEN}✅ Backend démarré avec succès!${NC}"
else
    echo -e "${RED}❌ Erreur lors du démarrage du backend${NC}"
    echo "Consultez le fichier backend.log pour plus de détails"
    exit 1
fi

echo ""
echo -e "${BLUE}🎨 Démarrage du Frontend...${NC}"

# Aller dans le dossier frontend
cd ../eduafrica-frontend

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "Installation des dépendances npm..."
    npm install
fi

# Lancer le frontend
echo "Lancement du frontend sur http://localhost:4200..."
nohup ng serve > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}   ✅ EduAfrica est maintenant actif!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "Backend:  ${BLUE}http://localhost:8080${NC}"
echo -e "Frontend: ${BLUE}http://localhost:4200${NC}"
echo ""
echo "📧 Comptes de test:"
echo "   Apprenant: apprenant@eduafrica.com / password123"
echo "   Formateur: formateur@eduafrica.com / password123"
echo "   Mentor:    mentor@eduafrica.com / password123"
echo "   Admin:     admin@eduafrica.com / admin123"
echo ""
echo "Pour arrêter l'application:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Logs:"
echo "  Backend:  tail -f eduafrica-backend/backend.log"
echo "  Frontend: tail -f eduafrica-frontend/frontend.log"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter ce script (les serveurs continueront)"
echo ""

# Sauvegarder les PIDs
echo "BACKEND_PID=$BACKEND_PID" > .pids
echo "FRONTEND_PID=$FRONTEND_PID" >> .pids

# Garder le script actif
tail -f /dev/null
