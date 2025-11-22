package com.eduafrica.repository;

import com.eduafrica.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
    List<Module> findByFormationIdOrderByOrderAsc(Long formationId);
    
    List<Module> findByFormation(com.eduafrica.model.Formation formation);
}


