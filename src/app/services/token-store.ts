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

  syncFromStorage(): void {
    const accessToken = this.read(ACCESS_KEY);
    const refreshToken = this.read(REFRESH_KEY);

    if (this.accessTokenState() !== accessToken) {
      this.accessTokenState.set(accessToken);
    }
    if (this.refreshTokenState() !== refreshToken) {
      this.refreshTokenState.set(refreshToken);
    }
  }

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
    return this.storage()?.getItem(key) ?? null;
  }

  private write(key: string, value: string): void {
    this.storage()?.setItem(key, value);
  }

  private remove(key: string): void {
    this.storage()?.removeItem(key);
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
