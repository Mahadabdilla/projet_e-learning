import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index de la bonne réponse
  explanation?: string;
}

export interface Quiz {
  id: number;
  title: string;
  questions: QuizQuestion[];
  passingScore: number; // Score minimum pour réussir (en %)
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="quiz-container">
      <div class="quiz-header">
        <h3 class="quiz-title">{{ quiz?.title || 'Quiz' }}</h3>
        <div class="quiz-progress">
          <span>Question {{ currentQuestionIndex + 1 }} sur {{ (quiz?.questions?.length || 0) }}</span>
        </div>
      </div>

      <div *ngIf="!isQuizCompleted" class="quiz-content">
        <div class="question-card">
          <h4 class="question-text">{{ currentQuestion?.question }}</h4>
          
          <div class="options-list">
            <label 
              *ngFor="let option of currentQuestion?.options; let i = index"
              class="option-item"
              [class.selected]="selectedAnswers[currentQuestionIndex] === i"
              [class.correct]="showResults && i === currentQuestion?.correctAnswer"
              [class.incorrect]="showResults && selectedAnswers[currentQuestionIndex] === i && i !== currentQuestion?.correctAnswer">
              <input 
                type="radio" 
                [name]="'question-' + currentQuestionIndex"
                [value]="i"
                [(ngModel)]="selectedAnswers[currentQuestionIndex]"
                [disabled]="showResults">
              <span class="option-text">{{ option }}</span>
              <span *ngIf="showResults && i === currentQuestion?.correctAnswer" class="correct-badge">✓ Correct</span>
            </label>
          </div>

          <div *ngIf="showResults && currentQuestion?.explanation" class="explanation">
            <p><strong>Explication :</strong> {{ currentQuestion?.explanation }}</p>
          </div>
        </div>

        <div class="quiz-actions">
          <button 
            *ngIf="currentQuestionIndex > 0"
            (click)="previousQuestion()" 
            class="btn btn-secondary">
            ← Précédent
          </button>
          
          <button 
            *ngIf="currentQuestionIndex < ((quiz?.questions?.length || 0) - 1)"
            (click)="nextQuestion()" 
            class="btn btn-primary"
            [disabled]="selectedAnswers[currentQuestionIndex] === undefined">
            Suivant →
          </button>
          
          <button 
            *ngIf="currentQuestionIndex === ((quiz?.questions?.length || 0) - 1)"
            (click)="submitQuiz()" 
            class="btn btn-primary"
            [disabled]="selectedAnswers[currentQuestionIndex] === undefined">
            Terminer le quiz
          </button>
        </div>
      </div>

