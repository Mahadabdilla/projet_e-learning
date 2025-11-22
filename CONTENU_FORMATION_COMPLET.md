# Contenu de Formation Complet - EduAfrica

## Vue d'ensemble

Cette documentation décrit l'implémentation complète du système de contenu de formation avec support pour vidéos, quiz interactifs et exercices pratiques.

## Architecture Backend

### Entités créées

#### Quiz System
1. **`Quiz`** - Quiz associé à une leçon
   - `title`, `description`
   - `passingScore` (score minimum pour réussir, défaut: 70%)
   - `timeLimitMinutes` (limite de temps optionnelle)
   - `allowRetake` (autoriser les nouvelles tentatives)
   - `maxAttempts` (nombre maximum de tentatives)
   - Relation OneToOne avec `Lesson`

2. **`QuizQuestion`** - Questions du quiz
   - `question` (texte de la question)
   - `order` (ordre d'affichage)
   - `questionType` (MULTIPLE_CHOICE, MULTIPLE_SELECT, TRUE_FALSE, SHORT_ANSWER, ESSAY)
   - `points` (points attribués)
   - `explanation` (explication après réponse)
   - Liste de `QuizAnswer`

3. **`QuizAnswer`** - Réponses possibles
   - `answer` (texte de la réponse)
   - `order` (ordre d'affichage)
   - `isCorrect` (indique si c'est la bonne réponse)

4. **`QuizAttempt`** - Tentative de quiz par un utilisateur
   - `score` (score sur 100)
   - `isPassed` (a réussi ou non)
   - `timeSpentSeconds` (temps passé)
   - Liste de `QuizAttemptAnswer`

5. **`QuizAttemptAnswer`** - Réponses sélectionnées dans une tentative
   - `answerText` (pour réponses courtes/essais)
   - `selectedAnswers` (pour choix multiples)
   - `isCorrect` (si la réponse est correcte)
   - `pointsEarned` (points obtenus)

#### Exercise System
1. **`Exercise`** - Exercice pratique associé à une leçon
   - `title`, `description`
   - `instructions` (instructions pour l'exercice)
   - `starterCode` (code de départ pour exercices de programmation)
   - `solution` (solution de l'exercice)
   - `hints` (indices pour aider)
   - `difficultyLevel` (BEGINNER, INTERMEDIATE, ADVANCED)
   - `estimatedTimeMinutes`
   - Relation OneToOne avec `Lesson`

2. **`ExerciseSubmission`** - Soumission d'exercice par un utilisateur
   - `submission` (réponse/solution soumise)
   - `isCorrect` (si la réponse est correcte)
   - `feedback` (feedback du formateur)
   - `score` (score sur 100)
   - `reviewedBy` (formateur qui a corrigé)
   - `reviewedAt` (date de correction)

### Repositories

- `QuizRepository` - CRUD pour Quiz
- `QuizAttemptRepository` - Gestion des tentatives
- `ExerciseRepository` - CRUD pour Exercise
- `ExerciseSubmissionRepository` - Gestion des soumissions

### Services

#### `QuizService`
- `getQuizByLessonId()` - Récupérer un quiz par leçon
- `startQuizAttempt()` - Démarrer une tentative
- `submitQuizAttempt()` - Soumettre une tentative et calculer le score
- `getUserQuizAttempts()` - Historique des tentatives
- `getLatestAttempt()` - Dernière tentative

#### `ExerciseService`
- `getExerciseByLessonId()` - Récupérer un exercice par leçon
- `submitExercise()` - Soumettre une solution
- `reviewSubmission()` - Corriger une soumission (formateur)
- `getUserSubmissions()` - Historique des soumissions
- `getLatestSubmission()` - Dernière soumission

### Controllers API

#### `/api/quizzes`
- `GET /lesson/{lessonId}` - Récupérer un quiz
- `POST /lesson/{lessonId}/start` - Démarrer une tentative
- `POST /attempts/{attemptId}/submit` - Soumettre une tentative
- `GET /attempts/user/{userId}/quiz/{quizId}` - Historique des tentatives
- `GET /attempts/latest/user/{userId}/quiz/{quizId}` - Dernière tentative

#### `/api/exercises`
- `GET /lesson/{lessonId}` - Récupérer un exercice
- `POST /lesson/{lessonId}/submit` - Soumettre une solution
- `POST /submissions/{submissionId}/review` - Corriger une soumission (FORMATEUR)
- `GET /submissions/user/{userId}/exercise/{exerciseId}` - Historique des soumissions
- `GET /submissions/latest/user/{userId}/exercise/{exerciseId}` - Dernière soumission

## Frontend

### Composants existants

Le composant `CoursePlayerComponent` existe déjà et supporte :
- Affichage des modules et leçons
- Navigation entre leçons
- Lecteur vidéo
- Affichage de texte
- Support basique pour quiz et exercices

### Améliorations nécessaires

1. **Composant Quiz amélioré**
   - Affichage des questions avec différents types
   - Gestion du temps (si limite de temps)
   - Soumission et affichage des résultats
   - Affichage des explications après réponse
   - Gestion des tentatives multiples

2. **Composant Exercise amélioré**
   - Affichage des instructions
   - Zone de code pour exercices de programmation
   - Soumission de solution
   - Affichage du feedback
   - Indices (hints)

3. **Lecteur vidéo amélioré**
   - Suivi de progression automatique
   - Contrôles avancés
   - Sous-titres (optionnel)
   - Vitesse de lecture variable

## Flux d'utilisation

### Quiz

1. L'apprenant accède à une leçon de type QUIZ
2. Le système charge le quiz associé
3. L'apprenant démarre une tentative (`POST /api/quizzes/lesson/{lessonId}/start`)
4. L'apprenant répond aux questions
5. L'apprenant soumet le quiz (`POST /api/quizzes/attempts/{attemptId}/submit`)
6. Le système calcule le score et détermine si le quiz est réussi
7. Si réussi et score >= passingScore, la leçon est marquée comme complétée
8. L'apprenant peut voir ses résultats et les explications

### Exercice

1. L'apprenant accède à une leçon de type EXERCISE
2. Le système charge l'exercice associé
3. L'apprenant lit les instructions et le code de départ (si applicable)
4. L'apprenant soumet sa solution (`POST /api/exercises/lesson/{lessonId}/submit`)
5. Pour les exercices nécessitant une correction manuelle, le formateur corrige
6. L'apprenant reçoit un feedback et un score
7. Si la solution est correcte, la leçon peut être marquée comme complétée

## Prochaines étapes

1. Créer les services frontend pour Quiz et Exercise
2. Améliorer le composant QuizComponent
3. Créer un composant ExerciseComponent
4. Améliorer le VideoPlayerComponent
5. Ajouter des tests unitaires
6. Implémenter la correction automatique pour certains types d'exercices

## Notes techniques

- Les quiz avec réponses courtes/essais nécessitent une correction manuelle (pour l'instant)
- Les exercices nécessitent une correction manuelle par défaut
- Le système de scoring est flexible et peut être adapté selon les besoins
- Les tentatives sont enregistrées pour permettre l'analyse des performances


