import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LessonProgress } from '../../shared/models/lesson-progress.model';

@Injectable({
  providedIn: 'root'
})
export class LessonProgressService {
  private apiUrl = 'http://localhost:8080/api/lesson-progress';

  constructor(private http: HttpClient) { }

  getProgress(enrollmentId: number, lessonId: number): Observable<LessonProgress> {
    return this.http.get<LessonProgress>(`${this.apiUrl}/enrollment/${enrollmentId}/lesson/${lessonId}`);
  }

  updateProgress(
    enrollmentId: number, 
    lessonId: number, 
    progressPercentage: number, 
    timeSpentSeconds: number
  ): Observable<LessonProgress> {
    return this.http.put<LessonProgress>(
      `${this.apiUrl}/enrollment/${enrollmentId}/lesson/${lessonId}`,
      {},
      {
        params: {
          progressPercentage: progressPercentage.toString(),
          timeSpentSeconds: timeSpentSeconds.toString()
        }
      }
    );
  }

  completeLesson(enrollmentId: number, lessonId: number, quizScore?: number): Observable<LessonProgress> {
    const params: any = {};
    if (quizScore !== undefined) {
      params.quizScore = quizScore.toString();
    }
    return this.http.post<LessonProgress>(
      `${this.apiUrl}/enrollment/${enrollmentId}/lesson/${lessonId}/complete`,
      {},
      { params }
    );
  }

  getEnrollmentProgress(enrollmentId: number): Observable<LessonProgress[]> {
    return this.http.get<LessonProgress[]>(`${this.apiUrl}/enrollment/${enrollmentId}`);
  }
}




