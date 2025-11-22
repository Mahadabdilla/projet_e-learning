import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review, CreateReviewRequest, UpdateReviewRequest } from '../../shared/models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:8080/api/reviews';

  constructor(private http: HttpClient) {}

  /**
   * Créer un avis pour une formation
   */
  createReview(formationId: number, request: CreateReviewRequest): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/formation/${formationId}`, request);
  }

  /**
   * Mettre à jour un avis
   */
  updateReview(reviewId: number, request: UpdateReviewRequest): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${reviewId}`, request);
  }

  /**
   * Supprimer un avis
   */
  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${reviewId}`);
  }

  /**
   * Récupérer tous les avis d'une formation
   */
  getFormationReviews(formationId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/formation/${formationId}`);
  }

  /**
   * Récupérer tous les avis de l'utilisateur connecté
   */
  getMyReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/my-reviews`);
  }

  /**
   * Vérifier si l'utilisateur peut laisser un avis
   */
  canReview(formationId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/formation/${formationId}/can-review`);
  }
}



