export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  role: string;
}

export interface MentorProfile {
  id: number;
  user: User;
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



