import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Module, Lesson } from '../../shared/models/module.model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getModulesByFormation(formationId: number): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.apiUrl}/modules/formation/${formationId}`);
  }

  getLessonsByModule(moduleId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiUrl}/lessons/module/${moduleId}`);
  }

  getLessonsByFormation(formationId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiUrl}/lessons/formation/${formationId}`);
  }
}




