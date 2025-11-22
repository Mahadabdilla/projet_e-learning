import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  stats = [
    { value: '50,000+', label: 'Apprenants' },
    { value: '500+', label: 'Formations' },
    { value: '10,000+', label: 'Certificats' },
    { value: '25+', label: 'Pays' }
  ];

  features = [
    {
      icon: '📱',
      title: 'Application PWA',
      description: 'Accédez à vos cours partout, même sans connexion Internet'
    },
    {
      icon: '💳',
      title: 'Paiements locaux',
      description: 'Orange Money, Wave, M-Pesa et autres méthodes africaines'
    },
    {
      icon: '🔒',
      title: 'Données sécurisées',
      description: 'Vos informations personnelles protégées par chiffrement'
    },
    {
      icon: '👥',
      title: 'Communauté active',
      description: 'Échangez avec des milliers d\'apprenants à travers l\'Afrique'
    }
  ];

  highlights = [
    {
      icon: '🎓',
      title: 'Certifications reconnues',
      description: 'Obtenez des certificats valorisés par les entreprises africaines'
    },
    {
      icon: '👨‍🏫',
      title: 'Mentorat personnalisé',
      description: 'Bénéficiez du soutien d\'experts dans votre domaine'
    },
    {
      icon: '📴',
      title: 'Mode hors-ligne',
      description: 'Téléchargez vos cours et apprenez sans connexion'
    },
    {
      icon: '💰',
      title: 'Mobile Money',
      description: 'Payez facilement avec Orange Money, Wave ou M-Pesa'
    }
  ];

  constructor(private router: Router) {}

  navigateToFormations() {
    this.router.navigate(['/formations']);
  }
}
