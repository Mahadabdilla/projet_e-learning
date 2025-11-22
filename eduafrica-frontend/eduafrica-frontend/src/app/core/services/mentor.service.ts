import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MentorProfile {
  id: number;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
  };
  specialty: string;
  bio: string;
  rating: number;
  nbSessions: number;
  hourlyRate: number;
  avatarUrl?: string;
  isAvailable: boolean;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class MentorService {
  private apiUrl = 'http://localhost:8080/api/mentors';

  constructor(private http: HttpClient) {}

  getAllMentors(page: number = 0, size: number = 12): Observable<PageResponse<MentorProfile>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<MentorProfile>>(`${this.apiUrl}/list`, { params });
  }

  getAvailableMentors(page: number = 0, size: number = 12): Observable<PageResponse<MentorProfile>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<MentorProfile>>(`${this.apiUrl}/available`, { params });
  }

  getMentorById(id: number): Observable<MentorProfile> {
    return this.http.get<MentorProfile>(`${this.apiUrl}/${id}`);
  }

  searchMentors(keyword: string, page: number = 0, size: number = 12): Observable<PageResponse<MentorProfile>> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<MentorProfile>>(`${this.apiUrl}/search`, { params });
  }

  getMyStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-stats`);
  }

  updateAvailability(isAvailable: boolean): Observable<MentorProfile> {
    const params = new HttpParams().set('isAvailable', isAvailable.toString());
    return this.http.put<MentorProfile>(`${this.apiUrl}/availability`, {}, { params });
  }
}

