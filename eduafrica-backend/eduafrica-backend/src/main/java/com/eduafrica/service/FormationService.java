package com.eduafrica.service;

import com.eduafrica.dto.FormateurStatsResponse;
import com.eduafrica.model.Formation;
import com.eduafrica.model.User;
import com.eduafrica.model.enums.FormationCategory;
import com.eduafrica.model.enums.FormationLevel;
import com.eduafrica.repository.FormationRepository;
import com.eduafrica.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class FormationService {
    
    @Autowired
    private FormationRepository formationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Formation createFormation(Formation formation, String formateurEmail) {
        User formateur = userRepository.findByEmail(formateurEmail)
                .orElseThrow(() -> new RuntimeException("Formateur non trouvé"));
        
        formation.setFormateur(formateur);
        return formationRepository.save(formation);
    }
    
    public Formation updateFormation(Long id, Formation formationDetails) {
        Formation formation = formationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formation non trouvée"));
        
        formation.setTitle(formationDetails.getTitle());
        formation.setDescription(formationDetails.getDescription());
        formation.setProgramme(formationDetails.getProgramme());
        formation.setCategory(formationDetails.getCategory());
        formation.setLevel(formationDetails.getLevel());
        formation.setPrice(formationDetails.getPrice());
        formation.setDuration(formationDetails.getDuration());
        formation.setTags(formationDetails.getTags());
        formation.setImageUrl(formationDetails.getImageUrl());
        
        return formationRepository.save(formation);
    }
    
    public void deleteFormation(Long id) {
        formationRepository.deleteById(id);
    }
    
    public Formation getFormationById(Long id) {
        return formationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formation non trouvée"));
    }
    
    public Page<Formation> getAllFormations(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        // Utiliser la méthode avec JOIN FETCH pour charger le formateur
        Page<Formation> formations = formationRepository.findAllWithFormateur(pageable);
        return formations;
    }
    
    public Page<Formation> searchFormations(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return formationRepository.searchByKeyword(keyword, pageable);
    }
    
    public Page<Formation> getFormationsByFilters(
            FormationCategory category,
            FormationLevel level,
            Boolean isFree,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return formationRepository.findByFilters(category, level, isFree, pageable);
    }
    
    public List<Formation> getFormationsByFormateur(String formateurEmail) {
        User formateur = userRepository.findByEmail(formateurEmail)
                .orElseThrow(() -> new RuntimeException("Formateur non trouvé"));
        return formationRepository.findByFormateur(formateur);
    }
    
    public FormateurStatsResponse getFormateurStats(String formateurEmail) {
        User formateur = userRepository.findByEmail(formateurEmail)
                .orElseThrow(() -> new RuntimeException("Formateur non trouvé"));
        List<Formation> formations = formationRepository.findByFormateur(formateur);
        
        long totalFormations = formations.size();
        long totalStudents = formations.stream()
                .mapToLong(f -> f.getNbStudents() != null ? f.getNbStudents() : 0)
                .sum();
        
        double averageRating = formations.stream()
                .filter(f -> f.getAverageRating() != null && f.getAverageRating() > 0)
                .mapToDouble(Formation::getAverageRating)
                .average()
                .orElse(0.0);
        
        BigDecimal estimatedRevenue = formations.stream()
                .filter(f -> !f.getIsFree() && f.getPrice() != null && f.getNbStudents() != null)
                .map(f -> f.getPrice().multiply(BigDecimal.valueOf(f.getNbStudents())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return FormateurStatsResponse.builder()
                .totalFormations(totalFormations)
                .totalStudents(totalStudents)
                .averageRating(averageRating)
                .estimatedRevenue(estimatedRevenue)
                .build();
    }
}
