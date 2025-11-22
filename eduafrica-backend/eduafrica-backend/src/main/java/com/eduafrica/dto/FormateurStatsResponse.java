package com.eduafrica.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormateurStatsResponse {
    private Long totalFormations;
    private Long totalStudents;
    private Double averageRating;
    private BigDecimal estimatedRevenue;
}




