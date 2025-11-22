package com.eduafrica.repository;

import com.eduafrica.model.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
    Optional<LessonProgress> findByEnrollmentIdAndLessonId(Long enrollmentId, Long lessonId);
    List<LessonProgress> findByEnrollmentId(Long enrollmentId);
    Long countByEnrollmentIdAndIsCompletedTrue(Long enrollmentId);
}




