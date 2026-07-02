import { Injector, PLATFORM_ID, Service, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  Observable,
  catchError,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  of,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs';
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

export type SessionState = 'checking' | 'authenticated' | 'anonymous';

const GUEST_PROFILE: UserProfile = {
  userName: '',
  fullName: '',
  displayName: 'Guest',
  firstName: 'Guest',
  initials: '?',
  department: '',
  role: 'Employee',
};

const TEST_USERS: Readonly<Record<string, MeResponse>> = {
  alice: {
    id: 'user-alice',
    userName: 'alice',
    email: 'alice@acme.co',
    fullName: 'Alice Morgan',
    employeeCode: 'IT-1001',
    role: 'AdminIT',
    departmentId: 'dept-it',
    departmentName: 'IT Asset Management',
  },
  ben: {
    id: 'user-ben',
    userName: 'ben',
    email: 'ben@acme.co',
    fullName: 'Ben Carter',
    employeeCode: 'M-1002',
    role: 'Manager',
    departmentId: 'dept-ops',
    departmentName: 'Operations',
  },
  chloe: {
    id: 'user-chloe',
    userName: 'chloe',
    email: 'chloe@acme.co',
    fullName: 'Chloe Davis',
    employeeCode: 'E-1003',
    role: 'Employee',
    departmentId: 'dept-eng',
    departmentName: 'Engineering',
  },
};

@Service()
export class AuthService {
  private readonly injector = inject(Injector);
  private readonly tokens = inject(TokenStore);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly currentUserState = signal<MeResponse | null>(null);
  private readonly sessionStateInternal = signal<SessionState>(
    this.tokens.hasSession() ? 'checking' : 'anonymous'
  );
  /** A single shared refresh so concurrent 401s don't start a refresh storm. */
  private refreshInFlight: Observable<string | null> | null = null;

  readonly currentUser = this.currentUserState.asReadonly();
  readonly profile = computed<UserProfile>(() => deriveProfile(this.currentUserState()));
  readonly role = computed<Role | null>(() => this.currentUserState()?.role ?? null);
  readonly isAuthenticated = computed(() => this.sessionStateInternal() === 'authenticated');
  readonly hasStoredSession = this.tokens.hasSession;
  readonly sessionState = this.sessionStateInternal.asReadonly();
  readonly isRestoringSession = computed(() => this.sessionStateInternal() === 'checking');
  readonly isSessionResolved = computed(() => this.sessionStateInternal() !== 'checking');
  private readonly sessionState$ = toObservable(this.sessionState).pipe(distinctUntilChanged());

  constructor() {
    if (this.isBrowser && this.tokens.hasSession() && this.currentUserState() === null) {
      this.restoreSession();
    }
  }

  login(userName: string, password: string): Observable<boolean> {
    const body: LoginRequest = { userName: userName.trim(), password };
    this.sessionStateInternal.set('checking');
    return this.injector.get(ApiService).post<TokenResponse>('/api/auth/login', body).pipe(
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
    void this.injector.get(Router).navigateByUrl('/login');
  }

  /** Test helper for component specs. Runtime auth still comes from `/api/auth/me`. */
  selectMockUser(userName: string): void {
    const profile = TEST_USERS[userName] ?? TEST_USERS['chloe'];
    this.currentUserState.set(profile);
    this.sessionStateInternal.set('authenticated');
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
    this.refreshInFlight = this.injector
      .get(ApiService)
      .post<TokenResponse>('/api/auth/refresh', { refreshToken })
      .pipe(
        tap(tokens => this.tokens.set(tokens)),
        map(tokens => tokens.accessToken),
        catchError(() => of(null)),
        finalize(() => (this.refreshInFlight = null)),
        shareReplay(1)
      );
    return this.refreshInFlight;
  }

  loadCurrentUser(): Observable<MeResponse> {
    return this.injector
      .get(ApiService)
      .get<MeResponse>('/api/auth/me')
      .pipe(
        tap(me => {
          this.currentUserState.set(me);
          this.sessionStateInternal.set('authenticated');
        })
      );
  }

  waitForResolvedSession(): Observable<SessionState> {
    return this.sessionState$.pipe(
      filter(state => state !== 'checking'),
      take(1)
    );
  }

  private restoreSession(): void {
    this.sessionStateInternal.set('checking');
    this.loadCurrentUser().subscribe({
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
          this.clearSession();
          return;
        }
        this.sessionStateInternal.set('anonymous');
      },
    });
  }

  private clearSession(): void {
    this.tokens.clear();
    this.currentUserState.set(null);
    this.sessionStateInternal.set('anonymous');
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
