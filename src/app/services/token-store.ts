import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TokenResponse } from '../models/auth.model';

const ACCESS_KEY = 'am.accessToken';
const REFRESH_KEY = 'am.refreshToken';

/**
 * Holds the JWT access/refresh tokens and mirrors them to localStorage.
 * Shared by AuthService and the auth interceptor to avoid a circular dependency.
 * All storage access is browser-guarded because the app is server-rendered.
 */
@Injectable({ providedIn: 'root' })
export class TokenStore {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly accessTokenState = signal<string | null>(this.read(ACCESS_KEY));
  private readonly refreshTokenState = signal<string | null>(this.read(REFRESH_KEY));

  readonly accessToken = this.accessTokenState.asReadonly();
  readonly refreshToken = this.refreshTokenState.asReadonly();
  readonly hasSession = computed(() => this.accessTokenState() !== null);

  set(tokens: TokenResponse): void {
    this.accessTokenState.set(tokens.accessToken);
    this.refreshTokenState.set(tokens.refreshToken);
    this.write(ACCESS_KEY, tokens.accessToken);
    this.write(REFRESH_KEY, tokens.refreshToken);
  }

  clear(): void {
    this.accessTokenState.set(null);
    this.refreshTokenState.set(null);
    this.remove(ACCESS_KEY);
    this.remove(REFRESH_KEY);
  }

  private read(key: string): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem(key);
  }

  private write(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    }
  }

  private remove(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }
}
