import { User } from './user.model';

export enum NotificationType {
  ENROLLMENT = 'ENROLLMENT',
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  MENTORING_REQUEST = 'MENTORING_REQUEST',
  MENTORING_ACCEPTED = 'MENTORING_ACCEPTED',
  MENTORING_REJECTED = 'MENTORING_REJECTED',
  FORMATION_COMPLETED = 'FORMATION_COMPLETED',
  NEW_MESSAGE = 'NEW_MESSAGE',
  REVIEW_RECEIVED = 'REVIEW_RECEIVED',
  SYSTEM = 'SYSTEM'
}

export interface Notification {
  id: number;
  user: User;
  type: NotificationType;
  title: string;
  message?: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
  readAt?: string;
}



