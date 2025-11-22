import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormationService } from '../../core/services/formation.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { PaymentService } from '../../core/services/payment.service';
import { AuthService } from '../../core/services/auth.service';
import { Formation, FormationCategory } from '../../shared/models/formation.model';
import { PaymentComponent } from '../payment/payment.component';
import { Role } from '../../shared/models/user.model';

@Component({
  selector: 'app-formations',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PaymentComponent],
  templateUrl: './formations.component.html',
  styleUrls: ['./formations.component.css']
})
export class FormationsComponent implements OnInit {
  formations: Formation[] = [];
  filteredFormations: Formation[] = [];
  loading = true;
  error: string | null = null;
  currentPage = 0;
  totalPages = 0;
  pageSize = 100; // Augmenté pour afficher toutes les formations d'un coup
  selectedCategory: string = 'all';
  sortBy: string = 'popularity';
  showPaymentModal = false;
  selectedFormation: Formation | null = null;
  isAuthenticated = false;
  userRole: string | null = null;
  enrollments: any[] = [];
  payments: any[] = [];

  categories = [
    { value: 'all', label: 'Toutes les formations', count: 0 },
    { value: 'DEVELOPPEMENT', label: 'Développement', count: 0 },
    { value: 'MARKETING', label: 'Marketing', count: 0 },
    { value: 'TECHNOLOGIE', label: 'Technologie', count: 0 },
    { value: 'BUSINESS', label: 'Business', count: 0 },
    { value: 'SECURITE', label: 'Sécurité', count: 0 },
    { value: 'AGRICULTURE', label: 'Agriculture', count: 0 }
  ];

  constructor(
    private formationService: FormationService,
    private enrollmentService: EnrollmentService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    const currentUser = this.authService.getCurrentUser();
    this.userRole = currentUser?.role || null;
    
    this.loadFormations();
    
    if (this.isAuthenticated && this.userRole === Role.APPRENANT) {
      this.loadEnrollments();
      this.loadPayments();
    }
  }

  loadEnrollments() {
    this.enrollmentService.getMyEnrollments().subscribe({
      next: (enrollments) => {
        this.enrollments = enrollments;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des inscriptions:', err);
      }
    });
  }

  loadPayments() {
    this.paymentService.getMyPayments().subscribe({
      next: (payments) => {
        this.payments = payments;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des paiements:', err);
      }
    });
  }

  isEnrolled(formationId: number | undefined): boolean {
    if (!formationId) return false;
    return this.enrollments.some(e => e.formation?.id === formationId);
  }

  hasPaid(formationId: number | undefined): boolean {
    if (!formationId) return false;
    return this.payments.some(p => 
      p.formation?.id === formationId && p.status === 'COMPLETED'
    );
  }

  canEnroll(formation: Formation): boolean {
    if (!this.isAuthenticated || this.userRole !== Role.APPRENANT) {
      return false;
    }
    if (!formation.id) return false;
    if (this.isEnrolled(formation.id)) {
      return false;
    }
    if (formation.isFree) {
      return true;
    }
    return this.hasPaid(formation.id);
  }

  handleBuyClick(formation: Formation) {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.userRole !== Role.APPRENANT) {
      this.error = 'Seuls les apprenants peuvent acheter des formations';
      return;
    }
    if (!formation.id) {
      this.error = 'Formation invalide';
      return;
    }
    if (this.hasPaid(formation.id)) {
      this.enrollToFormation(formation.id);
      return;
    }
    this.selectedFormation = formation;
    this.showPaymentModal = true;
  }

  handleStartClick(formation: Formation) {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.userRole !== Role.APPRENANT) {
      this.error = 'Seuls les apprenants peuvent s\'inscrire aux formations';
      return;
    }
    if (!formation.id) {
      this.error = 'Formation invalide';
      return;
    }
    this.enrollToFormation(formation.id);
  }

  enrollToFormation(formationId: number) {
    this.enrollmentService.enrollToFormation(formationId).subscribe({
      next: () => {
        this.loadEnrollments();
        this.loadFormations();
        this.error = null;
      },
      error: (err) => {
        console.error('Erreur lors de l\'inscription:', err);
        this.error = err.error?.message || 'Erreur lors de l\'inscription. Veuillez réessayer.';
      }
    });
  }

  onPaymentCompleted() {
    const formationId = this.selectedFormation?.id;
    this.showPaymentModal = false;
    this.selectedFormation = null;
    this.loadPayments();
    if (formationId) {
      this.enrollToFormation(formationId);
    }
  }

  onPaymentCancelled() {
    this.showPaymentModal = false;
    this.selectedFormation = null;
  }

  loadFormations() {
    this.loading = true;
    this.formationService.getAllFormations(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.formations = response.content || [];
        this.filteredFormations = [...this.formations];
        this.totalPages = response.totalPages || 0;
        this.updateCategoryCounts();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des formations:', err);
        this.error = 'Impossible de charger les formations. Veuillez réessayer plus tard.';
        this.loading = false;
        this.formations = [];
        this.filteredFormations = [];
      }
    });
  }

  updateCategoryCounts() {
    this.categories.forEach(cat => {
      if (cat.value === 'all') {
        cat.count = this.formations.length;
      } else {
        cat.count = this.formations.filter(f => f.category === cat.value).length;
      }
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.formations];

    // Filtrer par catégorie
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(f => f.category === this.selectedCategory);
    }

    // Trier
    switch (this.sortBy) {
      case 'popularity':
        filtered.sort((a, b) => (b.nbStudents || 0) - (a.nbStudents || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'price-asc':
        filtered.sort((a, b) => {
          const priceA = a.isFree ? 0 : (a.price || 0);
          const priceB = b.isFree ? 0 : (b.price || 0);
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        filtered.sort((a, b) => {
          const priceA = a.isFree ? 0 : (a.price || 0);
          const priceB = b.isFree ? 0 : (b.price || 0);
          return priceB - priceA;
        });
        break;
      case 'newest':
        filtered.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
    }

    this.filteredFormations = filtered;
  }

  getCategoryLabel(category: string): string {
    const cat = this.categories.find(c => c.value === category);
    return cat ? cat.label : category;
  }

  getLevelColor(level: string): string {
    switch (level) {
      case 'DEBUTANT': return 'green';
      case 'INTERMEDIAIRE': return 'yellow';
      case 'AVANCE': return 'red';
      default: return 'gray';
    }
  }

  getWeeksFromHours(hours: number): number {
    return Math.round(hours / 15); // Approximation: 15h = 1 semaine
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadFormations();
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
