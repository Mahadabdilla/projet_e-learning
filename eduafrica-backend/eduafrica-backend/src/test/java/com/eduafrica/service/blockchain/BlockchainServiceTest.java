package com.eduafrica.service.blockchain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
    "blockchain.network=local",
    "blockchain.contract.address="
})
@DisplayName("Tests du service Blockchain")
class BlockchainServiceTest {
    
    @Autowired
    private BlockchainService blockchainService;
    
    private Long testCertificateId;
    private Long testUserId;
    private Long testFormationId;
    private String testCertificateCode;
    private LocalDateTime testIssuedAt;
    
    @BeforeEach
    void setUp() {
        testCertificateId = 1L;
        testUserId = 100L;
        testFormationId = 200L;
        testCertificateCode = "CERT-TEST-12345";
        testIssuedAt = LocalDateTime.now();
    }
    
    @Test
    @DisplayName("Devrait générer un hash SHA-256 valide pour un certificat")
    void shouldGenerateValidCertificateHash() {
        // When
        String hash = blockchainService.generateCertificateHash(
            testCertificateId,
            testUserId,
            testFormationId,
            testCertificateCode,
            testIssuedAt
        );
        
        // Then
        assertNotNull(hash, "Le hash ne doit pas être null");
        assertFalse(hash.isEmpty(), "Le hash ne doit pas être vide");
        assertEquals(64, hash.length(), "Un hash SHA-256 doit avoir 64 caractères hexadécimaux");
        assertTrue(hash.matches("[0-9a-f]{64}"), "Le hash doit être en hexadécimal");
    }
    
    @Test
    @DisplayName("Devrait générer des hash différents pour des certificats différents")
    void shouldGenerateDifferentHashesForDifferentCertificates() {
        // When
        String hash1 = blockchainService.generateCertificateHash(
            1L, 100L, 200L, "CERT-1", testIssuedAt
        );
        String hash2 = blockchainService.generateCertificateHash(
            2L, 100L, 200L, "CERT-2", testIssuedAt
        );
        
        // Then
        assertNotEquals(hash1, hash2, "Les hash doivent être différents pour des certificats différents");
    }
    
    @Test
    @DisplayName("Devrait générer le même hash pour les mêmes données")
    void shouldGenerateSameHashForSameData() {
        // When
        String hash1 = blockchainService.generateCertificateHash(
            testCertificateId,
            testUserId,
            testFormationId,
            testCertificateCode,
            testIssuedAt
        );
        String hash2 = blockchainService.generateCertificateHash(
            testCertificateId,
            testUserId,
            testFormationId,
            testCertificateCode,
            testIssuedAt
        );
        
        // Then
        assertEquals(hash1, hash2, "Le même certificat doit générer le même hash");
    }
    
    @Test
    @DisplayName("Devrait enregistrer un certificat sur la blockchain")
    void shouldRegisterCertificateOnBlockchain() {
        // Given
        String certificateHash = blockchainService.generateCertificateHash(
            testCertificateId,
            testUserId,
            testFormationId,
            testCertificateCode,
            testIssuedAt
        );
        
        // When
        BlockchainTransaction transaction = blockchainService.registerCertificate(
            certificateHash,
            testCertificateId
        );
        
        // Then
        assertNotNull(transaction, "La transaction ne doit pas être null");
        assertNotNull(transaction.getTransactionHash(), "Le hash de transaction ne doit pas être null");
        assertNotNull(transaction.getBlockNumber(), "Le numéro de bloc ne doit pas être null");
        assertEquals(1L, transaction.getBlockNumber(), "Le premier bloc doit être numéro 1");
        assertEquals("CONFIRMED", transaction.getStatus(), "Le statut doit être CONFIRMED");
        assertNotNull(transaction.getTimestamp(), "Le timestamp ne doit pas être null");
    }
    
    @Test
    @DisplayName("Devrait vérifier qu'un certificat existe sur la blockchain")
    void shouldVerifyCertificateExistsOnBlockchain() {
        // Given
        String certificateHash = blockchainService.generateCertificateHash(
            testCertificateId,
            testUserId,
            testFormationId,
            testCertificateCode,
            testIssuedAt
        );
        blockchainService.registerCertificate(certificateHash, testCertificateId);
        
        // When
        boolean exists = blockchainService.verifyCertificate(certificateHash);
        
        // Then
        assertTrue(exists, "Le certificat doit exister sur la blockchain");
    }
    
    @Test
    @DisplayName("Devrait retourner false pour un certificat non enregistré")
    void shouldReturnFalseForUnregisteredCertificate() {
        // Given
        String fakeHash = "fakehash123456789012345678901234567890123456789012345678901234567890";
        
        // When
        boolean exists = blockchainService.verifyCertificate(fakeHash);
        
        // Then
        assertFalse(exists, "Un certificat non enregistré ne doit pas exister");
    }
    