      <div *ngIf="isQuizCompleted" class="quiz-results">
        <div class="results-card" [class.passed]="score >= (quiz?.passingScore || 70)" [class.failed]="score < (quiz?.passingScore || 70)">
          <div class="results-icon">
            <span *ngIf="score >= (quiz?.passingScore || 70)">🎉</span>
            <span *ngIf="score < (quiz?.passingScore || 70)">😔</span>
          </div>
          <h3 class="results-title">
            {{ score >= (quiz?.passingScore || 70) ? 'Félicitations !' : 'Presque !' }}
          </h3>
          <p class="results-score">Votre score : {{ score }}%</p>
          <p class="results-details">
            {{ correctAnswers }} bonnes réponses sur {{ (quiz?.questions?.length || 0) }}
          </p>
          <p *ngIf="score < (quiz?.passingScore || 70)" class="results-message">
            Score minimum requis : {{ quiz?.passingScore || 70 }}%. Vous pouvez réessayer !
          </p>
          <button (click)="restartQuiz()" class="btn btn-primary">
            {{ score >= (quiz?.passingScore || 70) ? 'Continuer' : 'Réessayer' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quiz-container {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .quiz-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #f3f4f6;
    }

    .quiz-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0;
    }

    .quiz-progress {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .question-card {
      margin-bottom: 2rem;
    }

    .question-text {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    .options-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .option-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 2px solid #e5e5e5;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      background: white;
    }

    .option-item:hover:not(.selected) {
      border-color: #667eea;
      background: #f8f9ff;
    }

    .option-item.selected {
      border-color: #667eea;
      background: #f0f4ff;
    }

    .option-item.correct {
      border-color: #10b981;
      background: #f0fdf4;
    }

    .option-item.incorrect {
      border-color: #ef4444;
      background: #fef2f2;
    }

    .option-item input[type="radio"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .option-text {
      flex: 1;
      font-size: 0.95rem;
      color: #1a1a1a;
    }

    .correct-badge {
      color: #10b981;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .explanation {
      margin-top: 1rem;
      padding: 1rem;
      background: #f0f4ff;
      border-left: 4px solid #667eea;
      border-radius: 4px;
    }

    .explanation p {
      margin: 0;
      color: #1a1a1a;
      font-size: 0.9rem;
      line-height: 1.6;
    }

    .quiz-actions {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.875rem;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #5568d3;
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #1a1a1a;
    }

    .btn-secondary:hover {
      background: #e5e5e5;
    }

    .quiz-results {
      text-align: center;
      padding: 2rem 0;
    }

    .results-card {
      max-width: 500px;
      margin: 0 auto;
      padding: 3rem 2rem;
      border-radius: 12px;
      background: white;
    }

    .results-card.passed {
      border: 2px solid #10b981;
      background: #f0fdf4;
    }

    .results-card.failed {
      border: 2px solid #f59e0b;
      background: #fffbeb;
    }

    .results-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .results-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 1rem 0;
    }

    .results-score {
      font-size: 3rem;
      font-weight: 700;
      margin: 1rem 0;
    }

    .results-card.passed .results-score {
      color: #10b981;
    }

    .results-card.failed .results-score {
      color: #f59e0b;
    }

    .results-details {
      font-size: 1.125rem;
      color: #6b7280;
      margin: 1rem 0;
    }

    .results-message {
      font-size: 0.95rem;
      color: #6b7280;
      margin: 1rem 0;
    }
  `]
})
export class QuizComponent implements OnInit {
  @Input() quiz?: Quiz;
  @Input() enrollmentId?: number;
  @Input() lessonId?: number;
  @Output() quizCompleted = new EventEmitter<{ score: number; passed: boolean }>();

  currentQuestionIndex: number = 0;
  selectedAnswers: number[] = [];
  showResults: boolean = false;
  isQuizCompleted: boolean = false;
  score: number = 0;
  correctAnswers: number = 0;

  ngOnInit() {
    if (this.quiz) {
      this.selectedAnswers = new Array(this.quiz.questions.length).fill(-1);
    }
  }

  get currentQuestion(): QuizQuestion | undefined {
    return this.quiz?.questions?.[this.currentQuestionIndex];
  }

  nextQuestion() {
    if (this.currentQuestionIndex < ((this.quiz?.questions?.length || 0) - 1)) {
      this.currentQuestionIndex++;
      this.showResults = false;
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.showResults = false;
    }
  }

  submitQuiz() {
    if (!this.quiz) return;

    this.showResults = true;
    this.isQuizCompleted = true;

    // Calculer le score
    this.correctAnswers = 0;
    this.quiz.questions.forEach((question, index) => {
      if (this.selectedAnswers[index] === question.correctAnswer) {
        this.correctAnswers++;
      }
    });

    this.score = Math.round((this.correctAnswers / this.quiz.questions.length) * 100);
    const passed = this.score >= (this.quiz.passingScore || 70);

    this.quizCompleted.emit({
      score: this.score,
      passed
    });
  }

  restartQuiz() {
    this.currentQuestionIndex = 0;
    this.selectedAnswers = new Array(this.quiz?.questions.length || 0).fill(-1);
    this.showResults = false;
    this.isQuizCompleted = false;
    this.score = 0;
    this.correctAnswers = 0;
  }
}


