import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';
import { CreateReviewRequest } from '../../../shared/models/review.model';

@Component({
  selector: 'app-create-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-review.component.html',
  styleUrls: ['./create-review.component.css']
})
export class CreateReviewComponent implements OnInit {
  @Input() formationId!: number;
  @Output() reviewCreated = new EventEmitter<void>();
  
  rating: number = 5;
  comment: string = '';
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  canReview = false;
  checkingCanReview = true;

  constructor(
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.checkIfCanReview();
  }

  checkIfCanReview() {
    this.checkingCanReview = true;
    this.reviewService.canReview(this.formationId).subscribe({
      next: (canReview) => {
        this.canReview = canReview;
        this.checkingCanReview = false;
      },
      error: (err) => {
        console.error('Erreur lors de la vérification:', err);
        this.canReview = false;
        this.checkingCanReview = false;
      }
    });
  }

  submitReview() {
    if (this.rating < 1 || this.rating > 5) {
      this.errorMessage = 'La note doit être entre 1 et 5';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const request: CreateReviewRequest = {
      rating: this.rating,
      comment: this.comment.trim() || undefined
    };

    this.reviewService.createReview(this.formationId, request).subscribe({
      next: () => {
        this.successMessage = 'Votre avis a été publié avec succès !';
        this.isLoading = false;
        this.rating = 5;
        this.comment = '';
        this.reviewCreated.emit();
        // Re-vérifier si l'utilisateur peut encore laisser un avis (normalement non)
        setTimeout(() => {
          this.checkIfCanReview();
          // Masquer le message de succès après 3 secondes
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        }, 1000);
      },
      error: (err) => {
        console.error('Erreur lors de la création de l\'avis:', err);
        this.errorMessage = err.error?.message || 'Erreur lors de la publication de l\'avis. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }

  setRating(rating: number) {
    this.rating = rating;
  }

  getStars(): string[] {
    const stars: string[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= this.rating ? '★' : '☆');
    }
    return stars;
  }
}

