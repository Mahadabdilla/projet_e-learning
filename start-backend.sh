#!/bin/bash

echo "=========================================="
echo "🎓 EduAfrica Backend - Script de lancement"
echo "=========================================="
echo ""

# Vérifier Java
echo "🔍 Vérification de Java..."
if ! command -v java &> /dev/null; then
    echo "❌ Java n'est pas installé. Veuillez installer Java 17+."
    exit 1
fi

java_version=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
echo "✅ Java version: $java_version"
echo ""

# Vérifier Maven
echo "🔍 Vérification de Maven..."
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven n'est pas installé. Veuillez installer Maven 3.6+."
    exit 1
fi

mvn_version=$(mvn -version | head -n 1)
echo "✅ $mvn_version"
echo ""

# Vérifier PostgreSQL
echo "🔍 Vérification de PostgreSQL..."
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL n'est pas détecté. Assurez-vous qu'il est installé et démarré."
else
    echo "✅ PostgreSQL est installé"
fi
echo ""

# Créer la base de données si elle n'existe pas
echo "🔧 Configuration de la base de données..."
echo "La base de données 'eduafrica_db' doit exister."
echo "Si ce n'est pas le cas, créez-la avec:"
echo "  CREATE DATABASE eduafrica_db;"
echo ""

read -p "La base de données est-elle prête? (o/n): " db_ready
if [ "$db_ready" != "o" ]; then
    echo "❌ Configuration annulée. Créez d'abord la base de données."
    exit 1
fi

# Lancer l'application
echo ""
echo "🚀 Lancement de l'application EduAfrica..."
echo "=========================================="
echo ""

cd eduafrica-backend
mvn spring-boot:run
