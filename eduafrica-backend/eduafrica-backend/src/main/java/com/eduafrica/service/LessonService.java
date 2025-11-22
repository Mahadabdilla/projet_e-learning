package com.eduafrica.service;

import com.eduafrica.model.Lesson;
import com.eduafrica.model.Module;
import com.eduafrica.repository.LessonRepository;
import com.eduafrica.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LessonService {
    
    @Autowired
    private LessonRepository lessonRepository;
    
    @Autowired
    private ModuleRepository moduleRepository;
    
    public List<Lesson> getLessonsByModuleId(Long moduleId) {
        return lessonRepository.findByModuleIdOrderByOrderAsc(moduleId);
    }
    
    public List<Lesson> getLessonsByFormationId(Long formationId) {
        return lessonRepository.findByModuleFormationId(formationId);
    }
    
    @Transactional
    public Lesson createLesson(Lesson lesson, Long moduleId, String userEmail) {
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module non trouvé"));
        
        // Vérifier que l'utilisateur est le formateur
        if (!module.getFormation().getFormateur().getEmail().equals(userEmail)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier cette formation");
        }
        
        lesson.setModule(module);
        return lessonRepository.save(lesson);
    }
    
    @Transactional
    public Lesson updateLesson(Long lessonId, Lesson lessonData, String userEmail) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Leçon non trouvée"));
        
        // Vérifier que l'utilisateur est le formateur
        if (!lesson.getModule().getFormation().getFormateur().getEmail().equals(userEmail)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier cette leçon");
        }
        
        lesson.setTitle(lessonData.getTitle());
        lesson.setContent(lessonData.getContent());
        lesson.setOrder(lessonData.getOrder());
        lesson.setLessonType(lessonData.getLessonType());
        lesson.setVideoUrl(lessonData.getVideoUrl());
        lesson.setDurationMinutes(lessonData.getDurationMinutes());
        lesson.setIsFreePreview(lessonData.getIsFreePreview());
        
        return lessonRepository.save(lesson);
    }
    
    @Transactional
    public void deleteLesson(Long lessonId, String userEmail) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Leçon non trouvée"));
        
        // Vérifier que l'utilisateur est le formateur
        if (!lesson.getModule().getFormation().getFormateur().getEmail().equals(userEmail)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à supprimer cette leçon");
        }
        
        lessonRepository.delete(lesson);
    }
}




