import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Service, computed, effect, inject, signal } from '@angular/core';

type ThemeMode = 'light' | 'dark';

const THEME_COOKIE = 'assetsMgmtTheme';
const THEME_COOKIE_MAX_AGE_SECONDS = 31_536_000;

@Service()
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly themeState = signal<ThemeMode>(this.initialTheme());

  readonly theme = computed(() => this.themeState());
  readonly isDark = computed(() => this.themeState() === 'dark');

  private readonly syncTheme = effect(() => {
    const theme = this.themeState();
    const root = this.document.documentElement;

    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;

    if (this.isBrowser) {
      this.document.cookie = `${THEME_COOKIE}=${theme}; Max-Age=${THEME_COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
    }
  });

  toggle(): void {
    this.themeState.update(theme => (theme === 'dark' ? 'light' : 'dark'));
  }

  private initialTheme(): ThemeMode {
    const storedTheme = this.cookieTheme();

    if (storedTheme) {
      return storedTheme;
    }

    if (this.isBrowser && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    return 'light';
  }

  private cookieTheme(): ThemeMode | null {
    if (!this.isBrowser) {
      return null;
    }

    const theme = this.document.cookie
      .split(';')
      .map(cookie => cookie.trim())
      .find(cookie => cookie.startsWith(`${THEME_COOKIE}=`))
      ?.split('=')[1];

    return theme === 'light' || theme === 'dark' ? theme : null;
  }
}
