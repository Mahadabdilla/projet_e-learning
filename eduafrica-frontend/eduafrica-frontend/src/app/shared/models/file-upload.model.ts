import { User } from './user.model';

export interface FileUpload {
  id: number;
  originalFileName: string;
  storedFileName: string;
  filePath: string;
  contentType: string;
  fileSize: number; // en bytes
  uploadedBy: User;
  fileType: string; // IMAGE, VIDEO, DOCUMENT, etc.
  createdAt: string;
}

export type FileType = 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'OTHER';



