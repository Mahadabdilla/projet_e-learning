import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { MentorService } from '../../../core/services/mentor.service';

@Component({
  selector: 'app-admin-mentors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-mentors.component.html',
  styleUrls: ['./admin-mentors.component.css']
})
export class AdminMentorsComponent implements OnInit {
  mentors: any[] = [];
  formateurs: any[] = [];
  loading = false;
  error: string | null = null;
  activeTab: 'mentors' | 'formateurs' = 'mentors';

  constructor(
    private adminService: AdminService,
    private mentorService: MentorService
  ) {}

  ngOnInit() {
    this.loadMentors();
    this.loadFormateurs();
  }

  loadMentors() {
    this.loading = true;
    this.mentorService.getAllMentors(0, 100).subscribe({
      next: (response: any) => {
        this.mentors = response.content || response || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement mentors:', err);
        this.error = 'Erreur lors du chargement des mentors';
        this.loading = false;
      }
    });
  }

  loadFormateurs() {
    // Charger les formateurs depuis les utilisateurs
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.formateurs = users.filter(u => u.role === 'FORMATEUR');
      },
      error: (err) => {
        console.error('Erreur chargement formateurs:', err);
      }
    });
  }

  toggleMentorAvailability(mentor: any) {
    // Logique pour activer/désactiver un mentor
    console.log('Toggle availability for mentor:', mentor.id);
  }
}

