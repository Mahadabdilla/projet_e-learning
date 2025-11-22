import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUpload } from '../../shared/models/file-upload.model';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = 'http://localhost:8080/api/files';

  constructor(private http: HttpClient) {}

  /**
   * Upload un fichier
   */
  uploadFile(
    file: File,
    fileType?: string,
    maxSizeMB?: number
  ): Observable<FileUpload> {
    const formData = new FormData();
    formData.append('file', file);
    
    let params = new HttpParams();
    if (fileType) {
      params = params.set('fileType', fileType);
    }
    if (maxSizeMB) {
      params = params.set('maxSizeMB', maxSizeMB.toString());
    }

    return this.http.post<FileUpload>(`${this.apiUrl}/upload`, formData, { params });
  }

  /**
   * Télécharger un fichier
   */
  downloadFile(fileId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${fileId}/download`, {
      responseType: 'blob'
    });
  }

  /**
   * Obtenir l'URL pour afficher un fichier
   */
  getFileUrl(fileId: number): string {
    return `${this.apiUrl}/${fileId}/view`;
  }

  /**
   * Récupérer les fichiers de l'utilisateur connecté
   */
  getMyFiles(): Observable<FileUpload[]> {
    return this.http.get<FileUpload[]>(`${this.apiUrl}/my-files`);
  }

  /**
   * Récupérer les informations d'un fichier
   */
  getFileInfo(fileId: number): Observable<FileUpload> {
    return this.http.get<FileUpload>(`${this.apiUrl}/${fileId}`);
  }

  /**
   * Supprimer un fichier
   */
  deleteFile(fileId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${fileId}`);
  }

  /**
   * Formater la taille d'un fichier
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}



