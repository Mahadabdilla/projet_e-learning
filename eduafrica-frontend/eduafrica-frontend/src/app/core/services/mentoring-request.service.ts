import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MentoringRequest {
  id: number;
  mentorProfile: any;
  apprenant: any;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class MentoringRequestService {
  private apiUrl = 'http://localhost:8080/api/mentoring-requests';

  constructor(private http: HttpClient) {}

  createMentoringRequest(mentorProfileId: number, message: string): Observable<MentoringRequest> {
    return this.http.post<MentoringRequest>(`${this.apiUrl}/mentor/${mentorProfileId}`, {
      message: message
    });
  }

  getMyMentoringRequests(): Observable<MentoringRequest[]> {
    return this.http.get<MentoringRequest[]>(`${this.apiUrl}/my-requests`);
  }

  getMentorRequests(mentorProfileId: number): Observable<MentoringRequest[]> {
    return this.http.get<MentoringRequest[]>(`${this.apiUrl}/mentor/${mentorProfileId}`);
  }

  updateRequestStatus(requestId: number, status: string): Observable<MentoringRequest> {
    return this.http.put<MentoringRequest>(`${this.apiUrl}/${requestId}/status`, {
      status: status
    });
  }

  getRequestById(requestId: number): Observable<MentoringRequest> {
    return this.http.get<MentoringRequest>(`${this.apiUrl}/${requestId}`);
  }

  getMyMentorRequests(): Observable<MentoringRequest[]> {
    return this.http.get<MentoringRequest[]>(`${this.apiUrl}/my-mentor-requests`);
  }
}

