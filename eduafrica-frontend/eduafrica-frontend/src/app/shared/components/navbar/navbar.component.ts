import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthResponse, Role } from '../../models/user.model';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NotificationsComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser: AuthResponse | null = null;
  isMenuOpen = false;
  Role = Role;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.isMenuOpen = false;
  }

  getDashboardRoute(): string {
    if (!this.currentUser) return '/';
    
    switch (this.currentUser.role) {
      case Role.APPRENANT:
        return '/dashboard/apprenant';
      case Role.FORMATEUR:
        return '/dashboard/formateur';
      case Role.MENTOR:
        return '/dashboard/mentor';
      case Role.ADMIN:
        return '/dashboard/admin';
      default:
        return '/';
    }
  }
}
