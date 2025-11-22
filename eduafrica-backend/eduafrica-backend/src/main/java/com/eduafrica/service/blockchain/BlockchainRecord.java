package com.eduafrica.service.blockchain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlockchainRecord {
    private String certificateHash;
    private Long certificateId;
    private LocalDateTime timestamp;
    private Long blockNumber;
    private String previousHash;
    private String hash;
}


