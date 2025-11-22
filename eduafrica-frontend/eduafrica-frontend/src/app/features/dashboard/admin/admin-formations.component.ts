import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-formations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-formations.component.html',
  styleUrls: ['./admin-formations.component.css']
})
export class AdminFormationsComponent implements OnInit {
  formations: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadFormations();
  }

  loadFormations() {
    this.loading = true;
    this.error = null;

    this.adminService.getAllFormations().subscribe({
      next: (formations) => {
        this.formations = formations;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement formations:', err);
        this.error = 'Erreur lors du chargement des formations';
        this.loading = false;
      }
    });
  }

  deleteFormation(formationId: number) {
    if (!confirm('Supprimer cette formation ? Cette action est irréversible.')) {
      return;
    }

    this.adminService.deleteFormation(formationId).subscribe({
      next: () => {
        this.formations = this.formations.filter(f => f.id !== formationId);
        alert('Formation supprimée avec succès');
      },
      error: (err) => {
        console.error('Erreur suppression:', err);
        alert('Erreur lors de la suppression');
      }
    });
  }
}



