import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../shared/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('✅ Connexion réussie:', response);
          if (response.role === Role.APPRENANT) {
            this.router.navigate(['/dashboard/apprenant']);
          } else if (response.role === Role.FORMATEUR) {
            this.router.navigate(['/dashboard/formateur']);
          } else if (response.role === Role.MENTOR) {
            this.router.navigate(['/dashboard/mentor']);
          } else if (response.role === Role.ADMIN) {
            this.router.navigate(['/dashboard/admin']);
          } else {
            // Redirection par défaut
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('❌ Erreur de connexion:', error);
          console.error('Détails:', error.error);
          this.errorMessage = error.error?.message || error.error?.error || error.message || 'Email ou mot de passe incorrect';
          if (error.status === 0) {
            this.errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.';
          } else if (error.status === 401) {
            this.errorMessage = 'Email ou mot de passe incorrect';
          }
        }
      });
    }
  }
}
