package com.eduafrica.service.blockchain;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * Service blockchain pour la vérification des certificats
 * 
 * Ce service simule une blockchain pour stocker les hash des certificats.
 * En production, vous pouvez intégrer avec Ethereum, Hyperledger, ou une blockchain privée.
 */
@Service
public class BlockchainService {
    
    @Value("${blockchain.network:local}")
    private String blockchainNetwork;
    
    @Value("${blockchain.contract.address:}")
    private String contractAddress;
    
    // Simulation d'une blockchain locale (en production, utiliser une vraie blockchain)
    private final List<BlockchainRecord> blockchain = new ArrayList<>();
    
    /**
     * Génère un hash SHA-256 pour un certificat
     */
    public String generateCertificateHash(Long certificateId, Long userId, Long formationId, 
                                         String certificateCode, LocalDateTime issuedAt) {
        try {
            String data = String.format("%d|%d|%d|%s|%s", 
                    certificateId, userId, formationId, certificateCode, 
                    issuedAt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erreur lors de la génération du hash", e);
        }
    }
    
    /**
     * Enregistre un certificat sur la blockchain (simulation)
     * En production, cela appellerait un smart contract
     */
    public BlockchainTransaction registerCertificate(String certificateHash, Long certificateId) {
        Long blockNumber = (long) blockchain.size() + 1L;
        BlockchainRecord record = BlockchainRecord.builder()
                .certificateHash(certificateHash)
                .certificateId(certificateId)
                .timestamp(LocalDateTime.now())
                .blockNumber(blockNumber)
                .previousHash(blockchain.isEmpty() ? "0" : blockchain.get(blockchain.size() - 1).getHash())
                .build();
        
        // Calculer le hash du bloc
        record.setHash(calculateBlockHash(record));
        
        blockchain.add(record);
        
        return BlockchainTransaction.builder()
                .transactionHash(record.getHash())
                .blockNumber(record.getBlockNumber())
                .timestamp(record.getTimestamp())
                .status("CONFIRMED")
                .build();
    }
    
    /**
     * Vérifie si un certificat existe sur la blockchain
     */
    public boolean verifyCertificate(String certificateHash) {
        return blockchain.stream()
                .anyMatch(record -> record.getCertificateHash().equals(certificateHash));
    }
    
    /**
     * Récupère les détails d'un certificat sur la blockchain
     */
    public BlockchainRecord getCertificateRecord(String certificateHash) {
        return blockchain.stream()
                .filter(record -> record.getCertificateHash().equals(certificateHash))
                .findFirst()
                .orElse(null);
    }
    
    /**
     * Calcule le hash d'un bloc
     */
    private String calculateBlockHash(BlockchainRecord record) {
        try {
            String data = String.format("%s|%s|%d|%s", 
                    record.getCertificateHash(),
                    record.getPreviousHash(),
                    record.getBlockNumber(),
                    record.getTimestamp().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erreur lors du calcul du hash", e);
        }
    }
    
    /**
     * Récupère l'historique complet de la blockchain
     */
    public List<BlockchainRecord> getBlockchainHistory() {
        return new ArrayList<>(blockchain);
    }
    
    /**
     * Récupère le dernier bloc
     */
    public BlockchainRecord getLatestBlock() {
        return blockchain.isEmpty() ? null : blockchain.get(blockchain.size() - 1);
    }
}


