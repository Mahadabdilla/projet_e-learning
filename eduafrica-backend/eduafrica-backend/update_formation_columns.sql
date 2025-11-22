-- Script SQL pour mettre à jour les colonnes title et image_url
-- Exécutez ce script dans votre base de données PostgreSQL pour augmenter la longueur maximale des colonnes

ALTER TABLE formations ALTER COLUMN title TYPE VARCHAR(500);
ALTER TABLE formations ALTER COLUMN image_url TYPE VARCHAR(1000);


