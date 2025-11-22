import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">À propos d'EduAfrica</h1>
      <p class="text-gray-600">Plateforme e-learning pour l'Afrique</p>
    </div>
  `,
  styles: []
})
export class AboutComponent {
}


