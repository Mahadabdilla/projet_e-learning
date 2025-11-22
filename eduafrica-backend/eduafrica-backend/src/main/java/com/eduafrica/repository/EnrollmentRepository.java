package com.eduafrica.repository;

import com.eduafrica.model.Enrollment;
import com.eduafrica.model.Formation;
import com.eduafrica.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByUser(User user);
    
    @EntityGraph(attributePaths = {"user"})
    List<Enrollment> findByFormation(Formation formation);
    
    Optional<Enrollment> findByUserAndFormation(User user, Formation formation);
    Boolean existsByUserAndFormation(User user, Formation formation);
    Long countByFormation(Formation formation);
}
