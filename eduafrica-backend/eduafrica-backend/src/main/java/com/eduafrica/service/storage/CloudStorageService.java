package com.eduafrica.service.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * Service abstrait pour le stockage cloud
 * Supporte Firebase Storage et AWS S3
 */
public abstract class CloudStorageService {
    
    @Value("${storage.provider:local}")
    protected String storageProvider;
    
    @Value("${storage.enabled:false}")
    protected boolean storageEnabled;
    
    /**
     * Upload un fichier vers le cloud storage
     * @param file Le fichier à uploader
     * @param folder Le dossier de destination (ex: "videos", "images", "documents")
     * @param fileName Le nom du fichier (optionnel, généré automatiquement si null)
     * @return URL publique du fichier uploadé
     */
    public abstract String uploadFile(MultipartFile file, String folder, String fileName) throws IOException;
    
    /**
     * Supprime un fichier du cloud storage
     * @param fileUrl URL du fichier à supprimer
     */
    public abstract void deleteFile(String fileUrl) throws IOException;
    
    /**
     * Génère une URL signée pour un accès temporaire
     * @param fileUrl URL du fichier
     * @param expirationMinutes Durée de validité en minutes
     * @return URL signée
     */
    public abstract String generateSignedUrl(String fileUrl, int expirationMinutes) throws IOException;
    
    /**
     * Vérifie si le fichier existe
     * @param fileUrl URL du fichier
     * @return true si le fichier existe
     */
    public abstract boolean fileExists(String fileUrl) throws IOException;
    
    /**
     * Obtient les métadonnées d'un fichier
     * @param fileUrl URL du fichier
     * @return Map contenant les métadonnées (size, contentType, etc.)
     */
    public abstract Map<String, Object> getFileMetadata(String fileUrl) throws IOException;
    
    /**
     * Détermine le provider à utiliser
     */
    protected boolean shouldUseCloudStorage() {
        return storageEnabled && !"local".equals(storageProvider);
    }
}

