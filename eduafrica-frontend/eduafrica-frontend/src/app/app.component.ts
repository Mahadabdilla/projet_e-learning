import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { OfflineBannerComponent } from './shared/components/offline-banner/offline-banner.component';
import { InstallPromptComponent } from './shared/components/install-prompt/install-prompt.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, OfflineBannerComponent, InstallPromptComponent],
  template: `
    <app-offline-banner></app-offline-banner>
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-install-prompt></app-install-prompt>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'EduAfrica';
}
