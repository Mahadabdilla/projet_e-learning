import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { User, Role } from '../../../shared/models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  error: string | null = null;
  
  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  
  // Filtres
  searchTerm = '';
  roleFilter: string = 'ALL';
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  // Modal
  selectedUser: User | null = null;
  newRole: string = '';
  showModal = false;
  
  Role = Role;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = null;

    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.totalElements = users.length;
        this.totalPages = Math.ceil(this.totalElements / this.pageSize);
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement utilisateurs:', err);
        this.error = 'Erreur lors du chargement des utilisateurs';
        this.loading = false;
      }
    });
  }

  applyFilters() {
    let filtered = [...this.users];
    
    // Recherche
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
    this.totalElements = filtered.length;
    this.totalPages = Math.ceil(this.totalElements / this.pageSize);
    this.currentPage = 0;
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

  getPaginatedUsers(): User[] {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredUsers.slice(start, end);
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  openRoleModal(user: User) {
    this.selectedUser = user;
    this.newRole = user.role;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedUser = null;
    this.newRole = '';
  }

  changeUserRole() {
    if (!this.selectedUser || !this.newRole || this.newRole === this.selectedUser.role) {
      return;
    }

    if (!confirm(`Changer le rôle de ${this.selectedUser.firstName} ${this.selectedUser.lastName} en ${this.newRole} ?`)) {
      return;
    }

    this.adminService.changeUserRole(this.selectedUser.id!, this.newRole).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.applyFilters();
        this.closeModal();
        alert('Rôle modifié avec succès');
      },
      error: (err) => {
        console.error('Erreur changement rôle:', err);
        alert('Erreur lors du changement de rôle');
      }
    });
  }

  deleteUser(user: User) {
    if (!confirm(`Supprimer l'utilisateur ${user.firstName} ${user.lastName} ? Cette action est irréversible.`)) {
      return;
    }

    this.adminService.deleteUser(user.id!).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        this.applyFilters();
        alert('Utilisateur supprimé avec succès');
      },
      error: (err) => {
        console.error('Erreur suppression:', err);
        alert('Erreur lors de la suppression');
      }
    });
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
      'APPRENANT': 'blue',
      'FORMATEUR': 'green',
      'MENTOR': 'purple',
      'ADMIN': 'red'
    };
    return colors[role] || 'gray';
  }
}



