import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/nav-item';

function hasRole(route: ActivatedRouteSnapshot, role: Role | null): boolean {
  const allowedRoles = route.data['allowedRoles'] as readonly Role[] | undefined;
  return !allowedRoles || (role !== null && allowedRoles.includes(role));
}

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const auth = inject(AuthService);
  const router = inject(Router);
  auth.ensureSessionRestoreStarted();

  if (auth.isSessionResolved()) {
    return hasRole(route, auth.role()) ? true : router.parseUrl('/forbidden');
  }

  return auth.waitForResolvedSession().pipe(
    map(() => (hasRole(route, auth.role()) ? true : router.parseUrl('/forbidden')))
  );
};
