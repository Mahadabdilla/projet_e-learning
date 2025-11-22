package com.eduafrica.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "certificates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certificate {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "formation_id", nullable = false)
    private Formation formation;
    
    @Column(name = "certificate_url")
    private String certificateUrl;
    
    @Column(name = "certificate_code", unique = true)
    private String certificateCode;
    
    @Column(name = "blockchain_hash", unique = true)
    private String blockchainHash; // Hash SHA-256 du certificat
    
    @Column(name = "blockchain_transaction_hash")
    private String blockchainTransactionHash; // Hash de la transaction blockchain
    
    @Column(name = "blockchain_block_number")
    private Long blockchainBlockNumber; // Numéro du bloc sur la blockchain
    
    @Column(name = "blockchain_network")
    private String blockchainNetwork; // Réseau blockchain utilisé (local, ethereum, etc.)
    
    @Column(name = "blockchain_contract_address")
    private String blockchainContractAddress; // Adresse du smart contract
    
    @Column(name = "issued_at", nullable = false, updatable = false)
    private LocalDateTime issuedAt;
    
    @PrePersist
    protected void onCreate() {
        issuedAt = LocalDateTime.now();
        // Générer un code unique
        if (certificateCode == null) {
            certificateCode = "CERT-" + System.currentTimeMillis();
        }
    }
}
