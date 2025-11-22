import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.css']
})
export class AdminOverviewComponent implements OnInit {
  stats: any = {};
  loading = true;
  error: string | null = null;

  // Données pour graphiques
  enrollmentChartData: any = null;
  roleDistributionData: any = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.loading = true;
    this.error = null;

    this.adminService.getPlatformStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.prepareChartData(stats);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement stats:', err);
        this.error = 'Erreur lors du chargement des statistiques';
        this.loading = false;
      }
    });
  }

  prepareChartData(stats: any) {
    // Données pour graphique d'évolution des inscriptions (simulé)
    this.enrollmentChartData = {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
      data: [10, 25, 35, 45, 60, stats.totalEnrollments || 0]
    };

    // Données pour répartition des rôles
    this.roleDistributionData = {
      labels: ['Apprenants', 'Formateurs', 'Mentors', 'Admins'],
      data: [
        stats.apprenants || 0,
        stats.formateurs || 0,
        stats.mentors || 0,
        stats.admins || 0
      ]
    };
  }

  getGrowthRate(): number {
    // Calcul simulé du taux de croissance
    return 15.5;
  }

  getFreeFormationsPercentage(): number {
    if (!this.stats.totalFormations || this.stats.totalFormations === 0) return 0;
    return Math.round((this.stats.freeFormations / this.stats.totalFormations) * 100);
  }
}



