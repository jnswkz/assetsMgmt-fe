import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { filter, map, startWith } from 'rxjs';
import { SidebarNav } from './sidebar-nav/sidebar-nav';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSidenavModule, SidebarNav],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);
  protected readonly theme = inject(ThemeService);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => event.urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  protected readonly isLoginPage = computed(() => this.currentUrl().startsWith('/login'));

  protected toggleThemeFromTopbar(event: MouseEvent): void {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const toggleButton = target.closest<HTMLButtonElement>('button[aria-label="Toggle theme"]');

    if (!toggleButton) {
      return;
    }

    event.preventDefault();
    this.theme.toggle();
    toggleButton.blur();
  }
}
