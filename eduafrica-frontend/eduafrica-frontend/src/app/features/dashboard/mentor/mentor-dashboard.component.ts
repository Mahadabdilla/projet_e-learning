import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MentorService } from '../../../core/services/mentor.service';
import { MentoringRequestService } from '../../../core/services/mentoring-request.service';
import { MentoringRequest } from '../../../core/services/mentoring-request.service';

@Component({
  selector: 'app-mentor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mentor-dashboard.component.html',
  styleUrls: ['./mentor-dashboard.component.css']
})
export class MentorDashboardComponent implements OnInit {
  stats: any = null;
  mentoringRequests: MentoringRequest[] = [];
  loading = false;
  error: string | null = null;
  isUpdatingAvailability = false;

  constructor(
    private mentorService: MentorService,
    private mentoringRequestService: MentoringRequestService
  ) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading = true;
    this.error = null;

    // Charger les statistiques
    this.mentorService.getMyStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loadMentoringRequests();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des statistiques:', err);
        this.error = 'Erreur lors du chargement du dashboard';
        this.loading = false;
      }
    });
  }

  loadMentoringRequests() {
    this.mentoringRequestService.getMyMentorRequests().subscribe({
      next: (requests) => {
        this.mentoringRequests = requests;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des demandes:', err);
        this.loading = false;
      }
    });
  }

  toggleAvailability() {
    if (!this.stats?.mentorProfile) return;

    this.isUpdatingAvailability = true;
    const newAvailability = !this.stats.mentorProfile.isAvailable;

    this.mentorService.updateAvailability(newAvailability).subscribe({
      next: (mentorProfile) => {
        if (this.stats) {
          this.stats.mentorProfile = mentorProfile;
        }
        this.isUpdatingAvailability = false;
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour de la disponibilité:', err);
        this.isUpdatingAvailability = false;
      }
    });
  }

  updateRequestStatus(request: MentoringRequest, status: string) {
    this.mentoringRequestService.updateRequestStatus(request.id, status).subscribe({
      next: (updatedRequest) => {
        const index = this.mentoringRequests.findIndex(r => r.id === updatedRequest.id);
        if (index !== -1) {
          this.mentoringRequests[index] = updatedRequest;
        }
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut:', err);
        alert('Erreur lors de la mise à jour du statut');
      }
    });
  }

  getPendingRequests(): MentoringRequest[] {
    return this.mentoringRequests.filter(r => r.status === 'PENDING');
  }

  getAcceptedRequests(): MentoringRequest[] {
    return this.mentoringRequests.filter(r => r.status === 'ACCEPTED');
  }

  getCompletedRequests(): MentoringRequest[] {
    return this.mentoringRequests.filter(r => r.status === 'COMPLETED');
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'PENDING': 'En attente',
      'ACCEPTED': 'Acceptée',
      'REJECTED': 'Rejetée',
      'COMPLETED': 'Complétée'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'ACCEPTED': 'bg-blue-100 text-blue-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'COMPLETED': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
