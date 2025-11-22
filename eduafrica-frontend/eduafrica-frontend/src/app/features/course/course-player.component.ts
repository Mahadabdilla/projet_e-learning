import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormationService } from '../../core/services/formation.service';
import { ContentService } from '../../core/services/content.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { LessonProgressService } from '../../core/services/lesson-progress.service';
import { Formation } from '../../shared/models/formation.model';
import { Module, Lesson, LessonType } from '../../shared/models/module.model';
import { VideoPlayerComponent } from '../../shared/components/video-player/video-player.component';
import { QuizComponent, Quiz } from '../../shared/components/quiz/quiz.component';
import { Enrollment } from '../../core/services/enrollment.service';

@Component({
  selector: 'app-course-player',
  standalone: true,
  imports: [CommonModule, RouterLink, VideoPlayerComponent, QuizComponent],
  template: `
    <div class="course-player-container">
      <!-- Header avec navigation -->
      <div class="course-header">
        <div class="header-content">
          <button (click)="goBack()" class="btn-back">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Retour
          </button>
          <div class="course-info">
            <h1 class="course-title">{{ formation?.title }}</h1>
            <p class="course-subtitle">{{ currentModule?.title }} - {{ currentLesson?.title }}</p>
          </div>
        </div>
      </div>

      <div class="course-layout">
        <!-- Sidebar avec modules et leçons -->
        <div class="sidebar">
          <div class="sidebar-header">
            <h3>Contenu du cours</h3>
            <div class="overall-progress">
              <span>Progression globale : {{ enrollment?.progress || 0 }}%</span>
              <div class="progress-bar-mini">
                <div class="progress-fill-mini" [style.width.%]="enrollment?.progress || 0"></div>
              </div>
            </div>
          </div>

          <div class="modules-list">
            <div *ngFor="let module of modules" class="module-section">
              <div class="module-header" (click)="toggleModule(module.id)">
                <span class="module-title">{{ module.order }}. {{ module.title }}</span>
                <svg class="toggle-icon" [class.expanded]="expandedModules.has(module.id)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              
              <div *ngIf="expandedModules.has(module.id)" class="lessons-list">
                <div 
                  *ngFor="let lesson of module.lessons"
                  class="lesson-item"
                  [class.active]="currentLesson?.id === lesson.id"
                  [class.completed]="isLessonCompleted(lesson.id)"
                  (click)="loadLesson(lesson)">
                  <span class="lesson-icon">
                    <span *ngSwitch="lesson.lessonType">
                      <ng-container *ngSwitchCase="LessonType.VIDEO">▶️</ng-container>
                      <ng-container *ngSwitchCase="LessonType.TEXT">📄</ng-container>
                      <ng-container *ngSwitchCase="LessonType.QUIZ">❓</ng-container>
                      <ng-container *ngSwitchCase="LessonType.EXERCISE">✍️</ng-container>
                      <ng-container *ngSwitchCase="LessonType.DOWNLOAD">⬇️</ng-container>
                    </span>
                  </span>
                  <span class="lesson-title">{{ lesson.order }}. {{ lesson.title }}</span>
                  <span *ngIf="isLessonCompleted(lesson.id)" class="completed-check">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Zone de contenu principal -->
        <div class="content-area">
          <div *ngIf="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Chargement de la leçon...</p>
          </div>

          <div *ngIf="!loading && currentLesson" class="lesson-content">
            <div class="lesson-header">
              <h2 class="lesson-title">{{ currentLesson.title }}</h2>
              <div class="lesson-meta">
                <span *ngIf="currentLesson.durationMinutes" class="duration">
                  ⏱️ {{ currentLesson.durationMinutes }} min
                </span>
                <span class="lesson-type-badge" [class]="'badge-' + currentLesson.lessonType.toLowerCase()">
                  {{ getLessonTypeLabel(currentLesson.lessonType) }}
                </span>
              </div>
            </div>

            <!-- Contenu selon le type de leçon -->
            <div class="lesson-body">
              <!-- Vidéo -->
              <div *ngIf="currentLesson.lessonType === LessonType.VIDEO" class="video-section">
                <app-video-player
                  [videoUrl]="currentLesson.videoUrl || currentLesson.content"
                  [enrollmentId]="enrollmentId"
                  [lessonId]="currentLesson.id"
                  (progressUpdate)="onVideoProgress($event)"
                  (videoCompleted)="onVideoCompleted()">
                </app-video-player>
              </div>

              <!-- Texte -->
              <div *ngIf="currentLesson.lessonType === LessonType.TEXT" class="text-section">
                <div class="text-content" [innerHTML]="formatTextContent(currentLesson.content)"></div>
              </div>

              <!-- Quiz -->
              <div *ngIf="currentLesson.lessonType === LessonType.QUIZ" class="quiz-section">
                <app-quiz
                  [quiz]="parseQuiz(currentLesson.content)"
                  [enrollmentId]="enrollmentId"
                  [lessonId]="currentLesson.id"
                  (quizCompleted)="onQuizCompleted($event)">
                </app-quiz>
              </div>

              <!-- Exercice -->
              <div *ngIf="currentLesson.lessonType === LessonType.EXERCISE" class="exercise-section">
                <div class="exercise-content">
                  <h3>Exercice pratique</h3>
                  <div class="text-content" [innerHTML]="formatTextContent(currentLesson.content)"></div>
                  <button (click)="markExerciseComplete()" class="btn-complete">
                    Marquer comme complété
                  </button>
                </div>
              </div>

              <!-- Téléchargement -->
              <div *ngIf="currentLesson.lessonType === LessonType.DOWNLOAD" class="download-section">
                <div class="download-content">
                  <h3>Ressource à télécharger</h3>
                  <p>{{ currentLesson.content }}</p>
                  <a [href]="currentLesson.content" target="_blank" class="btn-download">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Télécharger
                  </a>
                </div>
              </div>
            </div>

            <!-- Navigation entre leçons -->
            <div class="lesson-navigation">
              <button 
                *ngIf="previousLesson"
                (click)="loadLesson(previousLesson)"
                class="btn-nav btn-prev">
                ← Leçon précédente
              </button>
              <button 
                *ngIf="nextLesson"
                (click)="loadLesson(nextLesson)"
                class="btn-nav btn-next">
                Leçon suivante →
              </button>
            </div>
          </div>

          <div *ngIf="!loading && !currentLesson" class="empty-state">
            <p>Aucune leçon disponible</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .course-player-container {
      min-height: 100vh;
      background: #f5f5f5;
    }

    .course-header {
      background: white;
      border-bottom: 1px solid #e5e5e5;
      padding: 1rem 2rem;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .btn-back {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #f3f4f6;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      color: #1a1a1a;
      font-weight: 500;
    }

    .btn-back:hover {
      background: #e5e5e5;
    }

    .btn-back svg {
      width: 20px;
      height: 20px;
    }

    .course-info {
      flex: 1;
    }

    .course-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 0.25rem 0;
    }

    .course-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .course-layout {
      display: grid;
      grid-template-columns: 300px 1fr;
      max-width: 1400px;
      margin: 0 auto;
      min-height: calc(100vh - 80px);
    }

    .sidebar {
      background: white;
      border-right: 1px solid #e5e5e5;
      overflow-y: auto;
      height: calc(100vh - 80px);
      position: sticky;
      top: 80px;
    }

    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e5e5e5;
    }

    .sidebar-header h3 {
      font-size: 1.125rem;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 1rem 0;
    }

    .overall-progress {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .progress-bar-mini {
      width: 100%;
      height: 6px;
      background: #e5e5e5;
      border-radius: 3px;
      overflow: hidden;
      margin-top: 0.5rem;
    }

    .progress-fill-mini {
      height: 100%;
      background: #667eea;
      transition: width 0.3s ease;
    }

    .modules-list {
      padding: 0.5rem;
    }

    .module-section {
      margin-bottom: 0.5rem;
    }

    .module-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      cursor: pointer;
      border-radius: 8px;
      transition: background 0.2s ease;
    }

    .module-header:hover {
      background: #f9fafb;
    }

    .module-title {
      font-weight: 600;
      color: #1a1a1a;
      font-size: 0.95rem;
    }

    .toggle-icon {
      width: 20px;
      height: 20px;
      color: #6b7280;
      transition: transform 0.2s ease;
    }

    .toggle-icon.expanded {
      transform: rotate(180deg);
    }

    .lessons-list {
      padding-left: 1rem;
    }

    .lesson-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;
    }

    .lesson-item:hover {
      background: #f9fafb;
    }

    .lesson-item.active {
      background: #f0f4ff;
      color: #667eea;
      font-weight: 600;
    }

    .lesson-item.completed {
      color: #10b981;
    }

    .lesson-icon {
      font-size: 1rem;
    }

    .lesson-title {
      flex: 1;
    }

    .completed-check {
      color: #10b981;
      font-weight: 700;
    }

    .content-area {
      padding: 2rem;
      overflow-y: auto;
    }

    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #6b7280;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f4f6;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .lesson-content {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .lesson-header {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #f3f4f6;
    }

    .lesson-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 1rem 0;
    }

    .lesson-meta {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .duration {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .lesson-type-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .badge-video { background: #eff6ff; color: #3b82f6; }
    .badge-text { background: #f3f4f6; color: #6b7280; }
    .badge-quiz { background: #fef3c7; color: #f59e0b; }
    .badge-exercise { background: #f0fdf4; color: #10b981; }
    .badge-download { background: #f5f3ff; color: #8b5cf6; }

    .text-content {
      line-height: 1.8;
      color: #1a1a1a;
      font-size: 1rem;
    }

    .exercise-content, .download-content {
      padding: 2rem;
      background: #f9fafb;
      border-radius: 8px;
    }

    .btn-complete, .btn-download {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #667eea;
      color: white;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
      margin-top: 1rem;
    }

    .btn-complete:hover, .btn-download:hover {
      background: #5568d3;
      transform: translateY(-1px);
    }

    .lesson-navigation {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 2px solid #f3f4f6;
    }

    .btn-nav {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      border: 2px solid #e5e5e5;
      background: white;
      color: #1a1a1a;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-nav:hover {
      border-color: #667eea;
      color: #667eea;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #9ca3af;
    }

    @media (max-width: 1024px) {
      .course-layout {
        grid-template-columns: 1fr;
      }

      .sidebar {
        display: none;
      }
    }
  `]
})
export class CoursePlayerComponent implements OnInit {
  formationId!: number;
  enrollmentId!: number;
  formation: Formation | null = null;
  modules: Module[] = [];
  currentModule: Module | null = null;
  currentLesson: Lesson | null = null;
  enrollment: Enrollment | null = null;
  loading = true;
  expandedModules = new Set<number>();
  lessonProgressMap = new Map<number, boolean>();

