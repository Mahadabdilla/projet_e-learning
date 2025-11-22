package com.eduafrica.repository;

import com.eduafrica.model.QuizAttempt;
import com.eduafrica.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserIdAndQuizId(Long userId, Long quizId);
    Optional<QuizAttempt> findFirstByUserIdAndQuizIdOrderByStartedAtDesc(Long userId, Long quizId);
    long countByUserIdAndQuizId(Long userId, Long quizId);
}


