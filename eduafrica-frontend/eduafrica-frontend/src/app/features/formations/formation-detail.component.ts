import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormationService } from '../../core/services/formation.service';
import { ContentService } from '../../core/services/content.service';
import { Formation } from '../../shared/models/formation.model';
import { Module, Lesson, LessonType } from '../../shared/models/module.model';
import { ReviewsComponent } from './reviews/reviews.component';
import { CreateReviewComponent } from './create-review/create-review.component';

@Component({
  selector: 'app-formation-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReviewsComponent, CreateReviewComponent],
  template: `
    <div class="container mx-auto px-4 py-8" *ngIf="formation">
      <!-- En-tête de la formation -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 class="text-3xl font-bold mb-4">{{ formation.title }}</h1>
        <p class="text-gray-600 mb-4">{{ formation.description }}</p>
        <div class="flex flex-wrap gap-4 text-sm items-center">
          <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded">{{ formation.category }}</span>
          <span class="px-3 py-1 bg-green-100 text-green-800 rounded">{{ formation.level }}</span>
          <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded">{{ formation.duration }}h</span>
          <span *ngIf="formation.isFree" class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded">Gratuit</span>
          <span *ngIf="!formation.isFree" class="px-3 py-1 bg-gray-100 text-gray-800 rounded">
            {{ formation.price | number }} FCFA
          </span>
          <span *ngIf="formation.averageRating && formation.averageRating > 0" 
                class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded flex items-center gap-1">
            <span>★</span>
            <span>{{ formation.averageRating | number:'1.1-1' }}/5</span>
          </span>
        </div>
      </div>

      <!-- Modules et Leçons -->
      <div *ngIf="modules.length > 0" class="space-y-6">
        <h2 class="text-2xl font-bold mb-4">Contenu de la formation</h2>
        <div *ngFor="let module of modules" class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-xl font-semibold mb-2">{{ module.title }}</h3>
          <p class="text-gray-600 mb-4">{{ module.description }}</p>
          
          <div class="space-y-3">
            <div *ngFor="let lesson of module.lessons" 
                 class="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 rounded">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-sm font-medium text-gray-500">{{ lesson.order }}.</span>
                  <h4 class="font-medium">{{ lesson.title }}</h4>
                  <span *ngIf="lesson.isFreePreview" 
                        class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Aperçu gratuit</span>
                </div>
                <div class="flex items-center gap-4 text-sm text-gray-500">
                  <span>{{ getLessonTypeLabel(lesson.lessonType) }}</span>
                  <span *ngIf="lesson.durationMinutes">{{ lesson.durationMinutes }} min</span>
                </div>
              </div>
              <p *ngIf="lesson.content" class="text-sm text-gray-600 mt-1">{{ lesson.content }}</p>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="modules.length === 0 && !loading" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p class="text-yellow-800">Aucun contenu disponible pour cette formation.</p>
      </div>

      <div *ngIf="loading" class="text-center py-8">
        <p class="text-gray-500">Chargement du contenu...</p>
      </div>

      <!-- Section Avis -->
      <div *ngIf="formation && !loading" class="mt-8">
        <app-create-review 
          [formationId]="formation.id!"
          (reviewCreated)="onReviewCreated()">
        </app-create-review>
        
        <app-reviews 
          [formationId]="formation.id!"
          [refreshTrigger]="reviewRefreshTrigger">
        </app-reviews>
      </div>
    </div>
  `,
  styles: []
})
export class FormationDetailComponent implements OnInit {
  formation: Formation | null = null;
  modules: Module[] = [];
  loading = true;
  reviewRefreshTrigger = 0;

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService,
    private contentService: ContentService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFormation(+id);
    }
  }

  loadFormation(id: number) {
    this.loading = true;
    this.formationService.getFormationById(id).subscribe({
      next: (formation) => {
        this.formation = formation;
        this.loadModules(id);
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la formation:', err);
        this.loading = false;
      }
    });
  }

  loadModules(formationId: number) {
    this.contentService.getModulesByFormation(formationId).subscribe({
      next: (modules) => {
        this.modules = modules;
        // Charger les leçons pour chaque module
        modules.forEach(module => {
          this.contentService.getLessonsByModule(module.id).subscribe({
            next: (lessons) => {
              module.lessons = lessons;
            }
          });
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des modules:', err);
        this.loading = false;
      }
    });
  }

  getLessonTypeLabel(type: LessonType): string {
    const labels: { [key in LessonType]: string } = {
      VIDEO: '📹 Vidéo',
      TEXT: '📄 Texte',
      QUIZ: '❓ Quiz',
      EXERCISE: '✏️ Exercice',
      DOWNLOAD: '📥 Téléchargement'
    };
    return labels[type] || type;
  }

  onReviewCreated() {
    // Incrémenter le trigger pour forcer le rafraîchissement de la liste des avis
    this.reviewRefreshTrigger++;
    // Recharger la formation pour mettre à jour la note moyenne
    if (this.formation) {
      this.formationService.getFormationById(this.formation.id!).subscribe({
        next: (formation) => {
          this.formation = formation;
        }
      });
    }
  }
}
