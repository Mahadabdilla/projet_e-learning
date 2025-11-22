import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Role } from './shared/models/user.model';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'formations',
    loadComponent: () => import('./features/formations/formations.component').then(m => m.FormationsComponent)
  },
  {
    path: 'formations/:id',
    loadComponent: () => import('./features/formations/formation-detail.component').then(m => m.FormationDetailComponent)
  },
  {
    path: 'course/:formationId/:enrollmentId',
    canActivate: [authGuard, roleGuard],
    data: { role: Role.APPRENANT },
    loadComponent: () => import('./features/course/course-player.component').then(m => m.CoursePlayerComponent)
  },
  {
    path: 'mentors',
    loadComponent: () => import('./features/mentors/mentors.component').then(m => m.MentorsComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'messages',
    canActivate: [authGuard],
    loadComponent: () => import('./features/messages/messages/messages.component').then(m => m.MessagesComponent)
  },
  {
    path: 'dashboard/apprenant',
    canActivate: [authGuard, roleGuard],
    data: { role: Role.APPRENANT },
    loadComponent: () => import('./features/dashboard/apprenant/apprenant-dashboard.component').then(m => m.ApprenantDashboardComponent)
  },
  {
    path: 'dashboard/formateur',
    canActivate: [authGuard, roleGuard],
    data: { role: Role.FORMATEUR },
    loadComponent: () => import('./features/dashboard/formateur/formateur-dashboard.component').then(m => m.FormateurDashboardComponent)
  },
  {
    path: 'formateur/formations/create',
    canActivate: [authGuard, roleGuard],
    data: { role: Role.FORMATEUR },
    loadComponent: () => import('./features/formateur/create-formation/create-formation.component').then(m => m.CreateFormationComponent)
  },
  {
    path: 'formateur/formations/edit/:id',
    canActivate: [authGuard, roleGuard],
    data: { role: Role.FORMATEUR },
    loadComponent: () => import('./features/formateur/create-formation/create-formation.component').then(m => m.CreateFormationComponent)
  },
  {
    path: 'formateur/formations/:id/students',
    canActivate: [authGuard, roleGuard],
    data: { role: Role.FORMATEUR },
    loadComponent: () => import('./features/formateur/students-progress/students-progress.component').then(m => m.StudentsProgressComponent)
  },
  {
    path: 'dashboard/mentor',
    canActivate: [authGuard, roleGuard],
    data: { role: Role.MENTOR },
    loadComponent: () => import('./features/dashboard/mentor/mentor-dashboard.component').then(m => m.MentorDashboardComponent)
  },
  {
    path: 'dashboard/admin',
    canActivate: [authGuard, roleGuard],
    data: { role: Role.ADMIN },
    loadComponent: () => import('./features/dashboard/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/admin/admin-overview.component').then(m => m.AdminOverviewComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/dashboard/admin/admin-users.component').then(m => m.AdminUsersComponent)
      },
      {
        path: 'formations',
        loadComponent: () => import('./features/dashboard/admin/admin-formations.component').then(m => m.AdminFormationsComponent)
      },
      {
        path: 'mentors',
        loadComponent: () => import('./features/dashboard/admin/admin-mentors.component').then(m => m.AdminMentorsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
