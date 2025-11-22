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
public class BlockchainTransaction {
    private String transactionHash;
    private Long blockNumber;
    private LocalDateTime timestamp;
    private String status; // PENDING, CONFIRMED, FAILED
}


