# 🔧 Guide de Développement Frontend - Composants Manquants

Ce document explique comment créer les composants Angular restants pour compléter la plateforme EduAfrica.

---

## 📦 Composants à Créer

### 1. Navbar Component (`shared/components/navbar/`)

**navbar.component.ts**
```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMenuOpen = false;

  constructor(public authService: AuthService) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
  }
}
```

**navbar.component.html**
```html
<nav class="navbar">
  <div class="container">
    <div class="nav-brand">
      <a routerLink="/">
        <h2>EduAfrica</h2>
      </a>
    </div>

    <div class="nav-links" [class.active]="isMenuOpen">
      <a routerLink="/formations">Formations</a>
      <a routerLink="/mentors">Mentors</a>
      <a routerLink="/about">À propos</a>
      <a routerLink="/contact">Contact</a>
      
      <div *ngIf="authService.isAuthenticated(); else notLoggedIn">
        <a [routerLink]="['/dashboard', (authService.getCurrentUser()?.role || 'apprenant').toLowerCase()]">
          Dashboard
        </a>
        <button (click)="logout()" class="btn-logout">Déconnexion</button>
      </div>
      
      <ng-template #notLoggedIn>
        <a routerLink="/login" class="btn-login">Se connecter</a>
        <a routerLink="/register" class="btn-register">S'inscrire</a>
      </ng-template>
    </div>

    <button class="menu-toggle" (click)="toggleMenu()">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </div>
</nav>
```

**navbar.component.css**
```css
.navbar {
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand h2 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.8rem;
  font-weight: 800;
}

.nav-links {
  display: flex;
  gap: 30px;
  align-items: center;
}

.nav-links a {
  color: #333;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #667eea;
}

.btn-login, .btn-register {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
}

.btn-login {
  border: 2px solid #667eea;
  color: #667eea;
}

.btn-register {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
}

@media (max-width: 768px) {
  .menu-toggle { display: flex; }
  .nav-links { display: none; }
  .nav-links.active { display: flex; flex-direction: column; }
}
```

---

### 2. Footer Component (`shared/components/footer/`)

**footer.component.ts**
```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
```

**footer.component.html**
```html
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-section">
        <h3>EduAfrica</h3>
        <p>Plateforme e-learning pour l'Afrique</p>
      </div>
      
      <div class="footer-section">
        <h4>Liens rapides</h4>
        <a routerLink="/formations">Formations</a>
        <a routerLink="/mentors">Mentors</a>
        <a routerLink="/about">À propos</a>
      </div>
      
      <div class="footer-section">
        <h4>Support</h4>
        <a routerLink="/contact">Contact</a>
        <a href="#">FAQ</a>
        <a href="#">Aide</a>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>&copy; {{ currentYear }} EduAfrica. Tous droits réservés.</p>
    </div>
  </div>
</footer>
```

---

### 3. Formations List Component

**formations-list.component.ts**
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormationService } from '../../../core/services/formation.service';
import { Formation } from '../../../shared/models/formation.model';

@Component({
  selector: 'app-formations-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './formations-list.component.html',
  styleUrls: ['./formations-list.component.css']
})
export class FormationsListComponent implements OnInit {
  formations: Formation[] = [];
  isLoading = false;

  constructor(private formationService: FormationService) {}

  ngOnInit() {
    this.loadFormations();
  }

  loadFormations() {
    this.isLoading = true;
    this.formationService.getAllFormations().subscribe({
      next: (response) => {
        this.formations = response.content;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
}
```

**formations-list.component.html**
```html
<div class="formations-page">
  <div class="container">
    <h1>Nos Formations</h1>
    
    <div class="formations-grid" *ngIf="!isLoading">
      <div class="formation-card" *ngFor="let formation of formations">
        <div class="formation-image">
          <span style="font-size: 60px;">📚</span>
        </div>
        <div class="formation-content">
          <h3>{{ formation.title }}</h3>
          <p>{{ formation.description }}</p>
          <div class="formation-meta">
            <span class="level">{{ formation.level }}</span>
            <span class="duration">{{ formation.duration }}h</span>
            <span class="students">{{ formation.nbStudents }} étudiants</span>
          </div>
          <div class="formation-footer">
            <span class="price" *ngIf="!formation.isFree">
              {{ formation.price }} FCFA
            </span>
            <span class="price free" *ngIf="formation.isFree">Gratuit</span>
            <a [routerLink]="['/formations', formation.id]" class="btn-view">
              Voir
            </a>
          </div>
        </div>
      </div>
    </div>
    
    <div class="loading" *ngIf="isLoading">Chargement...</div>
  </div>
</div>
```

---

### 4. Dashboard Apprenant Component

**apprenant-dashboard.component.ts**
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-apprenant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './apprenant-dashboard.component.html',
  styleUrls: ['./apprenant-dashboard.component.css']
})
export class ApprenantDashboardComponent implements OnInit {
  user: any;
  enrollments: any[] = [];

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }
}
```

**apprenant-dashboard.component.html**
```html
<div class="dashboard">
  <div class="container">
    <h1>Bienvenue, {{ user?.firstName }}!</h1>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Formations suivies</h3>
        <p class="stat-value">{{ enrollments.length }}</p>
      </div>
      <div class="stat-card">
        <h3>Certificats obtenus</h3>
        <p class="stat-value">0</p>
      </div>
      <div class="stat-card">
        <h3>Heures d'apprentissage</h3>
        <p class="stat-value">0h</p>
      </div>
    </div>

    <div class="section">
      <h2>Mes Formations</h2>
      <p *ngIf="enrollments.length === 0">
        Vous n'êtes inscrit à aucune formation.
        <a routerLink="/formations">Parcourir les formations</a>
      </p>
    </div>
  </div>
</div>
```

---

### 5. Dashboard Formateur Component

**formateur-dashboard.component.ts**
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormationService } from '../../../core/services/formation.service';

@Component({
  selector: 'app-formateur-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './formateur-dashboard.component.html',
  styleUrls: ['./formateur-dashboard.component.css']
})
export class FormateurDashboardComponent implements OnInit {
  formations: any[] = [];

  constructor(private formationService: FormationService) {}

  ngOnInit() {
    this.loadMyFormations();
  }

  loadMyFormations() {
    this.formationService.getMyFormations().subscribe({
      next: (formations) => this.formations = formations
    });
  }
}
```

---

### 6. Contact Component

**contact.component.ts**
```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;
  successMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.http.post('http://localhost:8080/api/contact', this.contactForm.value)
        .subscribe({
          next: () => {
            this.successMessage = 'Message envoyé avec succès!';
            this.contactForm.reset();
          }
        });
    }
  }
}
```

---

## 🎯 Commandes pour créer les composants

```bash
cd eduafrica-frontend/src/app

# Shared components
ng generate component shared/components/navbar --standalone
ng generate component shared/components/footer --standalone

# Features
ng generate component features/formations/formations-list --standalone
ng generate component features/formations/formation-detail --standalone
ng generate component features/mentors/mentors-list --standalone
ng generate component features/about/about --standalone
ng generate component features/contact/contact --standalone

# Dashboards
ng generate component features/dashboard/apprenant/apprenant-dashboard --standalone
ng generate component features/dashboard/formateur/formateur-dashboard --standalone
ng generate component features/dashboard/mentor/mentor-dashboard --standalone
ng generate component features/dashboard/admin/admin-dashboard --standalone
```

---

## 🔧 Configuration finale

### app.config.ts
```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
```

### styles.css
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  color: #333;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Styles globaux */
```

---

Suivez ce guide pour compléter tous les composants manquants!