    @Test
    @DisplayName("Devrait récupérer les détails d'un certificat sur la blockchain")
    void shouldGetCertificateRecordFromBlockchain() {
        // Given
        String certificateHash = blockchainService.generateCertificateHash(
            testCertificateId,
            testUserId,
            testFormationId,
            testCertificateCode,
            testIssuedAt
        );
        blockchainService.registerCertificate(certificateHash, testCertificateId);
        
        // When
        BlockchainRecord record = blockchainService.getCertificateRecord(certificateHash);
        
        // Then
        assertNotNull(record, "Le record ne doit pas être null");
        assertEquals(certificateHash, record.getCertificateHash(), "Le hash doit correspondre");
        assertEquals(testCertificateId, record.getCertificateId(), "L'ID du certificat doit correspondre");
        assertNotNull(record.getHash(), "Le hash du bloc ne doit pas être null");
        assertNotNull(record.getPreviousHash(), "Le hash précédent ne doit pas être null");
        assertEquals(1L, record.getBlockNumber(), "Le numéro de bloc doit être 1");
    }
    
    @Test
    @DisplayName("Devrait créer une chaîne de blocs avec previousHash")
    void shouldCreateBlockchainWithPreviousHash() {
        // Given - Enregistrer le premier certificat
        String hash1 = blockchainService.generateCertificateHash(
            1L, 100L, 200L, "CERT-1", testIssuedAt
        );
        BlockchainTransaction tx1 = blockchainService.registerCertificate(hash1, 1L);
        
        // When - Enregistrer un deuxième certificat
        String hash2 = blockchainService.generateCertificateHash(
            2L, 101L, 201L, "CERT-2", testIssuedAt
        );
        BlockchainTransaction tx2 = blockchainService.registerCertificate(hash2, 2L);
        
        // Then
        assertEquals(1L, tx1.getBlockNumber(), "Le premier bloc doit être numéro 1");
        assertEquals(2L, tx2.getBlockNumber(), "Le deuxième bloc doit être numéro 2");
        
        BlockchainRecord record1 = blockchainService.getCertificateRecord(hash1);
        BlockchainRecord record2 = blockchainService.getCertificateRecord(hash2);
        
        assertNotNull(record1.getHash(), "Le premier bloc doit avoir un hash");
        assertEquals(record1.getHash(), record2.getPreviousHash(), 
            "Le previousHash du bloc 2 doit être le hash du bloc 1");
    }
    
    @Test
    @DisplayName("Devrait récupérer l'historique complet de la blockchain")
    void shouldGetBlockchainHistory() {
        // Given - Enregistrer plusieurs certificats
        String hash1 = blockchainService.generateCertificateHash(1L, 100L, 200L, "CERT-1", testIssuedAt);
        String hash2 = blockchainService.generateCertificateHash(2L, 101L, 201L, "CERT-2", testIssuedAt);
        String hash3 = blockchainService.generateCertificateHash(3L, 102L, 202L, "CERT-3", testIssuedAt);
        
        blockchainService.registerCertificate(hash1, 1L);
        blockchainService.registerCertificate(hash2, 2L);
        blockchainService.registerCertificate(hash3, 3L);
        
        // When
        java.util.List<BlockchainRecord> history = blockchainService.getBlockchainHistory();
        
        // Then
        assertNotNull(history, "L'historique ne doit pas être null");
        assertEquals(3, history.size(), "L'historique doit contenir 3 enregistrements");
        assertEquals(1L, history.get(0).getBlockNumber(), "Le premier bloc doit être numéro 1");
        assertEquals(2L, history.get(1).getBlockNumber(), "Le deuxième bloc doit être numéro 2");
        assertEquals(3L, history.get(2).getBlockNumber(), "Le troisième bloc doit être numéro 3");
    }
    
    @Test
    @DisplayName("Devrait récupérer le dernier bloc")
    void shouldGetLatestBlock() {
        // Given - Enregistrer plusieurs certificats
        String hash1 = blockchainService.generateCertificateHash(1L, 100L, 200L, "CERT-1", testIssuedAt);
        String hash2 = blockchainService.generateCertificateHash(2L, 101L, 201L, "CERT-2", testIssuedAt);
        
        blockchainService.registerCertificate(hash1, 1L);
        blockchainService.registerCertificate(hash2, 2L);
        
        // When
        BlockchainRecord latestBlock = blockchainService.getLatestBlock();
        
        // Then
        assertNotNull(latestBlock, "Le dernier bloc ne doit pas être null");
        assertEquals(2L, latestBlock.getBlockNumber(), "Le dernier bloc doit être numéro 2");
        assertEquals(hash2, latestBlock.getCertificateHash(), "Le hash doit correspondre au dernier certificat");
    }
    
    @Test
    @DisplayName("Devrait retourner null pour le dernier bloc si la blockchain est vide")
    void shouldReturnNullForLatestBlockWhenBlockchainIsEmpty() {
        // When - Créer un nouveau service (blockchain vide)
        BlockchainService newService = new BlockchainService();
        
        // Then
        assertNull(newService.getLatestBlock(), "Le dernier bloc doit être null si la blockchain est vide");
    }
}

