import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-menu',
  imports: [MatIconModule],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css',
})
export class UserMenu {
  private readonly auth = inject(AuthService);

  protected readonly user = this.auth.profile;
  protected readonly isOpen = signal(false);
  protected readonly menuId = computed(() => 'user-menu-panel');

  protected toggle(): void {
    this.isOpen.update(open => !open);
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  protected logout(): void {
    this.close();
    this.auth.logout();
  }
}
