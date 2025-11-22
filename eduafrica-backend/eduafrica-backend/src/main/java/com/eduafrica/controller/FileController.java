package com.eduafrica.controller;

import com.eduafrica.model.FileUpload;
import com.eduafrica.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/files")
public class FileController {
    
    @Autowired
    private FileStorageService fileStorageService;
    
    /**
     * Upload un fichier
     */
    @PostMapping("/upload")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FileUpload> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "fileType", required = false) String fileType,
            @RequestParam(value = "maxSizeMB", required = false) Long maxSizeMB,
            Authentication authentication
    ) {
        try {
            String userEmail = authentication.getName();
            Long maxSizeBytes = maxSizeMB != null ? maxSizeMB * 1024 * 1024 : null;
            
            FileUpload fileUpload = fileStorageService.uploadFile(file, userEmail, fileType, maxSizeBytes);
            return ResponseEntity.ok(fileUpload);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Télécharger un fichier
     */
    @GetMapping("/{fileId}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) {
        try {
            FileUpload fileUpload = fileStorageService.getFileById(fileId);
            Resource resource = fileStorageService.loadFileAsResource(fileId);
            
            String contentType = fileUpload.getContentType();
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"" + fileUpload.getOriginalFileName() + "\"")
                    .body(resource);
        } catch (RuntimeException | IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Afficher un fichier (pour les images)
     */
    @GetMapping("/{fileId}/view")
    public ResponseEntity<Resource> viewFile(@PathVariable Long fileId) {
        try {
            FileUpload fileUpload = fileStorageService.getFileById(fileId);
            Resource resource = fileStorageService.loadFileAsResource(fileId);
            
            String contentType = fileUpload.getContentType();
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "inline; filename=\"" + fileUpload.getOriginalFileName() + "\"")
                    .body(resource);
        } catch (RuntimeException | IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Récupérer les fichiers de l'utilisateur connecté
     */
    @GetMapping("/my-files")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<FileUpload>> getMyFiles(Authentication authentication) {
        String userEmail = authentication.getName();
        List<FileUpload> files = fileStorageService.getUserFiles(userEmail);
        return ResponseEntity.ok(files);
    }
    
    /**
     * Récupérer les informations d'un fichier
     */
    @GetMapping("/{fileId}")
    public ResponseEntity<FileUpload> getFileInfo(@PathVariable Long fileId) {
        try {
            FileUpload fileUpload = fileStorageService.getFileById(fileId);
            return ResponseEntity.ok(fileUpload);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Supprimer un fichier
     */
    @DeleteMapping("/{fileId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteFile(
            @PathVariable Long fileId,
            Authentication authentication
    ) {
        try {
            String userEmail = authentication.getName();
            fileStorageService.deleteFile(fileId, userEmail);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException | IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}



