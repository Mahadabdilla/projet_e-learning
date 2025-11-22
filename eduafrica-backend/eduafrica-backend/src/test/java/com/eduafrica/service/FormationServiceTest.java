package com.eduafrica.service;

import com.eduafrica.dto.FormateurStatsResponse;
import com.eduafrica.model.Formation;
import com.eduafrica.model.User;
import com.eduafrica.model.enums.FormationCategory;
import com.eduafrica.model.enums.FormationLevel;
import com.eduafrica.model.enums.Role;
import com.eduafrica.repository.FormationRepository;
import com.eduafrica.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests du service FormationService")
class FormationServiceTest {
    
    @Mock
    private FormationRepository formationRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private FormationService formationService;
    
    private User testFormateur;
    private Formation testFormation;
    
    @BeforeEach
    void setUp() {
        testFormateur = User.builder()
                .id(1L)
                .email("formateur@eduafrica.com")
                .firstName("Formateur")
                .lastName("Test")
                .role(Role.FORMATEUR)
                .build();
        
        testFormation = Formation.builder()
                .id(1L)
                .title("Formation Test")
                .description("Description test")
                .category(FormationCategory.DEVELOPPEMENT)
                .level(FormationLevel.DEBUTANT)
                .price(BigDecimal.valueOf(5000))
                .duration(10)
                .formateur(testFormateur)
                .build();
    }
    
    @Test
    @DisplayName("Devrait créer une formation avec succès")
    void shouldCreateFormationSuccessfully() {
        // Given
        when(userRepository.findByEmail("formateur@eduafrica.com"))
                .thenReturn(Optional.of(testFormateur));
        when(formationRepository.save(any(Formation.class))).thenAnswer(invocation -> {
            Formation f = invocation.getArgument(0);
            f.setId(1L);
            return f;
        });
        
        // When
        Formation created = formationService.createFormation(testFormation, "formateur@eduafrica.com");
        
        // Then
        assertNotNull(created);
        assertEquals(testFormateur, created.getFormateur());
        verify(formationRepository).save(any(Formation.class));
    }
    
    @Test
    @DisplayName("Devrait lancer une exception si le formateur n'existe pas")
    void shouldThrowExceptionIfFormateurNotFound() {
        // Given
        when(userRepository.findByEmail("formateur@eduafrica.com"))
                .thenReturn(Optional.empty());
        
        // When & Then
        assertThrows(RuntimeException.class, () -> {
            formationService.createFormation(testFormation, "formateur@eduafrica.com");
        });
        
        verify(formationRepository, never()).save(any());
    }
    
    @Test
    @DisplayName("Devrait mettre à jour une formation avec succès")
    void shouldUpdateFormationSuccessfully() {
        // Given
        Formation updatedDetails = Formation.builder()
                .title("Formation Mise à Jour")
                .description("Nouvelle description")
                .category(FormationCategory.MARKETING)
                .level(FormationLevel.INTERMEDIAIRE)
                .price(BigDecimal.valueOf(7000))
                .duration(15)
                .build();
        
        when(formationRepository.findById(1L)).thenReturn(Optional.of(testFormation));
        when(formationRepository.save(any(Formation.class))).thenReturn(testFormation);
        
        // When
        Formation updated = formationService.updateFormation(1L, updatedDetails);
        
        // Then
        assertNotNull(updated);
        assertEquals("Formation Mise à Jour", updated.getTitle());
        assertEquals("Nouvelle description", updated.getDescription());
        verify(formationRepository).save(any(Formation.class));
    }
    
    @Test
    @DisplayName("Devrait lancer une exception si la formation n'existe pas lors de la mise à jour")
    void shouldThrowExceptionIfFormationNotFoundOnUpdate() {
        // Given
        when(formationRepository.findById(1L)).thenReturn(Optional.empty());
        
        // When & Then
        assertThrows(RuntimeException.class, () -> {
            formationService.updateFormation(1L, testFormation);
        });
    }
    
    @Test
    @DisplayName("Devrait supprimer une formation")
    void shouldDeleteFormation() {
        // Given
        doNothing().when(formationRepository).deleteById(1L);
        
        // When
        formationService.deleteFormation(1L);
        
        // Then
        verify(formationRepository).deleteById(1L);
    }
    
