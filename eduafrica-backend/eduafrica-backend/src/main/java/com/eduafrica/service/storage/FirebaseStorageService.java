package com.eduafrica.service.storage;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import jakarta.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * Service d'intégration avec Firebase Storage
 * 
 * Configuration requise dans application.properties:
 * - firebase.storage.bucket=your-bucket-name
 * - firebase.storage.credentials.path=path/to/serviceAccountKey.json
 * - firebase.storage.enabled=true
 * 
 * Note: Ce service est conditionnel - il ne sera créé que si les dépendances Firebase sont disponibles
 */
@Service
@ConditionalOnProperty(name = "firebase.storage.enabled", havingValue = "true")
public class FirebaseStorageService extends CloudStorageService {
    
    @Value("${firebase.storage.bucket:}")
    private String bucketName;
    
    @Value("${firebase.storage.credentials.path:}")
    private String credentialsPath;
    
    @Value("${firebase.storage.enabled:false}")
    private boolean firebaseEnabled;
    
    private Storage storage;
    
    @PostConstruct
    public void init() {
        if (!firebaseEnabled || bucketName.isEmpty()) {
            System.out.println("Firebase Storage désactivé ou non configuré");
            return;
        }
        
        try {
            GoogleCredentials credentials;
            if (!credentialsPath.isEmpty()) {
                credentials = GoogleCredentials.fromStream(new FileInputStream(credentialsPath));
            } else {
                // Utiliser les credentials par défaut (GOOGLE_APPLICATION_CREDENTIALS)
                credentials = GoogleCredentials.getApplicationDefault();
            }
            
            this.storage = StorageOptions.newBuilder()
                    .setCredentials(credentials)
                    .build()
                    .getService();
            System.out.println("Firebase Storage initialisé avec succès");
        } catch (IOException e) {
            System.err.println("Erreur lors de l'initialisation de Firebase Storage: " + e.getMessage());
            System.err.println("Le stockage local sera utilisé à la place");
        } catch (NoClassDefFoundError e) {
            System.err.println("Dépendances Firebase non disponibles. Le stockage local sera utilisé.");
        }
    }
    
    @Override
    public String uploadFile(MultipartFile file, String folder, String fileName) throws IOException {
        if (!shouldUseCloudStorage() || storage == null) {
            throw new IOException("Firebase Storage non configuré");
        }
        
        if (fileName == null || fileName.isEmpty()) {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            fileName = UUID.randomUUID().toString() + extension;
        }
        
        String blobName = folder != null && !folder.isEmpty() 
            ? folder + "/" + fileName 
            : fileName;
        
        BlobId blobId = BlobId.of(bucketName, blobName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(file.getContentType())
                .build();
        
        storage.create(blobInfo, file.getBytes());
        
        // Retourner l'URL publique
        return String.format("https://storage.googleapis.com/%s/%s", bucketName, blobName);
    }
    
    @Override
    public void deleteFile(String fileUrl) throws IOException {
        if (!shouldUseCloudStorage() || storage == null) {
            throw new IOException("Firebase Storage non configuré");
        }
        
        String blobName = extractBlobNameFromUrl(fileUrl);
        BlobId blobId = BlobId.of(bucketName, blobName);
        storage.delete(blobId);
    }
    
    @Override
    public String generateSignedUrl(String fileUrl, int expirationMinutes) throws IOException {
        if (!shouldUseCloudStorage() || storage == null) {
            throw new IOException("Firebase Storage non configuré");
        }
        
        String blobName = extractBlobNameFromUrl(fileUrl);
        BlobId blobId = BlobId.of(bucketName, blobName);
        Blob blob = storage.get(blobId);
        
        if (blob == null) {
            throw new IOException("Fichier non trouvé");
        }
        
        URL signedUrl = blob.signUrl(expirationMinutes, TimeUnit.MINUTES);
        return signedUrl.toString();
    }
    
    @Override
    public boolean fileExists(String fileUrl) throws IOException {
        if (!shouldUseCloudStorage() || storage == null) {
            return false;
        }
        
        String blobName = extractBlobNameFromUrl(fileUrl);
        BlobId blobId = BlobId.of(bucketName, blobName);
        Blob blob = storage.get(blobId);
        return blob != null && blob.exists();
    }
    
    @Override
    public Map<String, Object> getFileMetadata(String fileUrl) throws IOException {
        if (!shouldUseCloudStorage() || storage == null) {
            throw new IOException("Firebase Storage non configuré");
        }
        
        String blobName = extractBlobNameFromUrl(fileUrl);
        BlobId blobId = BlobId.of(bucketName, blobName);
        Blob blob = storage.get(blobId);
        
        if (blob == null) {
            throw new IOException("Fichier non trouvé");
        }
        
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("size", blob.getSize());
        metadata.put("contentType", blob.getContentType());
        metadata.put("created", blob.getCreateTimeOffsetDateTime());
        metadata.put("updated", blob.getUpdateTimeOffsetDateTime());
        metadata.put("md5Hash", blob.getMd5());
        
        return metadata;
    }
    
    private String extractBlobNameFromUrl(String fileUrl) {
        // Extraire le nom du blob depuis l'URL
        // Format: https://storage.googleapis.com/bucket-name/folder/file.ext
        if (fileUrl.contains(bucketName + "/")) {
            return fileUrl.substring(fileUrl.indexOf(bucketName + "/") + bucketName.length() + 1);
        }
        return fileUrl;
    }
}

