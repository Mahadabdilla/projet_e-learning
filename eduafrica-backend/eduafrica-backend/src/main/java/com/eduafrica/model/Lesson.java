package com.eduafrica.model;

import com.eduafrica.model.enums.LessonType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "lessons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Le titre de la leçon est obligatoire")
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "lesson_order", nullable = false)
    @NotNull(message = "L'ordre de la leçon est obligatoire")
    private Integer order;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "lesson_type", nullable = false)
    @Builder.Default
    private LessonType lessonType = LessonType.VIDEO;
    
    @Column(name = "video_url")
    private String videoUrl;
    
    @Column(name = "duration_minutes")
    private Integer durationMinutes;
    
    @Column(name = "is_free_preview")
    @Builder.Default
    private Boolean isFreePreview = false;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}




