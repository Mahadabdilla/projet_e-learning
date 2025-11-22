import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadService } from '../../../core/services/file-upload.service';
import { FileUpload } from '../../models/file-upload.model';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  @Input() fileType?: string; // 'IMAGE', 'VIDEO', 'DOCUMENT'
  @Input() maxSizeMB: number = 10;
  @Input() multiple: boolean = false;
  @Input() accept?: string; // ex: 'image/*', 'video/*', '.pdf'
  
  @Output() fileUploaded = new EventEmitter<FileUpload>();
  @Output() uploadError = new EventEmitter<string>();
  @Output() filesSelected = new EventEmitter<File[]>();

  selectedFiles: File[] = [];
  uploadedFiles: FileUpload[] = [];
  isDragging = false;
  isUploading = false;
  uploadProgress: { [key: string]: number } = {};

  constructor(private fileUploadService: FileUploadService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFiles(Array.from(input.files));
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFiles(Array.from(event.dataTransfer.files));
    }
  }

  private handleFiles(files: File[]) {
    // Valider les fichiers
    const validFiles: File[] = [];
    
    for (const file of files) {
      // Vérifier la taille
      const maxSizeBytes = this.maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        this.uploadError.emit(
          `Le fichier "${file.name}" est trop volumineux. Taille maximale : ${this.maxSizeMB} MB`
        );
        continue;
      }

      // Vérifier le type
      if (this.accept && !this.isFileTypeAccepted(file)) {
        this.uploadError.emit(
          `Le type de fichier "${file.name}" n'est pas accepté. Types acceptés : ${this.accept}`
        );
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      return;
    }

    if (this.multiple) {
      this.selectedFiles = [...this.selectedFiles, ...validFiles];
    } else {
      this.selectedFiles = [validFiles[0]];
    }

    this.filesSelected.emit(this.selectedFiles);

    // Auto-upload si des fichiers sont sélectionnés
    if (this.selectedFiles.length > 0) {
      this.uploadFiles();
    }
  }

  private isFileTypeAccepted(file: File): boolean {
    if (!this.accept) return true;

    const acceptTypes = this.accept.split(',').map(t => t.trim());
    
    for (const acceptType of acceptTypes) {
      if (acceptType.startsWith('.')) {
        // Extension
        if (file.name.toLowerCase().endsWith(acceptType.toLowerCase())) {
          return true;
        }
      } else if (acceptType.includes('/*')) {
        // Type MIME générique (ex: image/*)
        const baseType = acceptType.split('/')[0];
        if (file.type.startsWith(baseType + '/')) {
          return true;
        }
      } else if (file.type === acceptType) {
        // Type MIME exact
        return true;
      }
    }

    return false;
  }

  uploadFiles() {
    if (this.selectedFiles.length === 0 || this.isUploading) {
      return;
    }

    this.isUploading = true;
    this.uploadProgress = {};

    const uploadPromises = this.selectedFiles.map(file => {
      return this.fileUploadService.uploadFile(file, this.fileType, this.maxSizeMB).toPromise()
        .then((fileUpload) => {
          if (fileUpload) {
            this.uploadedFiles.push(fileUpload);
            this.fileUploaded.emit(fileUpload);
            this.uploadProgress[file.name] = 100;
          }
        })
        .catch((error) => {
          console.error('Erreur lors de l\'upload:', error);
          this.uploadError.emit(`Erreur lors de l'upload de "${file.name}"`);
        });
    });

    Promise.all(uploadPromises).then(() => {
      this.isUploading = false;
      this.selectedFiles = [];
    });
  }

  removeFile(file: File) {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
    this.filesSelected.emit(this.selectedFiles);
  }

  removeUploadedFile(fileUpload: FileUpload) {
    this.fileUploadService.deleteFile(fileUpload.id).subscribe({
      next: () => {
        this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== fileUpload.id);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
        this.uploadError.emit('Erreur lors de la suppression du fichier');
      }
    });
  }

  getFileIcon(file: File): string {
    if (file.type.startsWith('image/')) {
      return '🖼️';
    } else if (file.type.startsWith('video/')) {
      return '🎥';
    } else if (file.type === 'application/pdf') {
      return '📄';
    } else {
      return '📎';
    }
  }

  formatFileSize(bytes: number): string {
    return this.fileUploadService.formatFileSize(bytes);
  }

  getFileUrl(fileId: number): string {
    return this.fileUploadService.getFileUrl(fileId);
  }
}


