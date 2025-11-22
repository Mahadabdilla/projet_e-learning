package com.eduafrica.service;

import com.eduafrica.model.MentorProfile;
import com.eduafrica.model.MentoringRequest;
import com.eduafrica.model.User;
import com.eduafrica.model.enums.MentoringStatus;
import com.eduafrica.repository.MentorProfileRepository;
import com.eduafrica.repository.MentoringRequestRepository;
import com.eduafrica.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MentorService {
    
    @Autowired
    private MentorProfileRepository mentorProfileRepository;
    
    @Autowired
    private MentoringRequestRepository mentoringRequestRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Page<MentorProfile> getAllMentors(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("rating").descending());
        return mentorProfileRepository.findAll(pageable);
    }
    
    public Page<MentorProfile> getAvailableMentors(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("rating").descending());
        return mentorProfileRepository.findByIsAvailable(true, pageable);
    }
    
    public Page<MentorProfile> searchMentors(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("rating").descending());
        return mentorProfileRepository.searchByKeyword(keyword, pageable);
    }
    
    public MentorProfile getMentorById(Long id) {
        return mentorProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mentor not found with id: " + id));
    }
    
    /**
     * Récupérer le profil mentor d'un utilisateur
     */
    public MentorProfile getMentorProfileByUserEmail(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return mentorProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profil mentor non trouvé"));
    }
    
    /**
     * Obtenir les statistiques du mentor
     */
    public Map<String, Object> getMentorStats(String userEmail) {
        MentorProfile mentorProfile = getMentorProfileByUserEmail(userEmail);
        List<MentoringRequest> allRequests = mentoringRequestRepository.findByMentorProfile(mentorProfile);
        
        long pendingRequests = allRequests.stream()
                .filter(req -> req.getStatus() == MentoringStatus.PENDING)
                .count();
        
        long acceptedRequests = allRequests.stream()
                .filter(req -> req.getStatus() == MentoringStatus.ACCEPTED)
                .count();
        
        long completedSessions = allRequests.stream()
                .filter(req -> req.getStatus() == MentoringStatus.COMPLETED)
                .count();
        
        long rejectedRequests = allRequests.stream()
                .filter(req -> req.getStatus() == MentoringStatus.REJECTED)
                .count();
        
        // Compter les mentees uniques
        long uniqueMentees = allRequests.stream()
                .map(MentoringRequest::getApprenant)
                .distinct()
                .count();
        
        // Revenus estimés (basé sur le tarif horaire et les séances complétées)
        double estimatedRevenue = completedSessions * (mentorProfile.getHourlyRate() != null ? mentorProfile.getHourlyRate().doubleValue() : 0.0);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("mentorProfile", mentorProfile);
        stats.put("pendingRequests", pendingRequests);
        stats.put("acceptedRequests", acceptedRequests);
        stats.put("completedSessions", completedSessions);
        stats.put("rejectedRequests", rejectedRequests);
        stats.put("uniqueMentees", uniqueMentees);
        stats.put("estimatedRevenue", estimatedRevenue);
        stats.put("totalRequests", allRequests.size());
        stats.put("averageRating", mentorProfile.getRating());
        
        return stats;
    }
    
    /**
     * Mettre à jour la disponibilité du mentor
     */
    public MentorProfile updateAvailability(String userEmail, boolean isAvailable) {
        MentorProfile mentorProfile = getMentorProfileByUserEmail(userEmail);
        mentorProfile.setIsAvailable(isAvailable);
        return mentorProfileRepository.save(mentorProfile);
    }
}

