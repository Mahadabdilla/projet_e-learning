import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { Notification } from '../../shared/models/notification.model';
import { startWith, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8080/api/notifications';
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {
    // Polling toutes les 30 secondes pour les notifications non lues
    interval(30000).pipe(
      startWith(0),
      switchMap(() => this.getUnreadCount())
    ).subscribe(count => {
      this.unreadCountSubject.next(count);
    });
  }

  /**
   * Récupérer toutes les notifications de l'utilisateur connecté
   */
  getMyNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}`);
  }

  /**
   * Récupérer les notifications non lues
   */
  getUnreadNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/unread`);
  }

  /**
   * Compter les notifications non lues
   */
  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread/count`);
  }

  /**
   * Marquer une notification comme lue
   */
  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${notificationId}/read`, {});
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/read-all`, {});
  }

  /**
   * Supprimer une notification
   */
  deleteNotification(notificationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${notificationId}`);
  }

  /**
   * Supprimer toutes les notifications lues
   */
  deleteAllReadNotifications(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/read`);
  }

  /**
   * Rafraîchir le compteur de notifications non lues
   */
  refreshUnreadCount(): void {
    this.getUnreadCount().subscribe(count => {
      this.unreadCountSubject.next(count);
    });
  }
}



