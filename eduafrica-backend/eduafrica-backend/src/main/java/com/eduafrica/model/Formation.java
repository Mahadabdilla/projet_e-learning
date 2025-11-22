package com.eduafrica.model;

import com.eduafrica.model.enums.FormationCategory;
import com.eduafrica.model.enums.FormationLevel;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "formations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Formation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Le titre est obligatoire")
    @Column(nullable = false, length = 500)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String programme;
    
    @Enumerated(EnumType.STRING)
    @NotNull(message = "La catégorie est obligatoire")
    @Column(nullable = false)
    private FormationCategory category;
    
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Le niveau est obligatoire")
    @Column(nullable = false)
    private FormationLevel level;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "is_free")
    private Boolean isFree = false;
    
    @Column(nullable = false)
    private Integer duration; // en heures
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "formateur_id", nullable = false)
    private User formateur;
    
    @ElementCollection
    @CollectionTable(name = "formation_tags", joinColumns = @JoinColumn(name = "formation_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();
    
    @Column(name = "average_rating")
    private Double averageRating = 0.0;
    
    @Column(name = "nb_students")
    private Integer nbStudents = 0;
    
    @Column(name = "image_url", length = 1000)
    private String imageUrl;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isFree == null) {
            isFree = (price == null || price.compareTo(BigDecimal.ZERO) == 0);
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
