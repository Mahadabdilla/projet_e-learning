import { User } from './user.model';
import { Formation } from './formation.model';

export interface Review {
  id: number;
  user: User;
  formation: Formation;
  rating: number; // 1-5
  comment?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  rating: number;
  comment?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
}



