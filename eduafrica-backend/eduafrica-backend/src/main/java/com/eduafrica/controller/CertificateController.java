package com.eduafrica.controller;

import com.eduafrica.model.Certificate;
import com.eduafrica.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {
    
    @Autowired
    private CertificateService certificateService;
    
    /**
     * Génère et télécharge un certificat PDF
     */
    @GetMapping("/enrollment/{enrollmentId}/generate")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<byte[]> generateCertificate(
            @PathVariable Long enrollmentId,
            Authentication authentication
    ) {
        try {
            String userEmail = authentication.getName();
            byte[] pdfBytes = certificateService.generateCertificate(enrollmentId, userEmail);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "certificat.pdf");
            headers.setContentLength(pdfBytes.length);
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Vérifie si un certificat peut être généré
     */
    @GetMapping("/enrollment/{enrollmentId}/can-generate")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<Boolean> canGenerateCertificate(
            @PathVariable Long enrollmentId,
            Authentication authentication
    ) {
        try {
            String userEmail = authentication.getName();
            boolean canGenerate = certificateService.canGenerateCertificate(enrollmentId, userEmail);
            return ResponseEntity.ok(canGenerate);
        } catch (RuntimeException e) {
            return ResponseEntity.ok(false);
        }
    }
    
    /**
     * Récupère tous les certificats de l'utilisateur connecté
     */
    @GetMapping("/my-certificates")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<List<Certificate>> getMyCertificates(Authentication authentication) {
        String userEmail = authentication.getName();
        List<Certificate> certificates = certificateService.getUserCertificates(userEmail);
        return ResponseEntity.ok(certificates);
    }
    
    /**
     * Vérifie un certificat par son code (endpoint public)
     */
    @GetMapping("/verify/{certificateCode}")
    public ResponseEntity<Certificate> verifyCertificate(@PathVariable String certificateCode) {
        try {
            Certificate certificate = certificateService.verifyCertificate(certificateCode);
            return ResponseEntity.ok(certificate);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Vérifie un certificat via la blockchain par son hash (endpoint public)
     */
    @GetMapping("/verify-blockchain/{certificateHash}")
    public ResponseEntity<?> verifyCertificateOnBlockchain(@PathVariable String certificateHash) {
        try {
            boolean isValid = certificateService.verifyCertificateOnBlockchain(certificateHash);
            if (isValid) {
                com.eduafrica.service.blockchain.BlockchainRecord record = 
                    certificateService.getBlockchainRecord(certificateHash);
                return ResponseEntity.ok(record);
            } else {
                return ResponseEntity.ok(java.util.Map.of(
                    "valid", false,
                    "message", "Certificat non trouvé sur la blockchain"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                "error", "Erreur lors de la vérification",
                "message", e.getMessage()
            ));
        }
    }
}




