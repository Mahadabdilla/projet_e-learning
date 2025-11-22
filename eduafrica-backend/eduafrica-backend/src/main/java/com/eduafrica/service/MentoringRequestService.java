package com.eduafrica.service;

import com.eduafrica.model.MentorProfile;
import com.eduafrica.model.MentoringRequest;
import com.eduafrica.model.User;
import com.eduafrica.model.enums.MentoringStatus;
import com.eduafrica.repository.MentorProfileRepository;
import com.eduafrica.repository.MentoringRequestRepository;
import com.eduafrica.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MentoringRequestService {
    
    @Autowired
    private MentoringRequestRepository mentoringRequestRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MentorProfileRepository mentorProfileRepository;
    
    @Autowired(required = false)
    private NotificationService notificationService;
    
    @Transactional
    public MentoringRequest createMentoringRequest(Long mentorProfileId, String userEmail, String message) {
        User apprenant = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        MentorProfile mentorProfile = mentorProfileRepository.findById(mentorProfileId)
                .orElseThrow(() -> new RuntimeException("Mentor non trouvé"));
        
        // Vérifier que le mentor est disponible
        if (mentorProfile.getIsAvailable() == null || !mentorProfile.getIsAvailable()) {
            throw new RuntimeException("Ce mentor n'est pas disponible pour le moment");
        }
        
        // Vérifier qu'il n'y a pas déjà une demande en attente
        List<MentoringRequest> pendingRequests = mentoringRequestRepository
                .findByMentorProfileAndStatus(mentorProfile, MentoringStatus.PENDING);
        boolean hasPendingRequest = pendingRequests.stream()
                .anyMatch(req -> req.getApprenant().getId().equals(apprenant.getId()));
        
        if (hasPendingRequest) {
            throw new RuntimeException("Vous avez déjà une demande en attente pour ce mentor");
        }
        
        MentoringRequest request = MentoringRequest.builder()
                .mentorProfile(mentorProfile)
                .apprenant(apprenant)
                .message(message)
                .status(MentoringStatus.PENDING)
                .build();
        
        request = mentoringRequestRepository.save(request);
        
        // Créer une notification pour le mentor
        if (notificationService != null) {
            notificationService.createNotification(
                    mentorProfile.getUser().getId(),
                    com.eduafrica.model.enums.NotificationType.MENTORING_REQUEST,
                    "Nouvelle demande de mentorat",
                    apprenant.getFirstName() + " " + apprenant.getLastName() + " vous a envoyé une demande de mentorat.",
                    "/mentoring-requests/" + request.getId()
            );
        }
        
        return request;
    }
    
    public List<MentoringRequest> getMyMentoringRequests(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return mentoringRequestRepository.findByApprenant(user);
    }
    
    public List<MentoringRequest> getMentorRequests(Long mentorProfileId) {
        MentorProfile mentorProfile = mentorProfileRepository.findById(mentorProfileId)
                .orElseThrow(() -> new RuntimeException("Mentor non trouvé"));
        return mentoringRequestRepository.findByMentorProfile(mentorProfile);
    }
    
    /**
     * Récupérer les demandes de mentorat pour le mentor connecté
     */
    public List<MentoringRequest> getMyMentorRequests(String mentorEmail) {
        User mentorUser = userRepository.findByEmail(mentorEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur mentor non trouvé"));
        MentorProfile mentorProfile = mentorProfileRepository.findByUser(mentorUser)
                .orElseThrow(() -> new RuntimeException("Profil de mentor non trouvé pour cet utilisateur"));
        return mentoringRequestRepository.findByMentorProfile(mentorProfile);
    }
    
    @Transactional
    public MentoringRequest updateRequestStatus(Long requestId, MentoringStatus status) {
        MentoringRequest request = mentoringRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée"));
        
        request.setStatus(status);
        request = mentoringRequestRepository.save(request);
        
        // Créer une notification pour l'apprenant selon le statut
        if (notificationService != null) {
            com.eduafrica.model.enums.NotificationType notificationType = null;
            String title = "";
            String message = "";
            
            if (status == MentoringStatus.ACCEPTED) {
                notificationType = com.eduafrica.model.enums.NotificationType.MENTORING_ACCEPTED;
                title = "Demande de mentorat acceptée";
                message = "Votre demande de mentorat avec " + request.getMentorProfile().getUser().getFirstName() + " " + request.getMentorProfile().getUser().getLastName() + " a été acceptée.";
            } else if (status == MentoringStatus.REJECTED) {
                notificationType = com.eduafrica.model.enums.NotificationType.MENTORING_REJECTED;
                title = "Demande de mentorat rejetée";
                message = "Votre demande de mentorat avec " + request.getMentorProfile().getUser().getFirstName() + " " + request.getMentorProfile().getUser().getLastName() + " a été rejetée.";
            }
            
            if (notificationType != null) {
                notificationService.createNotification(
                        request.getApprenant().getId(),
                        notificationType,
                        title,
                        message,
                        "/mentoring-requests/" + request.getId()
                );
            }
        }
        
        return request;
    }
    
    public MentoringRequest getRequestById(Long requestId) {
        return mentoringRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée"));
    }
}

