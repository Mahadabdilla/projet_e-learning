import { Component, Input, Output, OnInit, OnDestroy, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="video-player-container">
      <div class="video-wrapper">
        <video 
          #videoElement
          class="video-player"
          [src]="videoUrl"
          (loadedmetadata)="onVideoLoaded()"
          (timeupdate)="onTimeUpdate()"
          (ended)="onVideoEnded()"
          controls
          [poster]="posterUrl">
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
        
        <div *ngIf="!videoUrl" class="video-placeholder">
          <svg class="placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p>Aucune vidéo disponible</p>
        </div>
      </div>
      
      <div class="video-controls">
        <div class="progress-info">
          <span class="current-time">{{ formatTime(currentTime) }}</span>
          <span class="separator">/</span>
          <span class="total-time">{{ formatTime(duration) }}</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" [style.width.%]="progressPercentage"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .video-player-container {
      background: #000;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 1rem;
    }

    .video-wrapper {
      position: relative;
      width: 100%;
      padding-bottom: 56.25%; /* 16:9 aspect ratio */
      background: #000;
    }

    .video-player {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .video-placeholder {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #666;
      background: #1a1a1a;
    }

    .placeholder-icon {
      width: 64px;
      height: 64px;
      margin-bottom: 1rem;
    }

    .video-controls {
      background: #1a1a1a;
      padding: 1rem;
      color: white;
    }

    .progress-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .separator {
      color: #666;
    }

    .progress-bar-container {
      width: 100%;
      height: 4px;
      background: #333;
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background: #667eea;
      transition: width 0.1s ease;
    }
  `]
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @Input() videoUrl: string = '';
  @Input() posterUrl: string = '';
  @Input() autoSave: boolean = true;
  @Input() enrollmentId?: number;
  @Input() lessonId?: number;
  @Output() progressUpdate = new EventEmitter<{ progress: number; timeSpent: number }>();
  @Output() videoCompleted = new EventEmitter<void>();

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  currentTime: number = 0;
  duration: number = 0;
  progressPercentage: number = 0;
  private saveInterval?: any;

  ngOnInit() {
    if (this.autoSave) {
      // Sauvegarder la progression toutes les 10 secondes
      this.saveInterval = setInterval(() => {
        this.saveProgress();
      }, 10000);
    }
  }

  ngOnDestroy() {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
    }
    this.saveProgress();
  }

  onVideoLoaded() {
    if (this.videoElement?.nativeElement) {
      this.duration = this.videoElement.nativeElement.duration;
    }
  }

  onTimeUpdate() {
    if (this.videoElement?.nativeElement) {
      this.currentTime = this.videoElement.nativeElement.currentTime;
      if (this.duration > 0) {
        this.progressPercentage = (this.currentTime / this.duration) * 100;
      }
    }
  }

  onVideoEnded() {
    this.progressPercentage = 100;
    this.videoCompleted.emit();
    this.saveProgress();
  }

  private saveProgress() {
    if (this.videoElement?.nativeElement && this.duration > 0) {
      const progress = Math.round((this.currentTime / this.duration) * 100);
      const timeSpent = Math.round(this.currentTime);
      
      this.progressUpdate.emit({
        progress,
        timeSpent
      });
    }
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