    @Test
    @DisplayName("Devrait récupérer une formation par ID")
    void shouldGetFormationById() {
        // Given
        when(formationRepository.findById(1L)).thenReturn(Optional.of(testFormation));
        
        // When
        Formation found = formationService.getFormationById(1L);
        
        // Then
        assertNotNull(found);
        assertEquals(1L, found.getId());
        assertEquals("Formation Test", found.getTitle());
    }
    
    @Test
    @DisplayName("Devrait lancer une exception si la formation n'existe pas")
    void shouldThrowExceptionIfFormationNotFound() {
        // Given
        when(formationRepository.findById(1L)).thenReturn(Optional.empty());
        
        // When & Then
        assertThrows(RuntimeException.class, () -> {
            formationService.getFormationById(1L);
        });
    }
    
    @Test
    @DisplayName("Devrait récupérer toutes les formations avec pagination")
    void shouldGetAllFormationsWithPagination() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<Formation> page = new PageImpl<>(Arrays.asList(testFormation), pageable, 1);
        when(formationRepository.findAllWithFormateur(any(Pageable.class))).thenReturn(page);
        
        // When
        Page<Formation> result = formationService.getAllFormations(0, 10);
        
        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(formationRepository).findAllWithFormateur(any(Pageable.class));
    }
    
    @Test
    @DisplayName("Devrait rechercher des formations par mot-clé")
    void shouldSearchFormationsByKeyword() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<Formation> page = new PageImpl<>(Arrays.asList(testFormation), pageable, 1);
        when(formationRepository.searchByKeyword("test", pageable)).thenReturn(page);
        
        // When
        Page<Formation> result = formationService.searchFormations("test", 0, 10);
        
        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(formationRepository).searchByKeyword("test", pageable);
    }
    
    @Test
    @DisplayName("Devrait filtrer les formations par catégorie, niveau et prix")
    void shouldFilterFormationsByCategoryLevelAndPrice() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<Formation> page = new PageImpl<>(Arrays.asList(testFormation), pageable, 1);
        when(formationRepository.findByFilters(
                FormationCategory.DEVELOPPEMENT,
                FormationLevel.DEBUTANT,
                false,
                pageable
        )).thenReturn(page);
        
        // When
        Page<Formation> result = formationService.getFormationsByFilters(
                FormationCategory.DEVELOPPEMENT,
                FormationLevel.DEBUTANT,
                false,
                0,
                10
        );
        
        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(formationRepository).findByFilters(
                FormationCategory.DEVELOPPEMENT,
                FormationLevel.DEBUTANT,
                false,
                pageable
        );
    }
    
    @Test
    @DisplayName("Devrait récupérer les formations d'un formateur")
    void shouldGetFormationsByFormateur() {
        // Given
        List<Formation> formations = Arrays.asList(testFormation);
        when(userRepository.findByEmail("formateur@eduafrica.com"))
                .thenReturn(Optional.of(testFormateur));
        when(formationRepository.findByFormateur(testFormateur)).thenReturn(formations);
        
        // When
        List<Formation> result = formationService.getFormationsByFormateur("formateur@eduafrica.com");
        
        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(formationRepository).findByFormateur(testFormateur);
    }
    
    @Test
    @DisplayName("Devrait calculer les statistiques d'un formateur")
    void shouldCalculateFormateurStats() {
        // Given
        Formation formation2 = Formation.builder()
                .id(2L)
                .title("Formation 2")
                .nbStudents(5)
                .averageRating(4.5)
                .price(BigDecimal.valueOf(3000))
                .formateur(testFormateur)
                .build();
        
        testFormation.setNbStudents(10);
        testFormation.setAverageRating(4.8);
        
        List<Formation> formations = Arrays.asList(testFormation, formation2);
        when(userRepository.findByEmail("formateur@eduafrica.com"))
                .thenReturn(Optional.of(testFormateur));
        when(formationRepository.findByFormateur(testFormateur)).thenReturn(formations);
        
        // When
        FormateurStatsResponse stats = formationService.getFormateurStats("formateur@eduafrica.com");
        
        // Then
        assertNotNull(stats);
        assertEquals(2, stats.getTotalFormations());
        assertEquals(15, stats.getTotalStudents());
        assertEquals(4.65, stats.getAverageRating(), 0.01);
        verify(formationRepository).findByFormateur(testFormateur);
    }
}

