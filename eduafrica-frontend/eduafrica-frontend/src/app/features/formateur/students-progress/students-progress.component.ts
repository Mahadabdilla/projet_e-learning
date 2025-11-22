import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EnrollmentService, Enrollment } from '../../../core/services/enrollment.service';
import { FormationService } from '../../../core/services/formation.service';
import { Formation } from '../../../shared/models/formation.model';

@Component({
  selector: 'app-students-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './students-progress.component.html',
  styleUrls: ['./students-progress.component.css']
})
export class StudentsProgressComponent implements OnInit {
  formationId: number | null = null;
  formation: Formation | null = null;
  enrollments: Enrollment[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private enrollmentService: EnrollmentService,
    private formationService: FormationService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.formationId = +id;
      this.loadData();
    } else {
      this.error = 'ID de formation manquant';
      this.isLoading = false;
    }
  }

  loadData() {
    if (!this.formationId) return;

    this.isLoading = true;
    
    // Charger la formation
    this.formationService.getFormationById(this.formationId).subscribe({
      next: (formation) => {
        this.formation = formation;
        this.loadEnrollments();
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de la formation';
        this.isLoading = false;
      }
    });
  }

  loadEnrollments() {
    if (!this.formationId) return;

    this.enrollmentService.getFormationEnrollments(this.formationId).subscribe({
      next: (enrollments) => {
        this.enrollments = enrollments;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des apprenants';
        this.isLoading = false;
      }
    });
  }

  getProgressColor(progress: number): string {
    if (progress >= 80) return 'green';
    if (progress >= 50) return 'yellow';
    if (progress >= 25) return 'orange';
    return 'red';
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  goBack() {
    this.router.navigate(['/dashboard/formateur']);
  }

  getAverageProgress(): string {
    if (this.enrollments.length === 0) return '0';
    const sum = this.enrollments.reduce((acc, e) => acc + e.progress, 0);
    return (sum / this.enrollments.length).toFixed(1);
  }

  getCompletedCount(): number {
    return this.enrollments.filter(e => e.progress === 100).length;
  }
}

