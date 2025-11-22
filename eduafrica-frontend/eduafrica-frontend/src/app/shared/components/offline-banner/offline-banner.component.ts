import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwaService } from '../../../core/services/pwa.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offline-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOffline" class="offline-banner">
      <div class="banner-content">
        <svg class="offline-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m1.414 5.658a5 5 0 001.414 2.83m0 0l2.829-2.829m-2.829 2.829L3 21"></path>
        </svg>
        <span class="banner-text">Mode hors-ligne activé. Certaines fonctionnalités peuvent être limitées.</span>
      </div>
    </div>
  `,
  styles: [`
    .offline-banner {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #f59e0b;
      color: white;
      padding: 0.75rem 1rem;
      z-index: 9999;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .banner-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .offline-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .banner-text {
      font-size: 0.875rem;
      font-weight: 500;
    }

    @media (max-width: 640px) {
      .banner-text {
        font-size: 0.75rem;
      }
    }
  `]
})
export class OfflineBannerComponent implements OnInit, OnDestroy {
  isOffline = false;
  private subscription?: Subscription;

  constructor(private pwaService: PwaService) {}

  ngOnInit(): void {
    this.isOffline = this.pwaService.isOffline();
    this.pwaService.onOnlineStatusChange((isOnline) => {
      this.isOffline = !isOnline;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}


