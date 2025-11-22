package com.eduafrica.repository;

import com.eduafrica.model.Formation;
import com.eduafrica.model.Review;
import com.eduafrica.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByFormation(Formation formation);
    
    List<Review> findByFormationAndIsApprovedTrue(Formation formation);
    
    List<Review> findByUser(User user);
    
    Optional<Review> findByUserAndFormation(User user, Formation formation);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.formation = :formation AND r.isApproved = true")
    Double calculateAverageRating(@Param("formation") Formation formation);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.formation = :formation AND r.isApproved = true")
    Long countByFormationAndIsApprovedTrue(@Param("formation") Formation formation);
    
    List<Review> findByIsApprovedFalse();
}



