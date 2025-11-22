package com.eduafrica.repository;

import com.eduafrica.model.ExerciseSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExerciseSubmissionRepository extends JpaRepository<ExerciseSubmission, Long> {
    List<ExerciseSubmission> findByUserIdAndExerciseId(Long userId, Long exerciseId);
    Optional<ExerciseSubmission> findFirstByUserIdAndExerciseIdOrderBySubmittedAtDesc(Long userId, Long exerciseId);
}


