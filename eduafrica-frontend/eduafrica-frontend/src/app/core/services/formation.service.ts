import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formation, FormationFilters, PageResponse } from '../../shared/models/formation.model';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  private apiUrl = 'http://localhost:8080/api/formations';

  constructor(private http: HttpClient) {}

  getAllFormations(page: number = 0, size: number = 12): Observable<PageResponse<Formation>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<Formation>>(this.apiUrl, { params });
  }

  getFormationById(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/${id}`);
  }

  searchFormations(keyword: string, page: number = 0, size: number = 12): Observable<PageResponse<Formation>> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<Formation>>(`${this.apiUrl}/search`, { params });
  }

  filterFormations(filters: FormationFilters, page: number = 0, size: number = 12): Observable<PageResponse<Formation>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters.category) {
      params = params.set('category', filters.category);
    }
    if (filters.level) {
      params = params.set('level', filters.level);
    }
    if (filters.isFree !== undefined) {
      params = params.set('isFree', filters.isFree.toString());
    }

    return this.http.get<PageResponse<Formation>>(`${this.apiUrl}/filter`, { params });
  }

  createFormation(formation: Partial<Formation>): Observable<Formation> {
    return this.http.post<Formation>(this.apiUrl, formation);
  }

  updateFormation(id: number, formation: Partial<Formation>): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/${id}`, formation);
  }

  deleteFormation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMyFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.apiUrl}/my-formations`);
  }

  getFormateurStats(): Observable<{totalFormations: number, totalStudents: number, averageRating: number, estimatedRevenue: number}> {
    return this.http.get<{totalFormations: number, totalStudents: number, averageRating: number, estimatedRevenue: number}>(`${this.apiUrl}/formateur/stats`);
  }
}
