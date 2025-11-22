import { Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private promptEvent: any;

  constructor(private swUpdate: SwUpdate) {
    this.checkForUpdates();
    this.handleInstallPrompt();
  }

  /**
   * Vérifie les mises à jour du service worker
   */
  checkForUpdates(): void {
    if (!this.swUpdate.isEnabled) {
      console.log('Service Worker is not enabled');
      return;
    }

    // Vérifier les mises à jour toutes les 6 heures
    this.swUpdate.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      )
      .subscribe(() => {
        if (confirm('Une nouvelle version est disponible. Voulez-vous recharger la page ?')) {
          window.location.reload();
        }
      });
  }

  /**
   * Gère l'invite d'installation PWA
   */
  private handleInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.promptEvent = e;
    });
  }

  /**
   * Affiche l'invite d'installation PWA
   */
  async promptInstall(): Promise<boolean> {
    if (!this.promptEvent) {
      return false;
    }

    this.promptEvent.prompt();
    const { outcome } = await this.promptEvent.userChoice;
    this.promptEvent = null;
    
    return outcome === 'accepted';
  }

  /**
   * Vérifie si l'app est installée
   */
  isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  /**
   * Vérifie si l'app est en mode hors-ligne
   */
  isOffline(): boolean {
    return !navigator.onLine;
  }

  /**
   * Écoute les changements de statut réseau
   */
  onOnlineStatusChange(callback: (isOnline: boolean) => void): void {
    window.addEventListener('online', () => callback(true));
    window.addEventListener('offline', () => callback(false));
  }

  /**
   * Force la mise à jour du service worker
   */
  async forceUpdate(): Promise<void> {
    if (this.swUpdate.isEnabled) {
      await this.swUpdate.activateUpdate();
      window.location.reload();
    }
  }
}


