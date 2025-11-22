package com.eduafrica.repository;

import com.eduafrica.model.MentoringRequest;
import com.eduafrica.model.MentorProfile;
import com.eduafrica.model.User;
import com.eduafrica.model.enums.MentoringStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentoringRequestRepository extends JpaRepository<MentoringRequest, Long> {
    List<MentoringRequest> findByMentorProfile(MentorProfile mentorProfile);
    List<MentoringRequest> findByApprenant(User apprenant);
    List<MentoringRequest> findByStatus(MentoringStatus status);
    List<MentoringRequest> findByMentorProfileAndStatus(MentorProfile mentorProfile, MentoringStatus status);
}
