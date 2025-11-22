package com.eduafrica.repository;

import com.eduafrica.model.Formation;
import com.eduafrica.model.User;
import com.eduafrica.model.enums.FormationCategory;
import com.eduafrica.model.enums.FormationLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormationRepository extends JpaRepository<Formation, Long> {
    List<Formation> findByFormateur(User formateur);
    
    Page<Formation> findByCategory(FormationCategory category, Pageable pageable);
    
    Page<Formation> findByLevel(FormationLevel level, Pageable pageable);
    
    Page<Formation> findByIsFree(Boolean isFree, Pageable pageable);
    
    boolean existsByTitle(String title);
    
    java.util.Optional<Formation> findByTitle(String title);
    
    @Query("SELECT f FROM Formation f WHERE " +
           "LOWER(f.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(f.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Formation> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT f FROM Formation f WHERE " +
           "(:category IS NULL OR f.category = :category) AND " +
           "(:level IS NULL OR f.level = :level) AND " +
           "(:isFree IS NULL OR f.isFree = :isFree)")
    Page<Formation> findByFilters(
        @Param("category") FormationCategory category,
        @Param("level") FormationLevel level,
        @Param("isFree") Boolean isFree,
        Pageable pageable
    );
    
    @Query(value = "SELECT f FROM Formation f JOIN FETCH f.formateur ORDER BY f.createdAt DESC",
           countQuery = "SELECT COUNT(f) FROM Formation f")
    org.springframework.data.domain.Page<Formation> findAllWithFormateur(Pageable pageable);
    
    Long countByIsFree(Boolean isFree);
}
