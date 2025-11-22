import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { User, Role } from '../../../shared/models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: any = {}; // Initialiser avec un objet vide au lieu de null
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = true; // Commencer avec loading = true
  error: string | null = null;
  showUsersList = false;
  selectedUser: User | null = null;
  newRole: string = '';
  Role = Role;
  
  // Filtres et recherche
  searchTerm: string = '';
  roleFilter: string = 'ALL';
  sortBy: string = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  // Onglets
  activeTab: 'users' | 'formations' | 'payments' | 'reviews' = 'users';
  
  // Formations
  formations: any[] = [];
  showFormationsList = false;
  
  // Paiements
  payments: any[] = [];
  showPaymentsList = false;
  
  // Avis
  reviews: any[] = [];
  showReviewsList = false;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    console.log('🚀 AdminDashboardComponent initialisé');
    console.log('📊 Stats initiales:', this.stats);
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading = true;
    this.error = null;
    console.log('🔄 Chargement du dashboard admin...');

    this.adminService.getPlatformStats().subscribe({
      next: (stats) => {
        console.log('✅ Statistiques reçues:', stats);
        console.log('📊 Stats object:', JSON.stringify(stats, null, 2));
        this.stats = stats;
        this.loading = false;
        console.log('✅ Loading mis à false, stats:', this.stats);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des statistiques:', err);
        console.error('Status:', err.status);
        console.error('Détails de l\'erreur:', err.error);
        console.error('Message:', err.message);
        console.error('URL:', err.url);
        
        if (err.status === 403 || err.status === 401) {
          this.error = 'Accès refusé. Vérifiez que vous êtes connecté en tant qu\'administrateur (admin@eduafrica.com).';
        } else if (err.status === 0) {
          this.error = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur http://localhost:8080';
        } else if (err.status === 404) {
          this.error = 'Endpoint non trouvé. Vérifiez que le backend est à jour.';
        } else {
          this.error = err.error?.message || err.message || `Erreur ${err.status || 'inconnue'} lors du chargement du dashboard.`;
        }
        this.loading = false;
        this.stats = {}; // Initialiser avec un objet vide pour permettre l'affichage
      }
    });
  }

  loadUsers() {
    this.showUsersList = true;
    this.loading = true;

    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...users];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs:', err);
        this.error = 'Erreur lors du chargement des utilisateurs';
        this.loading = false;
      }
    });
  }
  
  applyFilters() {
    let filtered = [...this.users];
    
    // Filtre par recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstName?.toLowerCase().includes(term) ||
        user.lastName?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.country?.toLowerCase().includes(term)
      );
    }
    
    // Filtre par rôle
    if (this.roleFilter !== 'ALL') {
      filtered = filtered.filter(user => user.role === this.roleFilter);
    }
    
    // Tri
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (this.sortBy) {
        case 'name':
          comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          break;
        case 'email':
          comparison = (a.email || '').localeCompare(b.email || '');
          break;
        case 'role':
          comparison = (a.role || '').localeCompare(b.role || '');
          break;
        case 'country':
          comparison = (a.country || '').localeCompare(b.country || '');
          break;
      }
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
    
    this.filteredUsers = filtered;
  }
  
  onSearchChange() {
    this.applyFilters();
  }
  
  onRoleFilterChange() {
    this.applyFilters();
  }
  
  onSortChange(sortBy: string) {
    if (this.sortBy === sortBy) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy;
      this.sortOrder = 'asc';
    }
    this.applyFilters();
  }
  
  viewUserDetails(user: User) {
    this.selectedUser = user;
    this.newRole = user.role;
  }
  
  loadFormations() {
    this.showFormationsList = true;
    this.loading = true;
    
    this.adminService.getAllFormations().subscribe({
      next: (formations) => {
        this.formations = formations;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des formations:', err);
        this.error = 'Erreur lors du chargement des formations';
        this.loading = false;
      }
    });
  }
  
  loadPayments() {
    this.showPaymentsList = true;
    this.loading = true;
    
    this.adminService.getAllPayments().subscribe({
      next: (payments) => {
        this.payments = payments;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des paiements:', err);
        this.error = 'Erreur lors du chargement des paiements';
        this.loading = false;
      }
    });
  }
  
  deleteFormation(formationId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible.')) {
      this.adminService.deleteFormation(formationId).subscribe({
        next: () => {
          this.formations = this.formations.filter(f => f.id !== formationId);
          alert('Formation supprimée avec succès');
          this.loadDashboard(); // Rafraîchir les stats
        },
        error: (err) => {
          alert('Erreur lors de la suppression de la formation');
          console.error(err);
        }
      });
    }
  }

  changeUserRole(user: User) {
    if (!this.newRole || this.newRole === user.role) {
      return;
    }

    if (!confirm(`Êtes-vous sûr de vouloir changer le rôle de ${user.firstName} ${user.lastName} en ${this.newRole} ?`)) {
      return;
    }

    this.adminService.changeUserRole(user.id!, this.newRole).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.selectedUser = null;
        this.newRole = '';
        alert('Rôle modifié avec succès');
      },
      error: (err) => {
        console.error('Erreur lors du changement de rôle:', err);
        alert('Erreur lors du changement de rôle');
      }
    });
  }

  deleteUser(user: User) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.firstName} ${user.lastName} ? Cette action est irréversible.`)) {
      return;
    }

    this.adminService.deleteUser(user.id!).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        alert('Utilisateur supprimé avec succès');
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
        alert('Erreur lors de la suppression de l\'utilisateur');
      }
    });
  }

  selectUserForRoleChange(user: User) {
    this.selectedUser = user;
    this.newRole = user.role;
  }

  cancelRoleChange() {
    this.selectedUser = null;
    this.newRole = '';
  }
  
  closeUserDetails() {
    this.selectedUser = null;
    this.newRole = '';
  }
  
  switchTab(tab: 'users' | 'formations' | 'payments' | 'reviews') {
    this.activeTab = tab;
    if (tab === 'users' && !this.showUsersList) {
      this.loadUsers();
    } else if (tab === 'formations' && !this.showFormationsList) {
      this.loadFormations();
    } else if (tab === 'payments' && !this.showPaymentsList) {
      this.loadPayments();
    } else if (tab === 'reviews' && !this.showReviewsList) {
      this.loadReviews();
    }
  }
  
  loadReviews() {
    this.showReviewsList = true;
    this.loading = true;
    
    this.adminService.getAllReviews().subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des avis:', err);
        this.error = 'Erreur lors du chargement des avis';
        this.loading = false;
      }
    });
  }
  
  deleteReview(reviewId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet avis ? Cette action est irréversible.')) {
      this.adminService.deleteReview(reviewId).subscribe({
        next: () => {
          this.reviews = this.reviews.filter(r => r.id !== reviewId);
          alert('Avis supprimé avec succès');
          this.loadDashboard(); // Rafraîchir les stats
        },
        error: (err) => {
          alert('Erreur lors de la suppression de l\'avis');
          console.error(err);
        }
      });
    }
  }

  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      'APPRENANT': 'Apprenant',
      'FORMATEUR': 'Formateur',
      'MENTOR': 'Mentor',
      'ADMIN': 'Administrateur'
    };
    return labels[role] || role;
  }

  getRoleColor(role: string): string {
    const colors: { [key: string]: string } = {
      'APPRENANT': 'bg-blue-100 text-blue-800',
      'FORMATEUR': 'bg-green-100 text-green-800',
      'MENTOR': 'bg-purple-100 text-purple-800',
      'ADMIN': 'bg-red-100 text-red-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  }
}
