import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRole = route.data['role'];
  const user = authService.getCurrentUser();

  if (user && user.role === requiredRole) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
