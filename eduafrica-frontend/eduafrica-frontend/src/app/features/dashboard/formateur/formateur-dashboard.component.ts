import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormationService } from '../../../core/services/formation.service';
import { AuthService } from '../../../core/services/auth.service';
import { Formation } from '../../../shared/models/formation.model';

@Component({
  selector: 'app-formateur-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './formateur-dashboard.component.html',
  styleUrls: ['./formateur-dashboard.component.css']
})
export class FormateurDashboardComponent implements OnInit {
  user: any;
  formations: Formation[] = [];
  isLoading = true;

  stats = {
    totalFormations: 0,
    totalApprenants: 0,
    noteMoyenne: 0,
    revenusEstimes: 0
  };

  recentActivity = [
    { formation: 'React & Node.js', nouveauxInscrits: 12, date: 'Aujourd\'hui' },
    { formation: 'Marketing Digital', nouveauxInscrits: 8, date: 'Hier' },
    { formation: 'Intelligence Artificielle', nouveauxInscrits: 15, date: 'Il y a 2 jours' }
  ];

  constructor(
    private formationService: FormationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.loadFormations();
  }

  loadFormations() {
    this.isLoading = true;
    this.formationService.getMyFormations().subscribe({
      next: (formations) => {
        this.formations = formations;
        this.calculateStats();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  calculateStats() {
    this.stats.totalFormations = this.formations.length;
    this.stats.totalApprenants = this.formations.reduce((sum, f) => sum + (f.nbStudents || 0), 0);
    this.stats.noteMoyenne = this.formations.length > 0
      ? this.formations.reduce((sum, f) => sum + (f.averageRating || 0), 0) / this.formations.length
      : 0;
    this.stats.revenusEstimes = this.formations.reduce((sum, f) => sum + ((f.price || 0) * (f.nbStudents || 0)), 0);
  }

  editFormation(id: number) {
    this.router.navigate(['/formateur/formations/edit', id]);
  }

  deleteFormation(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      this.formationService.deleteFormation(id).subscribe({
        next: () => {
          this.loadFormations();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          alert('Erreur lors de la suppression de la formation');
        }
      });
    }
  }

  viewStats(formationId: number) {
    this.router.navigate(['/formateur/formations', formationId, 'students']);
  }
}
