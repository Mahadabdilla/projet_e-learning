export interface LessonProgress {
  id: number;
  enrollmentId: number;
  lessonId: number;
  isCompleted: boolean;
  progressPercentage: number;
  timeSpentSeconds: number;
  lastAccessedAt?: string;
  completedAt?: string;
  quizScore?: number;
}




