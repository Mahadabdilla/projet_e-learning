import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EnrollmentService, Enrollment } from '../../../core/services/enrollment.service';
import { CertificateService, Certificate } from '../../../core/services/certificate.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-apprenant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <div class="dashboard-header">
        <h1 class="header-title">Prêt à continuer votre apprentissage ?</h1>
      </div>

      <div class="dashboard-content">
        <!-- 4 Cartes de statistiques -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon-wrapper">
              <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div class="stat-content">
              <p class="stat-label">Cours inscrits</p>
              <p class="stat-value">{{ totalEnrollments }}</p>
              <p class="stat-subtitle">{{ inProgressCount }} en cours</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrapper">
              <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
              </svg>
            </div>
            <div class="stat-content">
              <p class="stat-label">Certificats</p>
              <p class="stat-value">{{ completedCount }}</p>
              <p class="stat-subtitle">+{{ certificatesThisMonth }} ce mois-ci</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrapper">
              <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="stat-content">
              <p class="stat-label">Série d'étude</p>
              <p class="stat-value">{{ studyStreak }} jours</p>
              <p class="stat-subtitle">Record: {{ studyStreakRecord }} jours</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrapper">
              <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div class="stat-content">
              <p class="stat-label">Temps total</p>
              <p class="stat-value">{{ totalHours }}h</p>
              <p class="stat-subtitle">Ce mois</p>
            </div>
          </div>
        </div>

        <!-- Deux colonnes principales -->
        <div class="main-grid">
          <!-- Colonne gauche : Mes cours en cours -->
          <div class="left-column">
            <div class="section-card">
          <div class="section-header">
                <h2 class="section-title">Mes cours en cours</h2>
                <p class="section-subtitle">Continuez là où vous vous êtes arrêté</p>
          </div>

              <div *ngIf="loading" class="loading-state">
                <div class="spinner"></div>
            <p>Chargement...</p>
          </div>

              <div *ngIf="!loading && inProgressCourses.length === 0" class="empty-state">
                <p>Aucun cours en cours</p>
                <a routerLink="/formations" class="btn-primary">Découvrir les formations</a>
              </div>

              <div *ngIf="!loading && inProgressCourses.length > 0" class="courses-list">
                <div *ngFor="let enrollment of inProgressCourses" class="course-card">
                  <div class="course-header">
                    <h3 class="course-title">{{ enrollment.formation?.title || 'Formation' }}</h3>
                    <p class="course-instructor">
                      {{ getInstructorTitle(enrollment.formation?.formateur) }} {{ enrollment.formation?.formateur?.firstName || '' }} {{ enrollment.formation?.formateur?.lastName || '' }}
                    </p>
                  </div>
                  
              <div class="progress-section">
                    <div class="progress-bar-container">
                      <div class="progress-bar" [style.width.%]="enrollment.progress"></div>
                    </div>
                    <p class="progress-text">{{ enrollment.progress }}%</p>
                  </div>

                  <p class="next-topic" *ngIf="getNextTopic(enrollment)">
                    Prochain: {{ getNextTopic(enrollment) }}
                  </p>

                  <a [routerLink]="['/course', enrollment.formation?.id, enrollment.id]" class="btn-continue" *ngIf="enrollment.formation?.id">
                    Continuer
                  </a>
                </div>
              </div>

              <!-- Mes certificats -->
              <div class="section-card" *ngIf="completedEnrollments.length > 0">
                <div class="section-header">
                  <h2 class="section-title">Mes certificats</h2>
                  <p class="section-subtitle">Formations complétées</p>
                </div>

                <div class="certificates-list">
                  <div *ngFor="let enrollment of completedEnrollments" class="certificate-card">
                    <div class="certificate-info">
                      <h4 class="certificate-title">{{ enrollment.formation?.title || 'Formation' }}</h4>
                      <p class="certificate-date">Complété le {{ enrollment.completedAt ? formatDate(enrollment.completedAt) : 'Date inconnue' }}</p>
                    </div>
                    <button 
                      (click)="downloadCertificate(enrollment.id)"
                      [disabled]="downloadingCertificates.has(enrollment.id)"
                      class="btn-download-certificate">
                      <span *ngIf="!downloadingCertificates.has(enrollment.id)">📄 Télécharger</span>
                      <span *ngIf="downloadingCertificates.has(enrollment.id)">⏳ Génération...</span>
              </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Colonne droite : Mentor et Objectif -->
          <div class="right-column">
            <!-- Mon mentor -->
            <div class="section-card">
              <div class="section-header">
                <div class="section-title-with-icon">
                  <svg class="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <h2 class="section-title">Mon mentor</h2>
                </div>
              </div>

              <div *ngIf="mentor" class="mentor-content">
                <p class="mentor-name">{{ mentor.name }}</p>
                <div *ngIf="mentor.nextSession" class="next-session">
                  <p class="session-label">Prochaine session</p>
                  <div class="session-details">
                    <svg class="session-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>{{ formatSessionDate(mentor.nextSession.date) }} à {{ mentor.nextSession.time }}</span>
                  </div>
                  <p class="session-topic">{{ mentor.nextSession.topic }}</p>
                </div>
                <button class="btn-join-session" *ngIf="mentor.nextSession">
                  Rejoindre la session
                </button>
              </div>

              <div *ngIf="!mentor" class="no-mentor">
                <p>Aucun mentor assigné</p>
          </div>
        </div>

            <!-- Objectif quotidien -->
            <div class="section-card">
              <div class="section-header">
                <h2 class="section-title">Objectif quotidien</h2>
              </div>

              <div class="daily-goal-content">
                <div class="goal-progress">
                  <p class="goal-time">{{ dailyGoalCurrent }} min / {{ dailyGoalTarget }} min</p>
                  <p class="goal-percentage">{{ dailyGoalPercentage }}%</p>
                </div>
                <div class="goal-progress-bar-container">
                  <div class="goal-progress-bar" [style.width.%]="dailyGoalPercentage"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: #f5f5f5;
      padding-bottom: 2rem;
    }

    .dashboard-header {
      background: white;
      padding: 2rem;
      border-bottom: 1px solid #e5e5e5;
    }

    .header-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
    }

    .dashboard-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    /* Grille de statistiques */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      position: relative;
    }

    .stat-icon-wrapper {
      flex-shrink: 0;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      color: #667eea;
    }

    .stat-content {
      flex: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 0.25rem;
      line-height: 1.2;
    }

    .stat-subtitle {
      font-size: 0.875rem;
      color: #9ca3af;
      margin: 0;
    }

    /* Grille principale */
    .main-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }

    .section-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      margin-bottom: 1.5rem;
    }

    .section-header {
      margin-bottom: 1.5rem;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 0.5rem 0;
    }

    .section-title-with-icon {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .section-icon {
      width: 24px;
      height: 24px;
      color: #667eea;
    }

    .section-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    /* Liste des cours */
    .courses-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .course-card {
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.2s ease;
    }

    .course-card:hover {
      border-color: #667eea;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
    }

    .course-header {
      margin-bottom: 1rem;
    }

    .course-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 0.5rem 0;
    }

    .course-instructor {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .progress-section {
      margin-bottom: 1rem;
    }

    .progress-bar-container {
      width: 100%;
      height: 8px;
      background: #e5e5e5;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-bar {
      height: 100%;
      background: #667eea;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: 0.875rem;
      color: #667eea;
      font-weight: 600;
      margin: 0;
    }

    .next-topic {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0 0 1rem 0;
    }

    .btn-continue {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: #667eea;
      color: white;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .btn-continue:hover {
      background: #5568d3;
      transform: translateY(-1px);
    }

    /* Section mentor */
    .mentor-content {
      padding-top: 0.5rem;
    }

    .mentor-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 1rem 0;
    }

    .next-session {
      margin-bottom: 1rem;
    }

    .session-label {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0 0 0.5rem 0;
    }

    .session-details {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: #1a1a1a;
    }

    .session-icon {
      width: 18px;
      height: 18px;
      color: #667eea;
    }

    .session-topic {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .btn-join-session {
      width: 100%;
      padding: 0.75rem;
      background: white;
      border: 2px solid #667eea;
      color: #667eea;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 1rem;
    }

    .btn-join-session:hover {
      background: #667eea;
      color: white;
    }

    .no-mentor {
      padding: 2rem 0;
      text-align: center;
      color: #9ca3af;
    }

    /* Objectif quotidien */
    .daily-goal-content {
      padding-top: 0.5rem;
    }

    .goal-progress {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .goal-time {
      font-size: 0.875rem;
      color: #1a1a1a;
      font-weight: 500;
      margin: 0;
    }

    .goal-percentage {
      font-size: 0.875rem;
      color: #667eea;
      font-weight: 600;
      margin: 0;
    }

    .goal-progress-bar-container {
      width: 100%;
      height: 8px;
      background: #e5e5e5;
      border-radius: 4px;
      overflow: hidden;
    }

    .goal-progress-bar {
      height: 100%;
      background: #667eea;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    /* États */
    .loading-state {
      text-align: center;
      padding: 3rem 2rem;
      color: #6b7280;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e5e5e5;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      color: #9ca3af;
    }

    .btn-primary {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: #667eea;
      color: white;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .btn-primary:hover {
      background: #5568d3;
    }

    /* Certificats */
    .certificates-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .certificate-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .certificate-card:hover {
      border-color: #667eea;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
    }

    .certificate-info {
      flex: 1;
    }

    .certificate-title {
      font-size: 1rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 0.25rem 0;
    }

    .certificate-date {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .btn-download-certificate {
      padding: 0.5rem 1rem;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-download-certificate:hover:not(:disabled) {
      background: #059669;
      transform: translateY(-1px);
    }

    .btn-download-certificate:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .main-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .dashboard-content {
        padding: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .dashboard-header {
        padding: 1.5rem;
      }

      .header-title {
        font-size: 1.25rem;
      }
    }
  `]
})
export class ApprenantDashboardComponent implements OnInit {
  enrollments: Enrollment[] = [];
  certificates: Certificate[] = [];
  loading = true;
  currentUser: any = null;
  mentor: any = null;
  downloadingCertificates = new Set<number>();

  constructor(
    private enrollmentService: EnrollmentService,
    private certificateService: CertificateService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadEnrollments();
    this.loadCertificates();
    this.loadMentor();
  }

  loadEnrollments() {
    this.loading = true;
    this.enrollmentService.getMyEnrollments().subscribe({
      next: (enrollments) => {
        this.enrollments = enrollments;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des inscriptions:', err);
        this.loading = false;
        }
      });
  }

  loadMentor() {
    // TODO: Implémenter le chargement du mentor depuis l'API
    // Pour l'instant, données mockées
    this.mentor = {
      name: 'Fatou Sow',
      nextSession: {
        date: '2025-11-22',
        time: '14:00',
        topic: 'Career guidance'
      }
    };
  }

  get totalEnrollments(): number {
    return this.enrollments.length;
  }

  get inProgressCount(): number {
    return this.enrollments.filter(e => !e.completedAt && e.progress < 100).length;
  }

  get completedCount(): number {
    return this.enrollments.filter(e => e.completedAt || e.progress === 100).length;
  }

  get certificatesThisMonth(): number {
    // TODO: Calculer les certificats obtenus ce mois-ci
    return 1;
  }

  get studyStreak(): number {
    // TODO: Calculer la série d'étude actuelle
    return 12;
  }

  get studyStreakRecord(): number {
    // TODO: Récupérer le record de série d'étude
    return 28;
  }

  get totalHours(): number {
    return this.enrollments.reduce((sum, e) => {
      return sum + (e.formation?.duration || 0);
    }, 0);
  }

  get inProgressCourses(): Enrollment[] {
    return this.enrollments
      .filter(e => !e.completedAt && e.progress < 100)
      .slice(0, 5); // Limiter à 5 cours
  }

  get completedEnrollments(): Enrollment[] {
    return this.enrollments
      .filter(e => e.completedAt || e.progress === 100)
      .slice(0, 5); // Limiter à 5 certificats
  }

  loadCertificates() {
    this.certificateService.getMyCertificates().subscribe({
      next: (certificates) => {
        this.certificates = certificates;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des certificats:', err);
      }
    });
  }

  downloadCertificate(enrollmentId: number) {
    this.downloadingCertificates.add(enrollmentId);
    
    this.certificateService.generateCertificate(enrollmentId).subscribe({
      next: (blob) => {
        const enrollment = this.enrollments.find(e => e.id === enrollmentId);
        const filename = `certificat-${enrollment?.formation?.title || 'formation'}.pdf`;
        this.certificateService.downloadPdf(blob, filename);
        this.downloadingCertificates.delete(enrollmentId);
      },
      error: (err) => {
        console.error('Erreur lors de la génération du certificat:', err);
        alert('Erreur lors de la génération du certificat. Assurez-vous d\'avoir complété la formation.');
        this.downloadingCertificates.delete(enrollmentId);
      }
    });
  }

  get dailyGoalCurrent(): number {
    // TODO: Récupérer le temps d'étude d'aujourd'hui
    return 45;
  }

  get dailyGoalTarget(): number {
    return 60;
  }

  get dailyGoalPercentage(): number {
    return Math.round((this.dailyGoalCurrent / this.dailyGoalTarget) * 100);
  }

  getInstructorTitle(formateur: any): string {
    if (!formateur) return '';
    // Logique simple pour déterminer le titre
    return 'Dr.';
  }

  getNextTopic(enrollment: Enrollment): string {
    // TODO: Récupérer le prochain sujet depuis les modules/leçons
    if (enrollment.formation?.title?.includes('développement web')) {
      return 'HTML & CSS avancé';
    } else if (enrollment.formation?.title?.includes('Python')) {
      return 'Boucles et conditions';
    }
    return '';
  }

  formatSessionDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }
}
