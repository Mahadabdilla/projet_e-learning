package com.eduafrica.service;

import com.eduafrica.model.Formation;
import com.eduafrica.model.Module;
import com.eduafrica.repository.FormationRepository;
import com.eduafrica.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ModuleService {
    
    @Autowired
    private ModuleRepository moduleRepository;
    
    @Autowired
    private FormationRepository formationRepository;
    
    public List<Module> getModulesByFormationId(Long formationId) {
        return moduleRepository.findByFormationIdOrderByOrderAsc(formationId);
    }
    
    @Transactional
    public Module createModule(Module module, Long formationId, String userEmail) {
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation non trouvée"));
        
        // Vérifier que l'utilisateur est le formateur
        if (!formation.getFormateur().getEmail().equals(userEmail)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier cette formation");
        }
        
        module.setFormation(formation);
        return moduleRepository.save(module);
    }
    
    @Transactional
    public Module updateModule(Long moduleId, Module moduleData, String userEmail) {
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module non trouvé"));
        
        // Vérifier que l'utilisateur est le formateur
        if (!module.getFormation().getFormateur().getEmail().equals(userEmail)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier ce module");
        }
        
        module.setTitle(moduleData.getTitle());
        module.setDescription(moduleData.getDescription());
        module.setOrder(moduleData.getOrder());
        
        return moduleRepository.save(module);
    }
    
    @Transactional
    public void deleteModule(Long moduleId, String userEmail) {
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module non trouvé"));
        
        // Vérifier que l'utilisateur est le formateur
        if (!module.getFormation().getFormateur().getEmail().equals(userEmail)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à supprimer ce module");
        }
        
        moduleRepository.delete(module);
    }
}




