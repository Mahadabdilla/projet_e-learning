package com.eduafrica.service;

import com.eduafrica.model.Certificate;
import com.eduafrica.model.Enrollment;
import com.eduafrica.model.Formation;
import com.eduafrica.model.User;
import com.eduafrica.repository.CertificateRepository;
import com.eduafrica.repository.EnrollmentRepository;
import com.eduafrica.repository.UserRepository;
import com.eduafrica.service.blockchain.BlockchainService;
import com.eduafrica.service.blockchain.BlockchainTransaction;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.TextAlignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class CertificateService {
    
    @Autowired
    private CertificateRepository certificateRepository;
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BlockchainService blockchainService;
    
    @Value("${blockchain.network:local}")
    private String blockchainNetwork;
    
    @Value("${blockchain.contract.address:}")
    private String blockchainContractAddress;
    
    /**
     * Génère un certificat PDF pour un apprenant ayant complété une formation
     */
    @Transactional
    public byte[] generateCertificate(Long enrollmentId, String userEmail) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée"));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        Formation formation = enrollment.getFormation();
        
        // Vérifier que l'enrollment appartient à l'utilisateur
        if (!enrollment.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Cette inscription ne vous appartient pas");
        }
        
        // Vérifier que la formation est complétée (progression >= 100%)
        if (enrollment.getProgress() < 100) {
            throw new RuntimeException("Vous devez compléter la formation avant d'obtenir un certificat");
        }
        
        // Vérifier si un certificat existe déjà
        Certificate existingCertificate = certificateRepository.findByUserAndFormation(user, formation)
                .orElse(null);
        
        if (existingCertificate != null) {
            // Si le certificat existe déjà, vérifier qu'il a un hash blockchain
            if (existingCertificate.getBlockchainHash() == null) {
                // Générer et enregistrer le hash blockchain pour un certificat existant
                LocalDateTime issuedAt = existingCertificate.getIssuedAt() != null ? 
                    existingCertificate.getIssuedAt() : LocalDateTime.now();
                
                String certificateHash = blockchainService.generateCertificateHash(
                    existingCertificate.getId(),
                    user.getId(),
                    formation.getId(),
                    existingCertificate.getCertificateCode(),
                    issuedAt
                );
                
                BlockchainTransaction transaction = blockchainService.registerCertificate(
                    certificateHash,
                    existingCertificate.getId()
                );
                
                existingCertificate.setBlockchainHash(certificateHash);
                existingCertificate.setBlockchainTransactionHash(transaction.getTransactionHash());
                existingCertificate.setBlockchainBlockNumber(transaction.getBlockNumber());
                existingCertificate.setBlockchainNetwork(blockchainNetwork);
                existingCertificate.setBlockchainContractAddress(blockchainContractAddress);
                
                certificateRepository.save(existingCertificate);
            }
            // Régénérer le PDF
            return generatePdfDocument(user, formation, existingCertificate.getCertificateCode());
        }
        
        // Créer un nouveau certificat
        String certificateCode = generateCertificateCode();
        LocalDateTime issuedAt = LocalDateTime.now();
        
        Certificate certificate = Certificate.builder()
                .user(user)
                .formation(formation)
                .certificateCode(certificateCode)
                .issuedAt(issuedAt)
                .build();
        
        // Enregistrer le certificat pour obtenir l'ID
        certificate = certificateRepository.save(certificate);
        
        // Générer le hash blockchain
        String certificateHash = blockchainService.generateCertificateHash(
                certificate.getId(),
                user.getId(),
                formation.getId(),
                certificateCode,
                issuedAt
        );
        
        // Enregistrer sur la blockchain
        BlockchainTransaction transaction = blockchainService.registerCertificate(
                certificateHash,
                certificate.getId()
        );
        
        // Mettre à jour le certificat avec les informations blockchain
        certificate.setBlockchainHash(certificateHash);
        certificate.setBlockchainTransactionHash(transaction.getTransactionHash());
        certificate.setBlockchainBlockNumber(transaction.getBlockNumber());
        certificate.setBlockchainNetwork(blockchainNetwork);
        certificate.setBlockchainContractAddress(blockchainContractAddress);
        
        // Sauvegarder les informations blockchain
        certificate = certificateRepository.save(certificate);
        
        return generatePdfDocument(user, formation, certificate.getCertificateCode());
    }
    
    /**
     * Génère le document PDF du certificat
     */
    private byte[] generatePdfDocument(User user, Formation formation, String certificateCode) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        try {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4);
            
            // En-tête avec logo (simulé)
            Paragraph header = new Paragraph("CERTIFICAT DE COMPLÉTION")
                    .setFontSize(32)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(header);
            
            // Ligne décorative
            Paragraph decorativeLine = new Paragraph("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(30);
            document.add(decorativeLine);
            
            // Texte principal
            Paragraph mainText = new Paragraph()
                    .setFontSize(16)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            
            mainText.add(new Text("Ceci certifie que\n\n")
                    .setFontSize(14));
            
            mainText.add(new Text(user.getFirstName() + " " + user.getLastName())
                    .setFontSize(24)
                    .setBold());
            
            mainText.add(new Text("\n\na complété avec succès la formation\n\n")
                    .setFontSize(14));
            
            mainText.add(new Text(formation.getTitle())
                    .setFontSize(20)
                    .setBold());
            
            if (formation.getCategory() != null) {
                mainText.add(new Text("\n\nCatégorie : " + formation.getCategory())
                        .setFontSize(12));
            }
            
            if (formation.getLevel() != null) {
                mainText.add(new Text("\nNiveau : " + formation.getLevel())
                        .setFontSize(12));
            }
            
            mainText.add(new Text("\n\nDurée de la formation : " + formation.getDuration() + " heures")
                    .setFontSize(12));
            
            document.add(mainText);
            
            // Date d'émission
            Paragraph dateParagraph = new Paragraph()
                    .setFontSize(12)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(40)
                    .setMarginBottom(20);
            
            dateParagraph.add(new Text("Délivré le " + 
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy", java.util.Locale.FRENCH)))
                    .setFontSize(12));
            
            document.add(dateParagraph);
            
            // Code de vérification
            Paragraph codeParagraph = new Paragraph()
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(30);
            
            codeParagraph.add(new Text("Code de vérification : " + certificateCode)
                    .setFontSize(10)
                    .setItalic());
            
            document.add(codeParagraph);
            
            // Hash blockchain pour vérification
            Certificate cert = certificateRepository.findByCertificateCode(certificateCode).orElse(null);
            if (cert != null && cert.getBlockchainHash() != null) {
                Paragraph blockchainParagraph = new Paragraph()
                        .setFontSize(8)
                        .setTextAlignment(TextAlignment.CENTER)
                        .setMarginTop(10);
                
                blockchainParagraph.add(new Text("Hash Blockchain : " + cert.getBlockchainHash())
                        .setFontSize(8)
                        .setItalic());
                
                document.add(blockchainParagraph);
            }
            
            // Pied de page
            Paragraph footer = new Paragraph()
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(50);
            
            footer.add(new Text("EduAfrica - Plateforme d'apprentissage en ligne pour l'Afrique\n")
                    .setFontSize(10));
            footer.add(new Text("Ce certificat peut être vérifié en ligne sur www.eduafrica.com/verify/" + certificateCode)
                    .setFontSize(9)
                    .setItalic());
            
            document.add(footer);
            
            document.close();
            
            return baos.toByteArray();
            
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du certificat", e);
        }
    }
    
    /**
     * Génère un code unique pour le certificat
     */
    private String generateCertificateCode() {
        return "CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase() + 
               "-" + System.currentTimeMillis();
    }
    
    /**
     * Vérifie si un utilisateur peut obtenir un certificat pour une formation
     */
    public boolean canGenerateCertificate(Long enrollmentId, String userEmail) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée"));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        if (!enrollment.getUser().getId().equals(user.getId())) {
            return false;
        }
        
        return enrollment.getProgress() >= 100;
    }
    
    /**
     * Récupère tous les certificats d'un utilisateur
     */
    public java.util.List<Certificate> getUserCertificates(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return certificateRepository.findByUser(user);
    }
    
    /**
     * Vérifie un certificat par son code
     */
    public Certificate verifyCertificate(String certificateCode) {
        Certificate certificate = certificateRepository.findByCertificateCode(certificateCode)
                .orElseThrow(() -> new RuntimeException("Certificat non trouvé"));
        return certificate;
    }
    
    /**
     * Vérifie un certificat via la blockchain par son hash
     */
    public boolean verifyCertificateOnBlockchain(String certificateHash) {
        return blockchainService.verifyCertificate(certificateHash);
    }
    
    /**
     * Récupère les détails d'un certificat sur la blockchain
     */
    public com.eduafrica.service.blockchain.BlockchainRecord getBlockchainRecord(String certificateHash) {
        return blockchainService.getCertificateRecord(certificateHash);
    }
}

