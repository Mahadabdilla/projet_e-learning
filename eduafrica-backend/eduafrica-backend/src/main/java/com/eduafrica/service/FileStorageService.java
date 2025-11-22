package com.eduafrica.service;

import com.eduafrica.model.FileUpload;
import com.eduafrica.model.User;
import com.eduafrica.repository.FileUploadRepository;
import com.eduafrica.repository.UserRepository;
import com.eduafrica.service.storage.CloudStorageService;
import com.eduafrica.service.storage.FirebaseStorageService;
import com.eduafrica.service.storage.S3StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {
    
    @Autowired(required = false)
    private FirebaseStorageService firebaseStorageService;
    
    @Autowired(required = false)
    private S3StorageService s3StorageService;
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    @Value("${storage.provider:local}")
    private String storageProvider;
    
    @Value("${storage.enabled:false}")
    private boolean storageEnabled;
    
    @Autowired
    private FileUploadRepository fileUploadRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Obtient le service de stockage cloud approprié
     */
    private CloudStorageService getCloudStorageService() {
        if (!storageEnabled) {
            return null;
        }
        
        if ("firebase".equals(storageProvider) && firebaseStorageService != null) {
            return firebaseStorageService;
        } else if ("s3".equals(storageProvider) && s3StorageService != null) {
            return s3StorageService;
        }
        
        return null;
    }
    
    /**
     * Initialiser le répertoire d'upload s'il n'existe pas
     */
    private Path getUploadPath() throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        return uploadPath;
    }
    
    /**
     * Déterminer le type de fichier
     */
    private String determineFileType(String contentType) {
        if (contentType == null) {
            return "UNKNOWN";
        }
        
        if (contentType.startsWith("image/")) {
            return "IMAGE";
        } else if (contentType.startsWith("video/")) {
            return "VIDEO";
        } else if (contentType.equals("application/pdf") || 
                   contentType.startsWith("application/msword") ||
                   contentType.startsWith("application/vnd.openxmlformats")) {
            return "DOCUMENT";
        } else {
            return "OTHER";
        }
    }
    
    /**
     * Valider le type de fichier
     */
    private void validateFileType(String contentType, String fileType) {
        if (fileType == null || fileType.isEmpty()) {
            return; // Pas de restriction
        }
        
        switch (fileType.toUpperCase()) {
            case "IMAGE":
                if (!contentType.startsWith("image/")) {
                    throw new RuntimeException("Le fichier doit être une image");
                }
                break;
            case "VIDEO":
                if (!contentType.startsWith("video/")) {
                    throw new RuntimeException("Le fichier doit être une vidéo");
                }
                break;
            case "DOCUMENT":
                if (!contentType.equals("application/pdf") && 
                    !contentType.startsWith("application/msword") &&
                    !contentType.startsWith("application/vnd.openxmlformats")) {
                    throw new RuntimeException("Le fichier doit être un document (PDF, Word, etc.)");
                }
                break;
        }
    }
    
    /**
     * Valider la taille du fichier
     */
    private void validateFileSize(long fileSize, long maxSizeBytes) {
        if (maxSizeBytes > 0 && fileSize > maxSizeBytes) {
            throw new RuntimeException("Le fichier est trop volumineux. Taille maximale : " + 
                    (maxSizeBytes / (1024 * 1024)) + " MB");
        }
    }
    
    /**
     * Upload un fichier
     */
    @Transactional
    public FileUpload uploadFile(MultipartFile file, String userEmail, String allowedFileType, Long maxSizeBytes) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("Le fichier est vide");
        }
        
        String contentType = file.getContentType();
        if (contentType == null) {
            throw new RuntimeException("Type de fichier non détecté");
        }
        
        // Valider le type de fichier
        if (allowedFileType != null && !allowedFileType.isEmpty()) {
            validateFileType(contentType, allowedFileType);
        }
        
        // Valider la taille
        if (maxSizeBytes == null) {
            maxSizeBytes = 10L * 1024 * 1024; // 10 MB par défaut
        }
        validateFileSize(file.getSize(), maxSizeBytes);
        
        // Générer un nom de fichier unique
        String originalFileName = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String storedFileName = UUID.randomUUID().toString() + fileExtension;
        
        // Récupérer l'utilisateur
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        String filePath = null;
        String fileUrl = null;
        
        // Utiliser le stockage cloud si configuré
        CloudStorageService cloudStorage = getCloudStorageService();
        if (cloudStorage != null) {
            try {
                // Déterminer le dossier selon le type de fichier
                String folder = determineFileType(contentType).toLowerCase() + "s";
                fileUrl = cloudStorage.uploadFile(file, folder, storedFileName);
                filePath = fileUrl; // Pour cloud storage, filePath contient l'URL
            } catch (IOException e) {
                // En cas d'erreur, fallback sur stockage local
                System.err.println("Erreur upload cloud, fallback local: " + e.getMessage());
                cloudStorage = null;
            }
        }
        
        // Stockage local si cloud non disponible
        if (cloudStorage == null || filePath == null) {
            Path uploadPath = getUploadPath();
            Path targetPath = uploadPath.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            filePath = targetPath.toString();
        }
        
        // Créer l'entité FileUpload
        FileUpload fileUpload = FileUpload.builder()
                .originalFileName(originalFileName)
                .storedFileName(storedFileName)
                .filePath(filePath)
                .fileUrl(fileUrl) // URL cloud si disponible
                .contentType(contentType)
                .fileSize(file.getSize())
                .uploadedBy(user)
                .fileType(determineFileType(contentType))
                .build();
        
        return fileUploadRepository.save(fileUpload);
    }
    
    /**
     * Récupérer un fichier en tant que Resource
     */
    public Resource loadFileAsResource(Long fileId) throws MalformedURLException {
        FileUpload fileUpload = fileUploadRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("Fichier non trouvé"));
        
        Path filePath = Paths.get(fileUpload.getFilePath());
        Resource resource = new UrlResource(filePath.toUri());
        
        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            throw new RuntimeException("Le fichier n'existe pas ou n'est pas accessible");
        }
    }
    
    /**
     * Récupérer un fichier par son nom stocké
     */
    public Resource loadFileByStoredName(String storedFileName) throws MalformedURLException {
        FileUpload fileUpload = fileUploadRepository.findByStoredFileName(storedFileName)
                .orElseThrow(() -> new RuntimeException("Fichier non trouvé"));
        
        return loadFileAsResource(fileUpload.getId());
    }
    
    /**
     * Supprimer un fichier
     */
    @Transactional
    public void deleteFile(Long fileId, String userEmail) throws IOException {
        FileUpload fileUpload = fileUploadRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("Fichier non trouvé"));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // Vérifier que l'utilisateur est le propriétaire ou admin
        if (!fileUpload.getUploadedBy().getId().equals(user.getId()) && 
            user.getRole() != com.eduafrica.model.enums.Role.ADMIN) {
            throw new RuntimeException("Vous n'êtes pas autorisé à supprimer ce fichier");
        }
        
        // Supprimer le fichier (cloud ou local)
        CloudStorageService cloudStorage = getCloudStorageService();
        if (cloudStorage != null && fileUpload.getFileUrl() != null) {
            try {
                cloudStorage.deleteFile(fileUpload.getFileUrl());
            } catch (IOException e) {
                System.err.println("Erreur suppression cloud: " + e.getMessage());
            }
        } else {
            // Supprimer le fichier local
            Path filePath = Paths.get(fileUpload.getFilePath());
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
        }
        
        // Supprimer l'entité
        fileUploadRepository.delete(fileUpload);
    }
    
    /**
     * Récupérer les fichiers d'un utilisateur
     */
    public java.util.List<FileUpload> getUserFiles(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return fileUploadRepository.findByUploadedBy(user);
    }
    
    /**
     * Récupérer un fichier par ID
     */
    public FileUpload getFileById(Long fileId) {
        return fileUploadRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("Fichier non trouvé"));
    }
}



