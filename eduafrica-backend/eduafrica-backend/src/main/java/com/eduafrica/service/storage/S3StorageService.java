package com.eduafrica.service.storage;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.io.IOException;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Service d'intégration avec AWS S3
 * 
 * Configuration requise dans application.properties:
 * - aws.s3.bucket=your-bucket-name
 * - aws.s3.region=us-east-1
 * - aws.s3.access-key=your-access-key
 * - aws.s3.secret-key=your-secret-key
 * - aws.s3.enabled=true
 * 
 * Note: Ce service est conditionnel - il ne sera créé que si les dépendances AWS sont disponibles
 */
@Service
@ConditionalOnProperty(name = "aws.s3.enabled", havingValue = "true")
public class S3StorageService extends CloudStorageService {
    
    @Value("${aws.s3.bucket:}")
    private String bucketName;
    
    @Value("${aws.s3.region:us-east-1}")
    private String region;
    
    @Value("${aws.s3.access-key:}")
    private String accessKey;
    
    @Value("${aws.s3.secret-key:}")
    private String secretKey;
    
    @Value("${aws.s3.enabled:false}")
    private boolean s3Enabled;
    
    private S3Client s3Client;
    private S3Presigner presigner;
    
    @PostConstruct
    public void init() {
        if (!s3Enabled || bucketName.isEmpty() || accessKey.isEmpty() || secretKey.isEmpty()) {
            System.out.println("AWS S3 désactivé ou non configuré");
            return;
        }
        
        try {
            AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKey, secretKey);
            
            this.s3Client = S3Client.builder()
                    .region(Region.of(region))
                    .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                    .build();
            
            this.presigner = S3Presigner.builder()
                    .region(Region.of(region))
                    .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                    .build();
            System.out.println("AWS S3 initialisé avec succès");
        } catch (NoClassDefFoundError e) {
            System.err.println("Dépendances AWS S3 non disponibles. Le stockage local sera utilisé.");
        }
    }
    
    @PreDestroy
    public void cleanup() {
        if (s3Client != null) {
            s3Client.close();
        }
        if (presigner != null) {
            presigner.close();
        }
    }
    
    @Override
    public String uploadFile(MultipartFile file, String folder, String fileName) throws IOException {
        if (!shouldUseCloudStorage() || s3Client == null) {
            throw new IOException("AWS S3 non configuré");
        }
        
        if (fileName == null || fileName.isEmpty()) {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            fileName = UUID.randomUUID().toString() + extension;
        }
        
        String key = folder != null && !folder.isEmpty() 
            ? folder + "/" + fileName 
            : fileName;
        
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .build();
        
        s3Client.putObject(putObjectRequest, 
                software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes()));
        
        // Retourner l'URL publique
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, key);
    }
    
    @Override
    public void deleteFile(String fileUrl) throws IOException {
        if (!shouldUseCloudStorage() || s3Client == null) {
            throw new IOException("AWS S3 non configuré");
        }
        
        String key = extractKeyFromUrl(fileUrl);
        DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        
        s3Client.deleteObject(deleteRequest);
    }
    
    @Override
    public String generateSignedUrl(String fileUrl, int expirationMinutes) throws IOException {
        if (!shouldUseCloudStorage() || presigner == null) {
            throw new IOException("AWS S3 non configuré");
        }
        
        String key = extractKeyFromUrl(fileUrl);
        
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        
        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(expirationMinutes))
                .getObjectRequest(getObjectRequest)
                .build();
        
        PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(presignRequest);
        return presignedRequest.url().toString();
    }
    
    @Override
    public boolean fileExists(String fileUrl) throws IOException {
        if (!shouldUseCloudStorage() || s3Client == null) {
            return false;
        }
        
        String key = extractKeyFromUrl(fileUrl);
        try {
            HeadObjectRequest headRequest = HeadObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            
            s3Client.headObject(headRequest);
            return true;
        } catch (NoSuchKeyException e) {
            return false;
        }
    }
    
    @Override
    public Map<String, Object> getFileMetadata(String fileUrl) throws IOException {
        if (!shouldUseCloudStorage() || s3Client == null) {
            throw new IOException("AWS S3 non configuré");
        }
        
        String key = extractKeyFromUrl(fileUrl);
        HeadObjectRequest headRequest = HeadObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        
        HeadObjectResponse response = s3Client.headObject(headRequest);
        
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("size", response.contentLength());
        metadata.put("contentType", response.contentType());
        metadata.put("lastModified", response.lastModified());
        metadata.put("etag", response.eTag());
        
        return metadata;
    }
    
    private String extractKeyFromUrl(String fileUrl) {
        // Extraire la clé depuis l'URL
        // Format: https://bucket-name.s3.region.amazonaws.com/folder/file.ext
        if (fileUrl.contains(bucketName + ".s3")) {
            int endIndex = fileUrl.indexOf(".amazonaws.com/");
            if (endIndex > 0) {
                return fileUrl.substring(endIndex + ".amazonaws.com/".length());
            }
        }
        return fileUrl;
    }
}

