import { PLATFORM_ID, Service, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { ApiService } from './api.service';
import { TokenStore } from './token-store';
import { LoginRequest, MeResponse, TokenResponse } from '../models/auth.model';
import { Role } from '../models/nav-item';

/** Display view-model derived from MeResponse for the app shell and page headers. */
export interface UserProfile {
  readonly userName: string;
  readonly fullName: string;
  readonly displayName: string;
  readonly firstName: string;
  readonly initials: string;
  readonly department: string;
  readonly role: Role;
}

const GUEST_PROFILE: UserProfile = {
  userName: '',
  fullName: '',
  displayName: 'Guest',
  firstName: 'Guest',
  initials: '?',
  department: '',
  role: 'Employee',
};

@Service()
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly tokens = inject(TokenStore);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly currentUserState = signal<MeResponse | null>(null);
  /** A single shared refresh so concurrent 401s don't start a refresh storm. */
  private refreshInFlight: Observable<string | null> | null = null;

  readonly currentUser = this.currentUserState.asReadonly();
  readonly profile = computed<UserProfile>(() => deriveProfile(this.currentUserState()));
  readonly role = computed<Role>(() => this.currentUserState()?.role ?? 'Employee');
  readonly isAuthenticated = computed(() => this.tokens.hasSession());

  constructor() {
    // Restore the session on reload: a token in storage but no loaded profile yet.
    // If /me returns 401 the interceptor transparently refreshes and retries; the
    // session is only cleared when that refresh also fails (see loadCurrentUser).
    if (this.isBrowser && this.tokens.hasSession() && this.currentUserState() === null) {
      this.loadCurrentUser().subscribe({
        error: (error: unknown) => {
          // Only drop the session on a definitive auth failure. Transient network
          // errors during bootstrap must not log the user out.
          if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
            this.clearSession();
          }
        },
      });
    }
  }

  login(userName: string, password: string): Observable<boolean> {
    const body: LoginRequest = { userName: userName.trim(), password };
    return this.api.post<TokenResponse>('/api/auth/login', body).pipe(
      tap(tokens => this.tokens.set(tokens)),
      switchMap(() => this.loadCurrentUser()),
      map(() => true),
      catchError(() => {
        this.clearSession();
        return of(false);
      })
    );
  }

  logout(): void {
    this.clearSession();
    void this.router.navigateByUrl('/login');
  }

  /**
   * Used by the interceptor on 401. Returns the new access token, or null on failure.
   * Shared across concurrent callers so the refresh endpoint is hit at most once.
   */
  refreshSession(): Observable<string | null> {
    if (this.refreshInFlight) {
      return this.refreshInFlight;
    }
    const refreshToken = this.tokens.refreshToken();
    if (!refreshToken) {
      return of(null);
    }
    this.refreshInFlight = this.api.post<TokenResponse>('/api/auth/refresh', { refreshToken }).pipe(
      tap(tokens => this.tokens.set(tokens)),
      map(tokens => tokens.accessToken),
      catchError(() => of(null)),
      finalize(() => (this.refreshInFlight = null)),
      shareReplay(1)
    );
    return this.refreshInFlight;
  }

  loadCurrentUser(): Observable<MeResponse> {
    return this.api
      .get<MeResponse>('/api/auth/me')
      .pipe(tap(me => this.currentUserState.set(me)));
  }

  private clearSession(): void {
    this.tokens.clear();
    this.currentUserState.set(null);
  }
}

function deriveProfile(me: MeResponse | null): UserProfile {
  if (!me) {
    return GUEST_PROFILE;
  }
  const fullName = me.fullName?.trim() || me.userName || '';
  const words = fullName.split(/\s+/).filter(Boolean);
  const firstName = words[0] ?? me.userName ?? 'User';
  const initials =
    words.length >= 2
      ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
      : (fullName.slice(0, 2) || me.userName.slice(0, 2) || '?').toUpperCase();

  return {
    userName: me.userName,
    fullName,
    displayName: fullName || me.userName,
    firstName,
    initials,
    department: me.departmentName ?? '',
    role: me.role,
  };
}
