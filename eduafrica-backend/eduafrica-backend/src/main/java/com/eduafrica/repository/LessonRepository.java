package com.eduafrica.repository;

import com.eduafrica.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByModuleIdOrderByOrderAsc(Long moduleId);
    List<Lesson> findByModuleFormationId(Long formationId);
}




