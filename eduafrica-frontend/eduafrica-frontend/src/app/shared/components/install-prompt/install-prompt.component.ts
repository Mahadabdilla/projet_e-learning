import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwaService } from '../../../core/services/pwa.service';

@Component({
  selector: 'app-install-prompt',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="showPrompt" class="install-prompt">
      <div class="prompt-content">
        <div class="prompt-info">
          <h3>Installer EduAfrica</h3>
          <p>Installez l'application pour une meilleure expérience et un accès hors-ligne.</p>
        </div>
        <div class="prompt-actions">
          <button (click)="dismiss()" class="btn-dismiss">Plus tard</button>
          <button (click)="install()" class="btn-install">Installer</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .install-prompt {
      position: fixed;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 9998;
      max-width: 400px;
      width: calc(100% - 2rem);
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        transform: translateX(-50%) translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
    }

    .prompt-content {
      padding: 1.5rem;
    }

    .prompt-info h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      font-weight: 700;
      color: #1a1a1a;
    }

    .prompt-info p {
      margin: 0 0 1rem 0;
      font-size: 0.875rem;
      color: #6b7280;
      line-height: 1.5;
    }

    .prompt-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }

    .btn-dismiss,
    .btn-install {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .btn-dismiss {
      background: #f3f4f6;
      color: #6b7280;
    }

    .btn-dismiss:hover {
      background: #e5e5e5;
    }

    .btn-install {
      background: #667eea;
      color: white;
    }

    .btn-install:hover {
      background: #5568d3;
    }

    @media (max-width: 640px) {
      .install-prompt {
        bottom: 0.5rem;
        width: calc(100% - 1rem);
      }
    }
  `]
})
export class InstallPromptComponent implements OnInit {
  showPrompt = false;

  constructor(private pwaService: PwaService) {}

  ngOnInit(): void {
    // Ne pas afficher si déjà installé
    if (this.pwaService.isInstalled()) {
      return;
    }

    // Vérifier après un délai pour éviter d'afficher immédiatement
    setTimeout(() => {
      // Vérifier si l'invite d'installation est disponible
      // Dans un vrai scénario, vous pourriez vérifier si l'utilisateur a déjà refusé
      const hasSeenPrompt = localStorage.getItem('pwa-install-prompt-dismissed');
      if (!hasSeenPrompt) {
        this.showPrompt = true;
      }
    }, 5000); // Afficher après 5 secondes
  }

  async install(): Promise<void> {
    const installed = await this.pwaService.promptInstall();
    if (installed) {
      this.showPrompt = false;
    }
  }

  dismiss(): void {
    this.showPrompt = false;
    localStorage.setItem('pwa-install-prompt-dismissed', 'true');
  }
}


