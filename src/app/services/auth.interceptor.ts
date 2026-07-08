import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { TokenStore } from './token-store';

/** Auth endpoints must not carry a stale bearer or trigger the refresh loop. */
function isAuthEndpoint(url: string): boolean {
  return url.includes('/api/auth/login') ||
    url.includes('/api/auth/refresh') ||
    url.includes('/api/auth/logout');
}

function withBearer(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokens = inject(TokenStore);
  const auth = inject(AuthService);
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  if (isAuthEndpoint(req.url)) {
    return next(req);
  }

  const accessToken = tokens.accessToken();
  const authorized = accessToken ? withBearer(req, accessToken) : req;

  // On the server there is no token and no refresh/logout should occur — just
  // let the error propagate so it can't corrupt the hydrated router state.
  if (!isBrowser) {
    return next(authorized);
  }

  return next(authorized).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && accessToken) {
        return retryWithRefresh(req, next, auth);
      }
      return throwError(() => error);
    })
  );
};

function retryWithRefresh(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  auth: AuthService
): Observable<HttpEvent<unknown>> {
  return auth.refreshSession().pipe(
    switchMap(newToken => {
      if (!newToken) {
        auth.logout();
        return throwError(() => new Error('Session expired'));
      }
      return next(withBearer(req, newToken));
    })
  );
}
