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
const PROFILE_KEY = 'am.me';

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
  private restoreStarted = false;
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
    this.seedSessionFromBrowserState();
    this.ensureSessionRestoreStarted();
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
          this.writeCachedUser(me);
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

  /** Starts one browser-side restore pass from stored tokens, if any exist. */
  ensureSessionRestoreStarted(): void {
    this.tokens.syncFromStorage();

    if (!this.isBrowser || this.restoreStarted || !this.tokens.hasSession()) {
      return;
    }

    const hadSeededUser = this.currentUserState() !== null;
    this.restoreStarted = true;
    if (!hadSeededUser) {
      this.sessionStateInternal.set('checking');
    }

    this.loadCurrentUser().subscribe({
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
          this.clearSession();
          void this.injector.get(Router).navigateByUrl('/login');
          return;
        }
        if (!hadSeededUser) {
          this.sessionStateInternal.set('anonymous');
        }
      },
    });
  }

  private clearSession(): void {
    this.tokens.clear();
    this.removeCachedUser();
    this.currentUserState.set(null);
    this.sessionStateInternal.set('anonymous');
    this.restoreStarted = false;
  }

  private seedSessionFromBrowserState(): void {
    if (!this.isBrowser || this.currentUserState() !== null) {
      return;
    }

    this.tokens.syncFromStorage();
    if (!this.tokens.hasSession()) {
      return;
    }

    const cachedUser = this.readCachedUser() ?? deriveProfileFromToken(this.tokens.accessToken());
    if (!cachedUser) {
      return;
    }

    this.currentUserState.set(cachedUser);
    this.sessionStateInternal.set('authenticated');
  }

  private readCachedUser(): MeResponse | null {
    const value = this.storage()?.getItem(PROFILE_KEY);
    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as MeResponse;
    } catch {
      this.storage()?.removeItem(PROFILE_KEY);
      return null;
    }
  }

  private writeCachedUser(user: MeResponse): void {
    try {
      this.storage()?.setItem(PROFILE_KEY, JSON.stringify(user));
    } catch {
      // Ignore storage quota/private-mode failures; runtime auth still works.
    }
  }

  private removeCachedUser(): void {
    this.storage()?.removeItem(PROFILE_KEY);
  }

  private storage(): Storage | null {
    if (!this.isBrowser || typeof window === 'undefined') {
      return null;
    }
    try {
      return window.localStorage;
    } catch {
      return null;
    }
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

function deriveProfileFromToken(accessToken: string | null): MeResponse | null {
  if (!accessToken) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeJwtPayload(accessToken)) as Record<string, unknown>;
    const role = readTokenRole(payload);
    if (!role) {
      return null;
    }

    const userName = readStringClaim(payload, ['unique_name', 'preferred_username', 'userName', 'sub']) ?? '';
    const fullName =
      readStringClaim(payload, ['name', 'fullName', 'given_name', 'unique_name', 'preferred_username']) ?? userName;
    const email = readStringClaim(payload, ['email']) ?? '';

    return {
      id: readStringClaim(payload, ['nameid', 'sub']) ?? userName,
      userName,
      email,
      fullName,
      employeeCode: readStringClaim(payload, ['employeeCode']) ?? '',
      role,
      departmentId: readStringClaim(payload, ['departmentId']) ?? null,
      departmentName: readStringClaim(payload, ['department', 'departmentName']) ?? null,
    };
  } catch {
    return null;
  }
}

function decodeJwtPayload(token: string): string {
  const [, payload = ''] = token.split('.');
  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return atob(padded);
}

function readStringClaim(payload: Record<string, unknown>, keys: readonly string[]): string | null {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }
  return null;
}

function readTokenRole(payload: Record<string, unknown>): Role | null {
  const roleClaims = [
    payload['role'],
    payload['roles'],
    payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
  ];

  for (const claim of roleClaims) {
    if (typeof claim === 'string' && isRole(claim)) {
      return claim;
    }
    if (Array.isArray(claim)) {
      const role = claim.find((value): value is Role => typeof value === 'string' && isRole(value));
      if (role) {
        return role;
      }
    }
  }

  return null;
}

function isRole(value: string): value is Role {
  return value === 'AdminIT' || value === 'Manager' || value === 'Employee';
}
