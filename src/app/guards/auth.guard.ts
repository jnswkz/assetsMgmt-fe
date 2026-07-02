import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);

  // During server-side render localStorage is unavailable, so the token can't be
  // read yet. Allow the route to render; the browser re-runs the guard with the
  // real token and redirects if the session is genuinely missing.
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('/login');
};
