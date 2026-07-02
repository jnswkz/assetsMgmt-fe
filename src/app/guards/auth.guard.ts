import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
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
  auth.ensureSessionRestoreStarted();

  if (auth.isSessionResolved()) {
    return auth.isAuthenticated() ? true : router.parseUrl('/login');
  }

  return auth.waitForResolvedSession().pipe(
    map(() => (auth.isAuthenticated() ? true : router.parseUrl('/login')))
  );
};

export const guestGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const auth = inject(AuthService);
  const router = inject(Router);
  auth.ensureSessionRestoreStarted();

  if (auth.isSessionResolved()) {
    return auth.isAuthenticated() ? router.parseUrl('/dashboard') : true;
  }

  return auth.waitForResolvedSession().pipe(
    map(() => (auth.isAuthenticated() ? router.parseUrl('/dashboard') : true))
  );
};
