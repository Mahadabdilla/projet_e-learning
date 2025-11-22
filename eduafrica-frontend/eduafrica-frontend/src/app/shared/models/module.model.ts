export interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
  formationId: number;
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: number;
  title: string;
  description?: string;
  content: string;
  order: number;
  lessonType: LessonType;
  videoUrl?: string;
  durationMinutes?: number;
  isFreePreview: boolean;
  moduleId: number;
  createdAt?: string;
  updatedAt?: string;
}

export enum LessonType {
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
  QUIZ = 'QUIZ',
  EXERCISE = 'EXERCISE',
  DOWNLOAD = 'DOWNLOAD'
}

