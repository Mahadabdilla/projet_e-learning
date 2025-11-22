package com.eduafrica.repository;

import com.eduafrica.model.FileUpload;
import com.eduafrica.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileUploadRepository extends JpaRepository<FileUpload, Long> {
    
    Optional<FileUpload> findByStoredFileName(String storedFileName);
    
    List<FileUpload> findByUploadedBy(User user);
    
    List<FileUpload> findByFileType(String fileType);
}



