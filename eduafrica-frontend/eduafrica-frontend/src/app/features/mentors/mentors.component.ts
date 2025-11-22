import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MentorService, MentorProfile } from '../../core/services/mentor.service';
import { AuthService } from '../../core/services/auth.service';
import { RequestMentorComponent } from './request-mentor.component';
import { Role } from '../../shared/models/user.model';

@Component({
  selector: 'app-mentors',
  standalone: true,
  imports: [CommonModule, FormsModule, RequestMentorComponent],
  templateUrl: './mentors.component.html',
  styleUrls: ['./mentors.component.css']
})
export class MentorsComponent implements OnInit {
  mentors: MentorProfile[] = [];
  filteredMentors: MentorProfile[] = [];
  loading = true;
  error: string | null = null;
  currentPage = 0;
  totalPages = 0;
  pageSize = 12;
  searchKeyword = '';
  selectedAvailability: string = 'all';
  selectedSpecialty: string = 'all';
  sortBy: string = 'rating';
  showRequestModal = false;
  selectedMentor: MentorProfile | null = null;
  isAuthenticated = false;
  userRole: string | null = null;

  allMentorsCount = 0;
  availableMentorsCount = 0;
  unavailableMentorsCount = 0;

  specialties = [
    { value: 'all', label: 'Toutes les spécialités', count: 0 },
    { value: 'Développement Web & Mobile', label: 'Développement Web & Mobile', count: 0 },
    { value: 'Marketing Digital', label: 'Marketing Digital', count: 0 },
    { value: 'Data Science', label: 'Data Science', count: 0 },
    { value: 'Cloud Computing', label: 'Cloud Computing', count: 0 },
    { value: 'Cybersécurité', label: 'Cybersécurité', count: 0 },
    { value: 'Business & Entrepreneuriat', label: 'Business & Entrepreneuriat', count: 0 },
    { value: 'Design UI/UX', label: 'Design UI/UX', count: 0 },
    { value: 'Intelligence Artificielle', label: 'Intelligence Artificielle', count: 0 },
    { value: 'DevOps', label: 'DevOps', count: 0 },
    { value: 'Blockchain', label: 'Blockchain', count: 0 }
  ];

  constructor(
    private mentorService: MentorService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    const currentUser = this.authService.getCurrentUser();
    this.userRole = currentUser?.role || null;
    this.loadMentors();
  }

  handleRequestMentor(mentor: MentorProfile) {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.userRole !== Role.APPRENANT) {
      this.error = 'Seuls les apprenants peuvent demander un mentor';
      return;
    }
    if (!mentor.isAvailable) {
      this.error = 'Ce mentor n\'est pas disponible pour le moment';
      return;
    }
    this.selectedMentor = mentor;
    this.showRequestModal = true;
  }

  onRequestCreated() {
    this.showRequestModal = false;
    this.selectedMentor = null;
    this.error = null;
  }

  onRequestCancelled() {
    this.showRequestModal = false;
    this.selectedMentor = null;
  }

  loadMentors() {
    this.loading = true;
    this.error = null;
    this.mentorService.getAllMentors(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.mentors = response.content || [];
        this.filteredMentors = [...this.mentors];
        this.totalPages = response.totalPages || 0;
        this.updateCounts();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading mentors:', error);
        this.error = 'Impossible de charger les mentors. Veuillez réessayer plus tard.';
        this.loading = false;
        this.mentors = [];
        this.filteredMentors = [];
      }
    });
  }

  updateCounts() {
    this.allMentorsCount = this.mentors.length;
    this.availableMentorsCount = this.mentors.filter(m => m.isAvailable).length;
    this.unavailableMentorsCount = this.mentors.filter(m => !m.isAvailable).length;

    // Mettre à jour les compteurs de spécialités
    this.specialties.forEach(spec => {
      if (spec.value === 'all') {
        spec.count = this.mentors.length;
      } else {
        spec.count = this.mentors.filter(m => m.specialty === spec.value).length;
      }
    });
  }

  selectAvailability(availability: string) {
    this.selectedAvailability = availability;
    this.applyFilters();
  }

  selectSpecialty(specialty: string) {
    this.selectedSpecialty = specialty;
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }

  onSearch() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.mentors];

    // Filtrer par disponibilité
    if (this.selectedAvailability === 'available') {
      filtered = filtered.filter(m => m.isAvailable);
    } else if (this.selectedAvailability === 'unavailable') {
      filtered = filtered.filter(m => !m.isAvailable);
    }

    // Filtrer par spécialité
    if (this.selectedSpecialty !== 'all') {
      filtered = filtered.filter(m => m.specialty === this.selectedSpecialty);
    }

    // Filtrer par recherche
    if (this.searchKeyword.trim()) {
      const keyword = this.searchKeyword.toLowerCase().trim();
      filtered = filtered.filter(m => 
        m.specialty.toLowerCase().includes(keyword) ||
        m.bio.toLowerCase().includes(keyword) ||
        (m.user ? `${m.user.firstName} ${m.user.lastName}`.toLowerCase().includes(keyword) : false)
      );
    }

    // Trier
    switch (this.sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'sessions':
        filtered.sort((a, b) => b.nbSessions - a.nbSessions);
        break;
      case 'price-asc':
        filtered.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.hourlyRate || 0) - (a.hourlyRate || 0));
        break;
      case 'name':
        filtered.sort((a, b) => {
          const nameA = a.user ? `${a.user.firstName} ${a.user.lastName}`.toLowerCase() : '';
          const nameB = b.user ? `${b.user.firstName} ${b.user.lastName}`.toLowerCase() : '';
          return nameA.localeCompare(nameB);
        });
        break;
    }

    this.filteredMentors = filtered;
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadMentors();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = Math.min(5, this.totalPages);
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + maxPages);
    
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
