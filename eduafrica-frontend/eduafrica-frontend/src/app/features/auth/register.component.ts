import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../shared/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  roles = [
    { value: Role.APPRENANT, label: 'Apprenant' },
    { value: Role.FORMATEUR, label: 'Formateur' },
    { value: Role.MENTOR, label: 'Mentor' }
  ];

  countries = [
    'Sénégal', 'Côte d\'Ivoire', 'Mali', 'Burkina Faso', 'Niger',
    'Bénin', 'Togo', 'Guinée', 'Cameroun', 'Ghana', 'Nigeria',
    'RDC', 'Madagascar', 'Maroc', 'Tunisie', 'Algérie', 'Autre'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      country: ['', [Validators.required]],
      role: [Role.APPRENANT, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    });
  }

  onSubmit() {
    // Vérifier la correspondance des mots de passe
    if (this.registerForm.get('password')?.value !== this.registerForm.get('confirmPassword')?.value) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { confirmPassword, acceptTerms, ...registerData } = this.registerForm.value;

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Inscription réussie:', response);
          if (response.role === Role.APPRENANT) {
            this.router.navigate(['/dashboard/apprenant']);
          } else if (response.role === Role.FORMATEUR) {
            this.router.navigate(['/dashboard/formateur']);
          } else if (response.role === Role.MENTOR) {
            this.router.navigate(['/dashboard/mentor']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('❌ Erreur inscription complète:', error);
          console.error('Status:', error.status);
          console.error('StatusText:', error.statusText);
          console.error('Message:', error.message);
          console.error('Error object:', error.error);
          
          // Gérer l'erreur HTTP 0 (backend non accessible)
          if (error.status === 0 || !error.status) {
            this.errorMessage = '⚠️ Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur http://localhost:8080';
            return;
          }
          
          // Gérer les erreurs de validation
          if (error.error && error.error.errors) {
            const errors = error.error.errors;
            const firstError = Object.values(errors)[0];
            this.errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
          } else if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else if (error.status === 400) {
            this.errorMessage = 'Les données fournies sont invalides. Vérifiez tous les champs.';
          } else if (error.status === 409) {
            this.errorMessage = 'Cet email est déjà utilisé.';
          } else if (error.status === 500) {
            this.errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
          } else {
            this.errorMessage = error.message || 'Une erreur est survenue lors de l\'inscription';
          }
        }
      });
    } else {
      // Afficher les erreurs de validation
      const errors: string[] = [];
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control && control.errors) {
          Object.keys(control.errors).forEach(errorKey => {
            if (errorKey === 'required') {
              errors.push(`Le champ ${key} est obligatoire`);
            } else if (errorKey === 'email') {
              errors.push(`L'email est invalide`);
            } else if (errorKey === 'minlength') {
              errors.push(`Le mot de passe doit contenir au moins 6 caractères`);
            }
          });
        }
      });
      this.errorMessage = errors.length > 0 ? errors[0] : 'Veuillez remplir tous les champs correctement';
    }
  }
}
