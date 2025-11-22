package com.eduafrica.repository;

import com.eduafrica.model.Certificate;
import com.eduafrica.model.Formation;
import com.eduafrica.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByUser(User user);
    Optional<Certificate> findByCertificateCode(String certificateCode);
    Optional<Certificate> findByUserAndFormation(User user, Formation formation);
}
