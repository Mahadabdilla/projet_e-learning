import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../../shared/models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Charger l'utilisateur depuis localStorage au démarrage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    console.log('📡 Envoi de la requête d\'inscription à:', `${this.apiUrl}/register`);
    console.log('📝 Données:', request);
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request)
      .pipe(
        tap({
          next: (response) => {
            console.log('✅ Inscription réussie:', response);
            this.setCurrentUser(response);
          },
          error: (error) => {
            console.error('❌ Erreur lors de l\'inscription:', error);
            console.error('Status:', error.status);
            console.error('Message:', error.message);
            console.error('URL:', error.url);
            if (error.status === 0) {
              console.error('⚠️ Le backend n\'est pas accessible. Vérifiez qu\'il est démarré sur http://localhost:8080');
            }
          }
        })
      );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    console.log('📡 Envoi de la requête de connexion à:', `${this.apiUrl}/login`);
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap({
          next: (response) => {
            console.log('✅ Connexion réussie:', response);
            this.setCurrentUser(response);
          },
          error: (error) => {
            console.error('❌ Erreur lors de la connexion:', error);
            console.error('Status:', error.status);
            console.error('Message:', error.message);
            if (error.status === 0) {
              console.error('⚠️ Le backend n\'est pas accessible. Vérifiez qu\'il est démarré sur http://localhost:8080');
            }
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private setCurrentUser(user: AuthResponse): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', user.token);
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }
}
