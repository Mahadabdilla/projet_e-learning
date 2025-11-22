import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Certificate {
  id: number;
  userId: number;
  formationId: number;
  certificateUrl?: string;
  certificateCode: string;
  issuedAt: string;
  formation?: {
    id: number;
    title: string;
    category?: string;
    level?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private apiUrl = 'http://localhost:8080/api/certificates';

  constructor(private http: HttpClient) {}

  /**
   * Génère et télécharge un certificat PDF
   */
  generateCertificate(enrollmentId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/enrollment/${enrollmentId}/generate`, {
      responseType: 'blob'
    });
  }

  /**
   * Vérifie si un certificat peut être généré
   */
  canGenerateCertificate(enrollmentId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/enrollment/${enrollmentId}/can-generate`);
  }

  /**
   * Récupère tous les certificats de l'utilisateur connecté
   */
  getMyCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.apiUrl}/my-certificates`);
  }

  /**
   * Vérifie un certificat par son code
   */
  verifyCertificate(certificateCode: string): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.apiUrl}/verify/${certificateCode}`);
  }

  /**
   * Télécharge un fichier blob en tant que PDF
   */
  downloadPdf(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}




