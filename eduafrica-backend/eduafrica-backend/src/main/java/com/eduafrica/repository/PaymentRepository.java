package com.eduafrica.repository;

import com.eduafrica.model.Formation;
import com.eduafrica.model.Payment;
import com.eduafrica.model.User;
import com.eduafrica.model.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUser(User user);
    List<Payment> findByFormation(Formation formation);
    List<Payment> findByStatus(PaymentStatus status);
    Optional<Payment> findByTransactionId(String transactionId);
    Optional<Payment> findByUserAndFormationAndStatus(User user, Formation formation, PaymentStatus status);
    Boolean existsByUserAndFormationAndStatus(User user, Formation formation, PaymentStatus status);
    Long countByStatus(PaymentStatus status);
}

