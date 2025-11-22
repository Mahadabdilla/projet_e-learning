import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Enrollment {
  id: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  formation: any;
  progress: number;
  enrolledAt: string;
  completedAt?: string;
  lastAccessedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = 'http://localhost:8080/api/enrollments';

  constructor(private http: HttpClient) {}

  getMyEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/my-enrollments`);
  }

  enrollToFormation(formationId: number): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${this.apiUrl}/${formationId}`, {});
  }

  updateProgress(enrollmentId: number, progress: number): Observable<Enrollment> {
    return this.http.put<Enrollment>(`${this.apiUrl}/${enrollmentId}/progress?progress=${progress}`, {});
  }

  getFormationEnrollments(formationId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/formation/${formationId}`);
  }
}


