package com.eduafrica.repository;

import com.eduafrica.model.MentorProfile;
import com.eduafrica.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MentorProfileRepository extends JpaRepository<MentorProfile, Long> {
    Optional<MentorProfile> findByUser(User user);
    
    @EntityGraph(attributePaths = {"user"})
    Page<MentorProfile> findAll(Pageable pageable);
    
    @EntityGraph(attributePaths = {"user"})
    Page<MentorProfile> findByIsAvailable(Boolean isAvailable, Pageable pageable);
    
    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT m FROM MentorProfile m WHERE " +
           "LOWER(m.specialty) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.bio) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<MentorProfile> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    Long countByIsAvailable(Boolean isAvailable);
}
