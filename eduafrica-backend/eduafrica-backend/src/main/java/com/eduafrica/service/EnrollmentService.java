package com.eduafrica.service;

import com.eduafrica.model.Enrollment;
import com.eduafrica.model.Formation;
import com.eduafrica.model.User;
import com.eduafrica.model.enums.PaymentStatus;
import com.eduafrica.repository.EnrollmentRepository;
import com.eduafrica.repository.FormationRepository;
import com.eduafrica.repository.PaymentRepository;
import com.eduafrica.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EnrollmentService {
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    @Autowired
    private FormationRepository formationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired(required = false)
    private NotificationService notificationService;
    
    @Transactional
    public Enrollment enrollToFormation(Long formationId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation non trouvée"));
        
        // Vérifier si l'utilisateur est déjà inscrit
        if (enrollmentRepository.existsByUserAndFormation(user, formation)) {
            throw new RuntimeException("Vous êtes déjà inscrit à cette formation");
        }
        
        // Si la formation est payante, vérifier que l'utilisateur a payé
        if (formation.getIsFree() == null || !formation.getIsFree()) {
            boolean hasPaid = paymentRepository.existsByUserAndFormationAndStatus(
                    user, formation, PaymentStatus.COMPLETED);
            if (!hasPaid) {
                throw new RuntimeException("Vous devez d'abord payer pour cette formation");
            }
        }
        
        // Créer l'inscription
        Enrollment enrollment = Enrollment.builder()
                .user(user)
                .formation(formation)
                .progress(0)
                .build();
        
        // Incrémenter le nombre d'étudiants
        formation.setNbStudents(formation.getNbStudents() + 1);
        formationRepository.save(formation);
        
        enrollment = enrollmentRepository.save(enrollment);
        
        // Créer une notification pour l'apprenant
        if (notificationService != null) {
            notificationService.createNotificationByEmail(
                    userEmail,
                    com.eduafrica.model.enums.NotificationType.ENROLLMENT,
                    "Inscription réussie",
                    "Vous êtes maintenant inscrit à la formation : " + formation.getTitle(),
                    "/formations/" + formationId
            );
        }
        
        return enrollment;
    }
    
    public List<Enrollment> getUserEnrollments(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return enrollmentRepository.findByUser(user);
    }
    
    public Enrollment updateProgress(Long enrollmentId, Integer progress) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée"));
        
        enrollment.setProgress(progress);
        
        // Si la progression atteint 100%, marquer comme terminé
        if (progress >= 100 && enrollment.getCompletedAt() == null) {
            enrollment.setCompletedAt(java.time.LocalDateTime.now());
            
            // Créer une notification pour la complétion
            if (notificationService != null) {
                notificationService.createNotificationByEmail(
                        enrollment.getUser().getEmail(),
                        com.eduafrica.model.enums.NotificationType.FORMATION_COMPLETED,
                        "Formation complétée !",
                        "Félicitations ! Vous avez complété la formation : " + enrollment.getFormation().getTitle() + ". Vous pouvez maintenant télécharger votre certificat.",
                        "/formations/" + enrollment.getFormation().getId() + "/certificate"
                );
            }
        }
        
        return enrollmentRepository.save(enrollment);
    }
    
    public List<Enrollment> getFormationEnrollments(Long formationId) {
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation non trouvée"));
        return enrollmentRepository.findByFormation(formation);
    }
    
    public List<Enrollment> getFormateurFormationEnrollments(Long formationId, String formateurEmail) {
        User formateur = userRepository.findByEmail(formateurEmail)
                .orElseThrow(() -> new RuntimeException("Formateur non trouvé"));
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation non trouvée"));
        
        // Vérifier que la formation appartient au formateur
        if (!formation.getFormateur().getId().equals(formateur.getId())) {
            throw new RuntimeException("Vous n'êtes pas autorisé à accéder à cette formation");
        }
        
        return enrollmentRepository.findByFormation(formation);
    }
}
