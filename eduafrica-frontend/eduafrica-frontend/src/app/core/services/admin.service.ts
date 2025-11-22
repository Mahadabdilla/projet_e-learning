import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  /**
   * Obtenir les statistiques globales de la plateforme
   */
  getPlatformStats(): Observable<any> {
    console.log('📡 Appel API:', `${this.apiUrl}/stats`);
    return this.http.get<any>(`${this.apiUrl}/stats`).pipe(
      tap(data => console.log('📥 Réponse reçue:', data)),
      catchError(error => {
        console.error('❌ Erreur HTTP:', error);
        throw error;
      })
    );
  }

  /**
   * Récupérer tous les utilisateurs
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  /**
   * Changer le rôle d'un utilisateur
   */
  changeUserRole(userId: number, role: string): Observable<User> {
    const params = new HttpParams().set('role', role);
    return this.http.put<User>(`${this.apiUrl}/users/${userId}/role`, {}, { params });
  }

  /**
   * Supprimer un utilisateur
   */
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
  }

  /**
   * Récupérer toutes les formations
   */
  getAllFormations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/formations`);
  }

  /**
   * Supprimer une formation
   */
  deleteFormation(formationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/formations/${formationId}`);
  }

  /**
   * Récupérer tous les paiements
   */
  getAllPayments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/payments`);
  }

  /**
   * Récupérer tous les avis
   */
  getAllReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reviews`);
  }

  /**
   * Supprimer un avis
   */
  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reviews/${reviewId}`);
  }
}

