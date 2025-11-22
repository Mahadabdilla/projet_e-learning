import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../../core/services/review.service';
import { Review } from '../../../shared/models/review.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit, OnChanges {
  @Input() formationId!: number;
  @Input() refreshTrigger?: number; // Pour forcer le rafraîchissement
  
  reviews: Review[] = [];
  loading = false;
  errorMessage: string | null = null;
  currentUserEmail: string | null = null;

  constructor(
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadReviews();
    this.authService.currentUser$.subscribe(user => {
      this.currentUserEmail = user?.email || null;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // Rafraîchir quand refreshTrigger change
    if (changes['refreshTrigger'] && this.refreshTrigger !== undefined) {
      this.loadReviews();
    }
  }

  loadReviews() {
    this.loading = true;
    this.errorMessage = null;
    
    this.reviewService.getFormationReviews(this.formationId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des avis:', err);
        this.errorMessage = 'Erreur lors du chargement des avis';
        this.loading = false;
      }
    });
  }

  isMyReview(review: Review): boolean {
    return this.currentUserEmail === review.user.email;
  }

  deleteReview(reviewId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      this.reviewService.deleteReview(reviewId).subscribe({
        next: () => {
          this.loadReviews();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          this.errorMessage = 'Erreur lors de la suppression de l\'avis';
        }
      });
    }
  }

  getStars(rating: number): string[] {
    const stars: string[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? '★' : '☆');
    }
    return stars;
  }
}