  LessonType = LessonType;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formationService: FormationService,
    private contentService: ContentService,
    private enrollmentService: EnrollmentService,
    private lessonProgressService: LessonProgressService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const formationIdParam = params.get('formationId');
      const enrollmentIdParam = params.get('enrollmentId');
      const lessonIdParam = params.get('lessonId');

      if (formationIdParam) {
        this.formationId = Number(formationIdParam);
      }
      if (enrollmentIdParam) {
        this.enrollmentId = Number(enrollmentIdParam);
      }

      this.loadFormation();
      if (this.enrollmentId) {
        this.loadEnrollment();
        this.loadLessonProgress();
      }

      if (lessonIdParam) {
        // Charger la leçon spécifique
      }
    });
  }

  loadFormation() {
    this.formationService.getFormationById(this.formationId).subscribe({
      next: (formation) => {
        this.formation = formation;
        this.loadModules();
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la formation', err);
        this.loading = false;
      }
    });
  }

  loadModules() {
    this.contentService.getModulesByFormation(this.formationId).subscribe({
      next: (modules) => {
        this.modules = modules;
        let loadedModules = 0;
        
        if (modules.length === 0) {
          this.loading = false;
          return;
        }
        
        this.modules.forEach(module => {
          this.expandedModules.add(module.id);
          this.loadLessons(module, () => {
            loadedModules++;
            // Charger la première leçon une fois toutes les leçons chargées
            if (loadedModules === modules.length) {
              const firstLesson = this.getFirstLesson();
              if (firstLesson) {
                this.loadLesson(firstLesson);
              }
              this.loading = false;
            }
          });
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement des modules', err);
        this.loading = false;
      }
    });
  }

  loadLessons(module: Module, callback?: () => void) {
    this.contentService.getLessonsByModule(module.id).subscribe({
      next: (lessons) => {
        module.lessons = lessons;
        if (callback) callback();
      },
      error: (err) => {
        console.error(`Erreur lors du chargement des leçons du module ${module.id}`, err);
        module.lessons = [];
        if (callback) callback();
      }
    });
  }

  private getFirstLesson(): Lesson | null {
    for (const module of this.modules) {
      if (module.lessons && module.lessons.length > 0) {
        return module.lessons[0];
      }
    }
    return null;
  }

  loadEnrollment() {
    this.enrollmentService.getMyEnrollments().subscribe({
      next: (enrollments) => {
        this.enrollment = enrollments.find(e => e.formation?.id === this.formationId) || null;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'inscription', err);
      }
    });
  }

  loadLessonProgress() {
    if (!this.enrollmentId) return;
    
    this.lessonProgressService.getEnrollmentProgress(this.enrollmentId).subscribe({
      next: (progresses) => {
        progresses.forEach(progress => {
          this.lessonProgressMap.set(progress.lessonId, progress.isCompleted);
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la progression', err);
      }
    });
  }

  loadLesson(lesson: Lesson) {
    this.currentLesson = lesson;
    this.currentModule = this.modules.find(m => m.lessons.some(l => l.id === lesson.id)) || null;
    
    // Mettre à jour lastAccessedAt
    if (this.enrollmentId) {
      this.lessonProgressService.updateProgress(this.enrollmentId, lesson.id, 0, 0).subscribe();
    }
  }

  toggleModule(moduleId: number) {
    if (this.expandedModules.has(moduleId)) {
      this.expandedModules.delete(moduleId);
    } else {
      this.expandedModules.add(moduleId);
    }
  }

  isLessonCompleted(lessonId: number): boolean {
    return this.lessonProgressMap.get(lessonId) || false;
  }

  get previousLesson(): Lesson | null {
    if (!this.currentLesson || !this.currentModule) return null;
    
    const allLessons = this.getAllLessons();
    const currentIndex = allLessons.findIndex(l => l.id === this.currentLesson!.id);
    
    return currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  }

  get nextLesson(): Lesson | null {
    if (!this.currentLesson || !this.currentModule) return null;
    
    const allLessons = this.getAllLessons();
    const currentIndex = allLessons.findIndex(l => l.id === this.currentLesson!.id);
    
    return currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  }

  private getAllLessons(): Lesson[] {
    const lessons: Lesson[] = [];
    this.modules.forEach(module => {
      lessons.push(...module.lessons);
    });
    return lessons.sort((a, b) => a.order - b.order);
  }

  onVideoProgress(event: { progress: number; timeSpent: number }) {
    if (this.enrollmentId && this.currentLesson) {
      this.lessonProgressService.updateProgress(
        this.enrollmentId,
        this.currentLesson.id,
        event.progress,
        event.timeSpent
      ).subscribe();
    }
  }

  onVideoCompleted() {
    if (this.enrollmentId && this.currentLesson) {
      this.lessonProgressService.completeLesson(this.enrollmentId, this.currentLesson.id).subscribe({
        next: () => {
          this.lessonProgressMap.set(this.currentLesson!.id, true);
          this.loadEnrollment(); // Rafraîchir la progression globale
        }
      });
    }
  }

  onQuizCompleted(event: { score: number; passed: boolean }) {
    if (this.enrollmentId && this.currentLesson && event.passed) {
      this.lessonProgressService.completeLesson(
        this.enrollmentId,
        this.currentLesson.id,
        event.score
      ).subscribe({
        next: () => {
          this.lessonProgressMap.set(this.currentLesson!.id, true);
          this.loadEnrollment();
        }
      });
    }
  }

  markExerciseComplete() {
    if (this.enrollmentId && this.currentLesson) {
      this.lessonProgressService.completeLesson(this.enrollmentId, this.currentLesson.id).subscribe({
        next: () => {
          this.lessonProgressMap.set(this.currentLesson!.id, true);
          this.loadEnrollment();
        }
      });
    }
  }

  formatTextContent(content: string): string {
    if (!content) return '';
    // Convertir les retours à la ligne en <br>
    return content.replace(/\n/g, '<br>');
  }

  parseQuiz(content: string): Quiz | undefined {
    if (!content) return undefined;
    
    try {
      // Si le contenu est du JSON
      const quizData = JSON.parse(content);
      return quizData as Quiz;
    } catch {
      // Sinon, créer un quiz simple depuis le texte
      // TODO: Implémenter un parser de quiz depuis texte
      return undefined;
    }
  }

  getLessonTypeLabel(type: LessonType): string {
    const labels: Record<LessonType, string> = {
      [LessonType.VIDEO]: 'Vidéo',
      [LessonType.TEXT]: 'Texte',
      [LessonType.QUIZ]: 'Quiz',
      [LessonType.EXERCISE]: 'Exercice',
      [LessonType.DOWNLOAD]: 'Téléchargement'
    };
    return labels[type] || type;
  }

  goBack() {
    this.router.navigate(['/formations', this.formationId]);
  }
}

