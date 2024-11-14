import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const userRole = authService.getUserRole();
  const allowedRoles = route.data['roles'] as Array<string>;

  if (allowedRoles.includes(userRole)) {
    return true;
  } else {
    router.navigate(['/iniciosesion']);
    return false;
  }
};

