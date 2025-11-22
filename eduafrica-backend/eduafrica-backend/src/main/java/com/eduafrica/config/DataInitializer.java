package com.eduafrica.config;

import com.eduafrica.model.*;
import com.eduafrica.model.enums.*;
import com.eduafrica.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FormationRepository formationRepository;
    
    @Autowired
    private MentorProfileRepository mentorProfileRepository;
    
    @Autowired
    private ModuleRepository moduleRepository;
    
    @Autowired
    private LessonRepository lessonRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Vérifier si les données existent déjà
        long formationCount = formationRepository.count();
        boolean shouldCreateFormations = formationCount < 20;
        
        if (shouldCreateFormations) {
            System.out.println("📚 Création des formations... (" + formationCount + " formations existantes)");
        } else {
            System.out.println("✅ " + formationCount + " formations déjà présentes dans la base de données");
        }
        
        // Méthode helper pour créer une formation seulement si elle n'existe pas déjà
        java.util.function.Consumer<Formation> saveFormationIfNotExists = (formation) -> {
            if (!formationRepository.existsByTitle(formation.getTitle())) {
                formationRepository.save(formation);
            }
        };
        
        // Créer ou récupérer des utilisateurs de test
        User apprenant = userRepository.findByEmail("apprenant@eduafrica.com")
                .orElseGet(() -> {
                    User u = User.builder()
                .firstName("Jean")
                .lastName("Dupont")
                .email("apprenant@eduafrica.com")
                .phone("+221771234567")
                .country("Sénégal")
                .password(passwordEncoder.encode("password123"))
                .role(Role.APPRENANT)
                .build();
                    return userRepository.save(u);
                });
        
        User formateur1 = userRepository.findByEmail("formateur@eduafrica.com")
                .orElseGet(() -> {
                    User u = User.builder()
                .firstName("Aminata")
                .lastName("Diallo")
                .email("formateur@eduafrica.com")
                .phone("+221772345678")
                .country("Sénégal")
                .password(passwordEncoder.encode("password123"))
                .role(Role.FORMATEUR)
                .build();
                    return userRepository.save(u);
                });
        
        User formateur2 = userRepository.findByEmail("formateur2@eduafrica.com")
                .orElseGet(() -> {
                    User u = User.builder()
                .firstName("Mamadou")
                .lastName("Kane")
                .email("formateur2@eduafrica.com")
                .phone("+221773456789")
                .country("Côte d'Ivoire")
                .password(passwordEncoder.encode("password123"))
                .role(Role.FORMATEUR)
                .build();
                    return userRepository.save(u);
                });
        
        User mentor1 = userRepository.findByEmail("mentor@eduafrica.com")
                .orElseGet(() -> {
                    User u = User.builder()
                .firstName("Fatou")
                .lastName("Ndiaye")
                .email("mentor@eduafrica.com")
                .phone("+221774567890")
                .country("Sénégal")
                .password(passwordEncoder.encode("password123"))
                .role(Role.MENTOR)
                .build();
                    return userRepository.save(u);
                });
        
        // S'assurer que le compte admin existe toujours avec le bon mot de passe
        User admin = userRepository.findByEmail("admin@eduafrica.com")
                .orElseGet(() -> {
                    System.out.println("🔧 Création du compte administrateur...");
                    User u = User.builder()
                .firstName("Admin")
                .lastName("EduAfrica")
                .email("admin@eduafrica.com")
                .phone("+221775678901")
                .country("Sénégal")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .build();
                    User saved = userRepository.save(u);
                    System.out.println("✅ Compte admin créé avec succès");
                    return saved;
                });
        
        // Réinitialiser le mot de passe admin si nécessaire (pour s'assurer qu'il est toujours admin123)
        if (admin != null && !passwordEncoder.matches("admin123", admin.getPassword())) {
            System.out.println("🔧 Réinitialisation du mot de passe admin...");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN); // S'assurer que le rôle est ADMIN
            userRepository.save(admin);
            System.out.println("✅ Mot de passe admin réinitialisé");
        }
        
        // S'assurer que le rôle est ADMIN
        if (admin != null && admin.getRole() != Role.ADMIN) {
            System.out.println("🔧 Correction du rôle admin...");
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("✅ Rôle admin corrigé");
        }
        
        // Créer des formations
        Formation formation1 = Formation.builder()
                .title("Développement Web Full Stack avec React et Node.js")
                .description("Apprenez à créer des applications web modernes de A à Z avec React et Node.js")
                .programme("Module 1: Introduction\nModule 2: React\nModule 3: Node.js\nModule 4: Projet final")
                .category(FormationCategory.DEVELOPPEMENT)
                .level(FormationLevel.INTERMEDIAIRE)
                .price(new BigDecimal("150000"))
                .isFree(false)
                .duration(120)
                .formateur(formateur1)
                .tags(Arrays.asList("#React", "#NodeJS", "#JavaScript", "#FullStack"))
                .averageRating(4.7)
                .nbStudents(234)
                .build();
        saveFormationIfNotExists.accept(formation1);
        
        Formation formation2 = Formation.builder()
                .title("Marketing Digital pour l'Afrique")
                .description("Maîtrisez les techniques de marketing digital adaptées au marché africain")
                .programme("Module 1: Réseaux sociaux\nModule 2: SEO\nModule 3: Publicité en ligne\nModule 4: Stratégie")
                .category(FormationCategory.MARKETING)
                .level(FormationLevel.DEBUTANT)
                .price(new BigDecimal("75000"))
                .isFree(false)
                .duration(60)
                .formateur(formateur1)
                .tags(Arrays.asList("#Marketing", "#Digital", "#SEO", "#SocialMedia"))
                .averageRating(4.5)
                .nbStudents(156)
                .build();
        saveFormationIfNotExists.accept(formation2);
        
        Formation formation3 = Formation.builder()
                .title("Intelligence Artificielle et Machine Learning")
                .description("Découvrez les fondamentaux de l'IA et du Machine Learning avec Python")
                .programme("Module 1: Python pour l'IA\nModule 2: ML basics\nModule 3: Deep Learning\nModule 4: Projets")
                .category(FormationCategory.DATA_SCIENCE)
                .level(FormationLevel.AVANCE)
                .price(new BigDecimal("150000"))
                .isFree(false)
                .duration(150)
                .formateur(formateur2)
                .tags(Arrays.asList("#AI", "#MachineLearning", "#Python", "#DataScience"))
                .averageRating(4.8)
                .nbStudents(189)
                .build();
        saveFormationIfNotExists.accept(formation3);
        
        Formation formation4 = Formation.builder()
                .title("Création d'applications mobiles avec Flutter")
                .description("Apprenez à développer des applications mobiles iOS et Android avec Flutter")
                .programme("Module 1: Dart\nModule 2: Flutter widgets\nModule 3: Firebase\nModule 4: Déploiement")
                .category(FormationCategory.MOBILE)
                .level(FormationLevel.INTERMEDIAIRE)
                .price(new BigDecimal("120000"))
                .isFree(false)
                .duration(90)
                .formateur(formateur2)
                .tags(Arrays.asList("#Flutter", "#Dart", "#Mobile", "#iOS", "#Android"))
                .averageRating(4.6)
                .nbStudents(145)
                .build();
        saveFormationIfNotExists.accept(formation4);
        
        Formation formation5 = Formation.builder()
                .title("Introduction à la Cybersécurité")
                .description("Formation gratuite pour découvrir les bases de la sécurité informatique")
                .programme("Module 1: Concepts\nModule 2: Attaques\nModule 3: Protection\nModule 4: Pratique")
                .category(FormationCategory.SECURITE)
                .level(FormationLevel.DEBUTANT)
                .price(BigDecimal.ZERO)
                .isFree(true)
                .duration(40)
                .formateur(formateur1)
                .tags(Arrays.asList("#Cybersécurité", "#Sécurité", "#Hacking", "#Gratuit"))
                .averageRating(4.4)
                .nbStudents(523)
                .build();
        saveFormationIfNotExists.accept(formation5);
        
        Formation formation6 = Formation.builder()
                .title("Cloud Computing avec AWS")
                .description("Maîtrisez les services Amazon Web Services pour le cloud")
                .programme("Module 1: EC2\nModule 2: S3\nModule 3: Lambda\nModule 4: Certification")
                .category(FormationCategory.CLOUD)
                .level(FormationLevel.INTERMEDIAIRE)
                .price(new BigDecimal("140000"))
                .isFree(false)
                .duration(100)
                .formateur(formateur2)
                .tags(Arrays.asList("#AWS", "#Cloud", "#DevOps", "#Infrastructure"))
                .averageRating(4.7)
                .nbStudents(198)
                .build();
        saveFormationIfNotExists.accept(formation6);

        // Ajouter plus de formations dans le style des images
        User formateur3 = userRepository.findByEmail("amadou.kane@eduafrica.com")
                .orElseGet(() -> {
                    User u = User.builder()
                .firstName("Amadou")
                .lastName("Kane")
                .email("amadou.kane@eduafrica.com")
                .phone("+221776543210")
                .country("Sénégal")
                .password(passwordEncoder.encode("password123"))
                .role(Role.FORMATEUR)
                .build();
                    return userRepository.save(u);
                });

        User formateur4 = userRepository.findByEmail("fatou.diop@eduafrica.com")
                .orElseGet(() -> {
                    User u = User.builder()
                .firstName("Fatou")
                .lastName("Diop")
                .email("fatou.diop@eduafrica.com")
                .phone("+221776543211")
                .country("Sénégal")
                .password(passwordEncoder.encode("password123"))
                .role(Role.FORMATEUR)
                .build();
                    return userRepository.save(u);
                });

        User formateur5 = userRepository.findByEmail("cheikh.ndiaye@eduafrica.com")
                .orElseGet(() -> {
                    User u = User.builder()
                .firstName("Dr. Cheikh")
                .lastName("Ndiaye")
                .email("cheikh.ndiaye@eduafrica.com")
                .phone("+221776543212")
                .country("Sénégal")
                .password(passwordEncoder.encode("password123"))
                .role(Role.FORMATEUR)
                .build();
                    return userRepository.save(u);
                });

        // Formation 7: Développement Web avec React (comme dans l'image)
        Formation formation7 = Formation.builder()
                .title("Développement Web avec React")
                .description("Maîtrisez React pour créer des applications web modernes et interactives. Apprenez les hooks, le state management et les meilleures pratiques.")
                .programme("Module 1: Introduction à React\nModule 2: Composants et Props\nModule 3: Hooks et State\nModule 4: Routing\nModule 5: Projet final")
                .category(FormationCategory.DEVELOPPEMENT)
                .level(FormationLevel.INTERMEDIAIRE)
                .price(new BigDecimal("150000"))
                .isFree(false)
                .duration(120) // 8 semaines = 120h
                .formateur(formateur3)
                .tags(Arrays.asList("#React", "#JavaScript", "#Frontend", "#Web"))
                .averageRating(4.8)
                .nbStudents(1250)
                .build();
        saveFormationIfNotExists.accept(formation7);

        // Formation 8: Marketing Digital en Afrique (comme dans l'image)
        Formation formation8 = Formation.builder()
                .title("Marketing Digital en Afrique")
                .description("Stratégies marketing adaptées au marché africain et aux solutions de paiement mobile. Apprenez à promouvoir votre entreprise efficacement.")
                .programme("Module 1: Fondamentaux du marketing digital\nModule 2: Réseaux sociaux\nModule 3: Mobile Money et paiements\nModule 4: Stratégie de contenu\nModule 5: Analytics")
                .category(FormationCategory.MARKETING)
                .level(FormationLevel.DEBUTANT)
                .price(BigDecimal.ZERO)
                .isFree(true)
                .duration(90) // 6 semaines = 90h
                .formateur(formateur4)
                .tags(Arrays.asList("#Marketing", "#Mobile Money", "#Stratégie", "#Digital"))
                .averageRating(4.6)
                .nbStudents(850)
                .build();
        saveFormationIfNotExists.accept(formation8);

        // Formation 9: Intelligence Artificielle pour l'Afrique (comme dans l'image)
        Formation formation9 = Formation.builder()
                .title("Intelligence Artificielle pour l'Afrique")
                .description("Applications pratiques de l'IA dans le contexte africain. Découvrez comment l'IA peut transformer les entreprises et les services en Afrique.")
                .programme("Module 1: Introduction à l'IA\nModule 2: Machine Learning\nModule 3: Deep Learning\nModule 4: Applications pratiques\nModule 5: Projets réels")
                .category(FormationCategory.DATA_SCIENCE)
                .level(FormationLevel.AVANCE)
                .price(new BigDecimal("150000"))
                .isFree(false)
                .duration(180) // 12 semaines = 180h
                .formateur(formateur5)
                .tags(Arrays.asList("#IA", "#Machine Learning", "#Python", "#DataScience"))
                .averageRating(4.9)
                .nbStudents(620)
                .build();
        saveFormationIfNotExists.accept(formation9);

        // Formation 10: Business et Entrepreneuriat
        Formation formation10 = Formation.builder()
                .title("Entrepreneuriat Digital en Afrique")
                .description("Créez et développez votre entreprise digitale en Afrique. Apprenez les spécificités du marché africain et les stratégies de croissance.")
                .programme("Module 1: Idée et validation\nModule 2: Business Model\nModule 3: Financement\nModule 4: Marketing et vente\nModule 5: Scaling")
                .category(FormationCategory.BUSINESS)
                .level(FormationLevel.INTERMEDIAIRE)
                .price(new BigDecimal("100000"))
                .isFree(false)
                .duration(80)
                .formateur(formateur4)
                .tags(Arrays.asList("#Entrepreneuriat", "#Business", "#Startup", "#Afrique"))
                .averageRating(4.5)
                .nbStudents(450)
                .build();
        saveFormationIfNotExists.accept(formation10);

        // Formation 11: Agriculture Digitale
        Formation formation11 = Formation.builder()
                .title("Agriculture Digitale et Smart Farming")
                .description("Utilisez les technologies modernes pour améliorer la productivité agricole. Applications mobiles, IoT et données pour l'agriculture.")
                .programme("Module 1: Introduction à l'agriculture digitale\nModule 2: IoT et capteurs\nModule 3: Applications mobiles\nModule 4: Analyse de données\nModule 5: Cas pratiques")
                .category(FormationCategory.AGRICULTURE)
                .level(FormationLevel.INTERMEDIAIRE)
                .price(new BigDecimal("120000"))
                .isFree(false)
                .duration(100)
                .formateur(formateur3)
                .tags(Arrays.asList("#Agriculture", "#IoT", "#SmartFarming", "#Tech"))
                .averageRating(4.7)
                .nbStudents(320)
                .build();
        saveFormationIfNotExists.accept(formation11);

        // Ajouter 2 formations par catégorie - Formations manquantes
        
        // MOBILE - 2ème formation
        Formation formation12 = Formation.builder()
                .title("Développement iOS avec Swift")
                .description("Créez des applications iOS natives avec Swift et Xcode. Apprenez les fondamentaux du développement Apple.")
                .programme("Module 1: Swift basics\nModule 2: Interface utilisateur\nModule 3: Navigation et données\nModule 4: App Store\nModule 5: Projet final")
                .category(FormationCategory.MOBILE)
                .level(FormationLevel.INTERMEDIAIRE)
                .price(new BigDecimal("140000"))
                .isFree(false)
                .duration(100)
                .formateur(formateur3)
                .tags(Arrays.asList("#iOS", "#Swift", "#Xcode", "#Apple", "#Mobile"))
                .averageRating(4.7)
                .nbStudents(380)
                .build();
        saveFormationIfNotExists.accept(formation12);

        // SECURITE - 2ème formation
        Formation formation13 = Formation.builder()
                .title("Ethical Hacking et Pentesting")
                .description("Apprenez les techniques de test d'intrusion et de sécurisation des systèmes. Formation avancée en cybersécurité.")
                .programme("Module 1: Reconnaissance\nModule 2: Scanning\nModule 3: Exploitation\nModule 4: Post-exploitation\nModule 5: Reporting")
                .category(FormationCategory.SECURITE)
                .level(FormationLevel.AVANCE)
                .price(new BigDecimal("145000"))
                .isFree(false)
                .duration(140)
                .formateur(formateur5)
                .tags(Arrays.asList("#Hacking", "#Pentesting", "#Sécurité", "#Kali", "#Ethical"))
                .averageRating(4.8)
                .nbStudents(245)
                .build();
        saveFormationIfNotExists.accept(formation13);

        // CLOUD - 2ème formation
        Formation formation14 = Formation.builder()
                .title("Microsoft Azure pour les entreprises")
                .description("Maîtrisez Microsoft Azure pour déployer et gérer vos applications dans le cloud. Certification Azure incluse.")
                .programme("Module 1: Azure fundamentals\nModule 2: Compute et Storage\nModule 3: Networking\nModule 4: Security\nModule 5: Certification")
                .category(FormationCategory.CLOUD)
                .level(FormationLevel.INTERMEDIAIRE)
                .price(new BigDecimal("135000"))
                .isFree(false)
                .duration(110)
                .formateur(formateur4)
                .tags(Arrays.asList("#Azure", "#Microsoft", "#Cloud", "#DevOps", "#Certification"))
                .averageRating(4.6)
                .nbStudents(312)
                .build();
        saveFormationIfNotExists.accept(formation14);

        // BUSINESS - 2ème formation
        Formation formation15 = Formation.builder()
                .title("Gestion de Projet Agile et Scrum")
                .description("Maîtrisez les méthodologies agiles et Scrum pour gérer efficacement vos projets digitaux.")
                .programme("Module 1: Principes Agile\nModule 2: Scrum framework\nModule 3: Outils et techniques\nModule 4: Certification Scrum Master\nModule 5: Cas pratiques")
                .category(FormationCategory.BUSINESS)
                .level(FormationLevel.DEBUTANT)
                .price(new BigDecimal("95000"))
                .isFree(false)
                .duration(70)
                .formateur(formateur1)
                .tags(Arrays.asList("#Agile", "#Scrum", "#ProjectManagement", "#Business", "#Management"))
                .averageRating(4.5)
                .nbStudents(567)
                .build();
        saveFormationIfNotExists.accept(formation15);

        // AGRICULTURE - 2ème formation
        Formation formation16 = Formation.builder()
                .title("E-Agriculture et Applications Mobiles")
                .description("Développez des solutions digitales pour l'agriculture africaine. Applications mobiles pour les agriculteurs.")
                .programme("Module 1: E-agriculture concepts\nModule 2: Applications mobiles\nModule 3: Données météo\nModule 4: Marchés en ligne\nModule 5: Projet pratique")
                .category(FormationCategory.AGRICULTURE)
                .level(FormationLevel.DEBUTANT)
                .price(new BigDecimal("80000"))
                .isFree(false)
                .duration(60)
                .formateur(formateur2)
                .tags(Arrays.asList("#E-Agriculture", "#Mobile", "#Agriculture", "#Tech", "#Afrique"))
                .averageRating(4.4)
                .nbStudents(289)
                .build();
        saveFormationIfNotExists.accept(formation16);

        // TECHNOLOGIE - 1ère formation
        Formation formation17 = Formation.builder()
                .title("Blockchain et Cryptomonnaies en Afrique")
                .description("Comprenez la technologie blockchain et son application aux cryptomonnaies dans le contexte africain.")
                .programme("Module 1: Blockchain fundamentals\nModule 2: Cryptomonnaies\nModule 3: Smart contracts\nModule 4: Applications africaines\nModule 5: Projets")
                .category(FormationCategory.TECHNOLOGIE)
                .level(FormationLevel.INTERMEDIAIRE)
                .price(new BigDecimal("125000"))
                .isFree(false)
                .duration(120)
                .formateur(formateur5)
                .tags(Arrays.asList("#Blockchain", "#Crypto", "#Bitcoin", "#Ethereum", "#Tech"))
                .averageRating(4.7)
                .nbStudents(198)
                .build();
        saveFormationIfNotExists.accept(formation17);

        // TECHNOLOGIE - 2ème formation
        Formation formation18 = Formation.builder()
                .title("Internet des Objets (IoT) pour l'Afrique")
                .description("Développez des solutions IoT adaptées aux besoins africains. Capteurs, connectivité et applications pratiques.")
                .programme("Module 1: IoT fundamentals\nModule 2: Capteurs et hardware\nModule 3: Connectivité\nModule 4: Applications pratiques\nModule 5: Projet IoT")
                .category(FormationCategory.TECHNOLOGIE)
                .level(FormationLevel.INTERMEDIAIRE)
                .price(new BigDecimal("130000"))
                .isFree(false)
                .duration(100)
                .formateur(formateur3)
                .tags(Arrays.asList("#IoT", "#InternetOfThings", "#Sensors", "#Tech", "#Hardware"))
                .averageRating(4.6)
                .nbStudents(234)
                .build();
        saveFormationIfNotExists.accept(formation18);

        // DESIGN - 1ère formation
        Formation formation19 = Formation.builder()
                .title("UI/UX Design pour Applications Mobiles")
                .description("Créez des interfaces utilisateur modernes et intuitives pour applications mobiles. Design thinking et prototypage.")
                .programme("Module 1: Principes UI/UX\nModule 2: Design mobile\nModule 3: Prototypage Figma\nModule 4: Tests utilisateurs\nModule 5: Portfolio")
                .category(FormationCategory.DESIGN)
                .level(FormationLevel.DEBUTANT)
                .price(new BigDecimal("110000"))
                .isFree(false)
                .duration(80)
                .formateur(formateur4)
                .tags(Arrays.asList("#UI", "#UX", "#Design", "#Figma", "#Mobile"))
                .averageRating(4.6)
                .nbStudents(412)
                .build();
        saveFormationIfNotExists.accept(formation19);

        // DESIGN - 2ème formation
        Formation formation20 = Formation.builder()
                .title("Graphisme Digital et Branding")
                .description("Maîtrisez les outils de design graphique et créez des identités visuelles fortes pour les entreprises africaines.")
                .programme("Module 1: Design fundamentals\nModule 2: Adobe Creative Suite\nModule 3: Branding\nModule 4: Identité visuelle\nModule 5: Portfolio professionnel")
                .category(FormationCategory.DESIGN)
                .level(FormationLevel.INTERMEDIAIRE)
                .price(new BigDecimal("125000"))
                .isFree(false)
                .duration(90)
                .formateur(formateur1)
                .tags(Arrays.asList("#Graphisme", "#Branding", "#Adobe", "#Design", "#Creative"))
                .averageRating(4.7)
                .nbStudents(356)
                .build();
        saveFormationIfNotExists.accept(formation20);
        
        // Créer des profils de mentors
        // Méthode helper pour créer un mentor seulement s'il n'existe pas déjà
        java.util.function.BiConsumer<User, MentorProfile> saveMentorIfNotExists = (user, mentorProfile) -> {
            if (mentorProfileRepository.findByUser(user).isEmpty()) {
                mentorProfileRepository.save(mentorProfile);
            }
        };
        
        MentorProfile mentorProfile1 = MentorProfile.builder()
                .user(mentor1)
                .specialty("Développement Web & Mobile")
                .bio("Expert en développement full-stack avec 10 ans d'expérience. Passionnée par l'enseignement et le mentorat.")
                .rating(4.9)
                .nbSessions(87)
                .hourlyRate(new BigDecimal("25000"))
                .isAvailable(true)
                .build();
        saveMentorIfNotExists.accept(mentor1, mentorProfile1);
        
        // Créer 10 mentors supplémentaires, chacun lié à une formation différente
        // Mentor 2 - Formation 2: Marketing Digital pour l'Afrique
        User mentor2 = userRepository.findByEmail("mentor2@eduafrica.com")
                .orElseGet(() -> {
                    User u = User.builder()
                            .firstName("Aissatou")
                            .lastName("Ba")
                            .email("mentor2@eduafrica.com")
                            .phone("+221775678901")
                            .country("Sénégal")
                            .password(passwordEncoder.encode("password123"))
                            .role(Role.MENTOR)
                            .build();
                    return userRepository.save(u);
                });
        MentorProfile mentorProfile2 = MentorProfile.builder()
                .user(mentor2)
                .specialty("Marketing Digital")
                .bio("Spécialiste en marketing digital avec 8 ans d'expérience. Expert en stratégies de croissance pour les entreprises africaines.")
                .rating(4.7)
                .nbSessions(65)
                .hourlyRate(new BigDecimal("20000"))
                .isAvailable(true)
                .build();
        saveMentorIfNotExists.accept(mentor2, mentorProfile2);
        
        // Mentor 3 - Formation 3: Intelligence Artificielle et Machine Learning
        User mentor3 = userRepository.findByEmail("mentor3@eduafrica.com")
                .orElseGet(() -> {
                    User u = User.builder()
                            .firstName("Dr. Ousmane")
                            .lastName("Sarr")
                            .email("mentor3@eduafrica.com")
                            .phone("+221776789012")
                            .country("Sénégal")
                            .password(passwordEncoder.encode("password123"))
                            .role(Role.MENTOR)
                            .build();
                    return userRepository.save(u);
                });
        MentorProfile mentorProfile3 = MentorProfile.builder()
                .user(mentor3)
                .specialty("Intelligence Artificielle & Machine Learning")
                .bio("Docteur en Intelligence Artificielle, chercheur et consultant. 12 ans d'expérience en ML et Deep Learning.")
                .rating(4.9)
                .nbSessions(120)
                .hourlyRate(new BigDecimal("30000"))
                .isAvailable(true)
                .build();
        saveMentorIfNotExists.accept(mentor3, mentorProfile3);
        
        // Mentor 4 - Formation 4: Création d'applications mobiles avec Flutter
        User mentor4 = userRepository.findByEmail("mentor4@eduafrica.com")
                .orElseGet(() -> {
                    User u = User.builder()
                            .firstName("Khadija")
                            .lastName("Traoré")
                            .email("mentor4@eduafrica.com")
                            .phone("+221777890123")
                            .country("Mali")
                            .password(passwordEncoder.encode("password123"))
                            .role(Role.MENTOR)
                            .build();
                    return userRepository.save(u);
                });
        MentorProfile mentorProfile4 = MentorProfile.builder()
                .user(mentor4)
                .specialty("Développement Mobile Flutter")
                .bio("Développeuse mobile expérimentée, spécialisée en Flutter et Dart. Créatrice de plusieurs applications populaires.")
                .rating(4.8)
                .nbSessions(95)
                .hourlyRate(new BigDecimal("22000"))
                .isAvailable(true)
                .build();
        saveMentorIfNotExists.accept(mentor4, mentorProfile4);
        
        // Mentor 5 - Formation 5: Introduction à la Cybersécurité
        User mentor5 = userRepository.findByEmail("mentor5@eduafrica.com")
                .orElseGet(() -> {
                    User u = User.builder()
                            .firstName("Ibrahima")
                            .lastName("Cissé")
                            .email("mentor5@eduafrica.com")
                            .phone("+221778901234")
                            .country("Sénégal")
                            .password(passwordEncoder.encode("password123"))
                            .role(Role.MENTOR)
                            .build();
                    return userRepository.save(u);
                });
        MentorProfile mentorProfile5 = MentorProfile.builder()
                .user(mentor5)
                .specialty("Cybersécurité & Ethical Hacking")
                .bio("Expert en cybersécurité certifié CEH et CISSP. Consultant en sécurité informatique pour grandes entreprises.")
                .rating(4.9)
                .nbSessions(110)
                .hourlyRate(new BigDecimal("28000"))
                .isAvailable(true)
                .build();
        saveMentorIfNotExists.accept(mentor5, mentorProfile5);
        
        // Mentor 6 - Formation 6: Cloud Computing avec AWS
        User mentor6 = userRepository.findByEmail("mentor6@eduafrica.com")
                .orElseGet(() -> {
                    User u = User.builder()
                            .firstName("Mariama")
                            .lastName("Diop")
                            .email("mentor6@eduafrica.com")
                            .phone("+221779012345")
                            .country("Sénégal")
                            .password(passwordEncoder.encode("password123"))
                            .role(Role.MENTOR)
                            .build();
                    return userRepository.save(u);
                });
        MentorProfile mentorProfile6 = MentorProfile.builder()
                .user(mentor6)
                .specialty("Cloud Computing AWS")
                .bio("Architecte cloud certifiée AWS Solutions Architect. Spécialiste en migration et optimisation cloud.")
                .rating(4.8)
                .nbSessions(78)
                .hourlyRate(new BigDecimal("25000"))
                .isAvailable(true)
                .build();
        saveMentorIfNotExists.accept(mentor6, mentorProfile6);
        
        // Mentor 7 - Formation 7: Développement Web avec React
        User mentor7 = userRepository.findByEmail("mentor7@eduafrica.com")
                .orElseGet(() -> {
                    User u = User.builder()
                            .firstName("Seydou")
                            .lastName("Konaté")
                            .email("mentor7@eduafrica.com")
                            .phone("+221770123456")
                            .country("Mali")
                            .password(passwordEncoder.encode("password123"))
                            .role(Role.MENTOR)
                            .build();
                    return userRepository.save(u);
                });
        MentorProfile mentorProfile7 = MentorProfile.builder()
                .user(mentor7)
                .specialty("React & Frontend Development")
                .bio("Développeur frontend senior spécialisé en React, Next.js et TypeScript. Créateur de composants réutilisables.")
                .rating(4.7)
                .nbSessions(82)
                .hourlyRate(new BigDecimal("21000"))
                .isAvailable(true)
                .build();
        saveMentorIfNotExists.accept(mentor7, mentorProfile7);
        
        // Mentor 8 - Formation 8: Marketing Digital en Afrique
        User mentor8 = userRepository.findByEmail("mentor8@eduafrica.com")
                .orElseGet(() -> {
                    User u = User.builder()
                            .firstName("Awa")
                            .lastName("Sall")
                            .email("mentor8@eduafrica.com")
                            .phone("+221771234567")
                            .country("Sénégal")
                            .password(passwordEncoder.encode("password123"))
                            .role(Role.MENTOR)
                            .build();
                    return userRepository.save(u);
                });
        MentorProfile mentorProfile8 = MentorProfile.builder()
                .user(mentor8)
                .specialty("Marketing Digital & Mobile Money")
                .bio("Consultante en marketing digital spécialisée dans les solutions de paiement mobile en Afrique.")
                .rating(4.6)
                .nbSessions(58)
                .hourlyRate(new BigDecimal("18000"))
                .isAvailable(true)
                .build();
        saveMentorIfNotExists.accept(mentor8, mentorProfile8);
        
        // Mentor 9 - Formation 9: Intelligence Artificielle pour l'Afrique
        User mentor9 = userRepository.findByEmail("mentor9@eduafrica.com")
                .orElseGet(() -> {
                    User u = User.builder()
                            .firstName("Dr. Yacine")
                            .lastName("Diallo")
                            .email("mentor9@eduafrica.com")
                            .phone("+221772345678")
                            .country("Guinée")
                            .password(passwordEncoder.encode("password123"))
                            .role(Role.MENTOR)
                            .build();
                    return userRepository.save(u);
                });
        MentorProfile mentorProfile9 = MentorProfile.builder()
                .user(mentor9)
                .specialty("IA Appliquée pour l'Afrique")
                .bio("Chercheur en IA appliquée aux défis africains. Expert en solutions d'IA pour l'agriculture et la santé.")
                .rating(5.0)
                .nbSessions(135)
                .hourlyRate(new BigDecimal("32000"))
                .isAvailable(true)
                .build();
        saveMentorIfNotExists.accept(mentor9, mentorProfile9);
        
        // Mentor 10 - Formation 10: Entrepreneuriat Digital en Afrique
        User mentor10 = userRepository.findByEmail("mentor10@eduafrica.com")
                .orElseGet(() -> {
                    User u = User.builder()
                            .firstName("Binta")
                            .lastName("Kane")
                            .email("mentor10@eduafrica.com")
                            .phone("+221773456789")
                            .country("Sénégal")
                            .password(passwordEncoder.encode("password123"))
                            .role(Role.MENTOR)
                            .build();
                    return userRepository.save(u);
                });
        MentorProfile mentorProfile10 = MentorProfile.builder()
                .user(mentor10)
                .specialty("Entrepreneuriat Digital")
                .bio("Entrepreneure à succès, fondatrice de 3 startups. Mentor en business development et stratégie de croissance.")
                .rating(4.8)
                .nbSessions(102)
                .hourlyRate(new BigDecimal("23000"))
                .isAvailable(true)
                .build();
        saveMentorIfNotExists.accept(mentor10, mentorProfile10);
        
        // Mentor 11 - Formation 11: Agriculture Digitale et Smart Farming
        User mentor11 = userRepository.findByEmail("mentor11@eduafrica.com")
                .orElseGet(() -> {
                    User u = User.builder()
                            .firstName("Modou")
                            .lastName("Ndiaye")
                            .email("mentor11@eduafrica.com")
                            .phone("+221774567890")
                            .country("Sénégal")
                            .password(passwordEncoder.encode("password123"))
                            .role(Role.MENTOR)
                            .build();
                    return userRepository.save(u);
                });
        MentorProfile mentorProfile11 = MentorProfile.builder()
                .user(mentor11)
                .specialty("Agriculture Digitale & IoT")
                .bio("Ingénieur agronome spécialisé en technologies agricoles. Expert en IoT et applications mobiles pour l'agriculture.")
                .rating(4.7)
                .nbSessions(71)
                .hourlyRate(new BigDecimal("20000"))
                .isAvailable(true)
                .build();
        saveMentorIfNotExists.accept(mentor11, mentorProfile11);
        
        // Log du nombre de mentors créés
        long totalMentors = mentorProfileRepository.count();
        System.out.println("👥 Total de mentors créés: " + totalMentors);
        
        // Créer des modules et leçons pour la première formation
        // Récupérer la formation depuis la base de données pour éviter les problèmes de transient
        Formation savedFormation1 = formationRepository.findByTitle("Développement Web Full Stack avec React et Node.js")
                .orElseGet(() -> {
                    // Si la formation n'existe pas, la sauvegarder d'abord
                    if (!formationRepository.existsByTitle(formation1.getTitle())) {
                        return formationRepository.save(formation1);
                    }
                    return formation1;
                });
        
        // Vérifier si les modules existent déjà pour cette formation
        boolean modulesExist = !moduleRepository.findByFormation(savedFormation1).isEmpty();
        
        if (!modulesExist && savedFormation1.getId() != null) {
            com.eduafrica.model.Module module1_1 = com.eduafrica.model.Module.builder()
                    .title("Introduction au Développement Web")
                    .description("Découvrez les bases du développement web moderne")
                    .order(1)
                    .formation(savedFormation1)
                    .build();
            moduleRepository.save(module1_1);
            
            Lesson lesson1_1_1 = Lesson.builder()
                    .title("Qu'est-ce que le développement web ?")
                    .content("Introduction aux concepts fondamentaux du développement web")
                    .order(1)
                    .lessonType(LessonType.VIDEO)
                    .videoUrl("https://example.com/video1")
                    .durationMinutes(15)
                    .isFreePreview(true)
                    .module(module1_1)
                    .build();
            lessonRepository.save(lesson1_1_1);
            
            Lesson lesson1_1_2 = Lesson.builder()
                    .title("Les outils du développeur")
                    .content("Découvrez les outils essentiels : éditeurs, navigateurs, etc.")
                    .order(2)
                    .lessonType(LessonType.VIDEO)
                    .videoUrl("https://example.com/video2")
                    .durationMinutes(20)
                    .isFreePreview(false)
                    .module(module1_1)
                    .build();
            lessonRepository.save(lesson1_1_2);
            
            com.eduafrica.model.Module module1_2 = com.eduafrica.model.Module.builder()
                    .title("React - Les Fondamentaux")
                    .description("Apprenez React de zéro")
                    .order(2)
                    .formation(savedFormation1)
                    .build();
            moduleRepository.save(module1_2);
            
            Lesson lesson1_2_1 = Lesson.builder()
                    .title("Installation et premier composant")
                    .content("Créez votre premier composant React")
                    .order(1)
                    .lessonType(LessonType.VIDEO)
                    .videoUrl("https://example.com/video3")
                    .durationMinutes(25)
                    .isFreePreview(true)
                    .module(module1_2)
                    .build();
            lessonRepository.save(lesson1_2_1);
            
            Lesson lesson1_2_2 = Lesson.builder()
                    .title("Les Hooks React")
                    .content("Maîtrisez useState, useEffect et les autres hooks")
                    .order(2)
                    .lessonType(LessonType.VIDEO)
                    .videoUrl("https://example.com/video4")
                    .durationMinutes(30)
                    .isFreePreview(false)
                    .module(module1_2)
                    .build();
            lessonRepository.save(lesson1_2_2);
            
            Lesson lesson1_2_3 = Lesson.builder()
                    .title("Quiz : React Basics")
                    .content("Testez vos connaissances sur React")
                    .order(3)
                    .lessonType(LessonType.QUIZ)
                    .durationMinutes(10)
                    .isFreePreview(false)
                    .module(module1_2)
                    .build();
            lessonRepository.save(lesson1_2_3);
        }
        
        long totalFormations = formationRepository.count();
        long totalMentorsFinal = mentorProfileRepository.count();
        System.out.println("✅ Données de test initialisées avec succès!");
        System.out.println("📚 Total de formations: " + totalFormations);
        System.out.println("👥 Total de mentors: " + totalMentorsFinal);
        System.out.println("📧 Comptes de test:");
        System.out.println("   Apprenant: apprenant@eduafrica.com / password123");
        System.out.println("   Formateur: formateur@eduafrica.com / password123");
        System.out.println("   Mentor: mentor@eduafrica.com / password123");
        System.out.println("   Admin: admin@eduafrica.com / admin123");
    }
}
