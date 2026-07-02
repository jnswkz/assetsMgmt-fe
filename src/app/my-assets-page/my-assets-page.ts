import { UserMenu } from '../user-menu/user-menu';
import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { controlValue, matchesSearch } from '../utils/search';

interface AssignedAsset {
  readonly code: string;
  readonly model: string;
  readonly status: 'Allocated';
  readonly location: string;
  readonly assignedSince: string;
}

const ASSIGNED_ASSETS: readonly AssignedAsset[] = [
  {
    code: 'AH-0001',
    model: 'MacBook Pro 14"',
    status: 'Allocated',
    location: 'HQ / 4F / Desk 412',
    assignedSince: '2025-05-06',
  },
  {
    code: 'AH-0008',
    model: 'Dell UltraSharp 27',
    status: 'Allocated',
    location: 'HQ / 4F / Desk 412',
    assignedSince: '2025-09-03',
  },
  {
    code: 'AH-0016',
    model: 'Logitech MX Master 3S',
    status: 'Allocated',
    location: 'HQ / 4F',
    assignedSince: '2025-12-12',
  },
];

@Component({
  selector: 'app-my-assets-page',
  imports: [MatIconModule, UserMenu],
  templateUrl: './my-assets-page.html',
  styleUrl: './my-assets-page.css',
})
export class MyAssetsPage {
  private readonly auth = inject(AuthService);
  protected readonly theme = inject(ThemeService);

  protected readonly user = this.auth.profile;
  protected readonly assignedAssets = ASSIGNED_ASSETS;
  protected readonly globalSearch = signal('');
  protected readonly filteredAssignedAssets = computed(() =>
    this.assignedAssets.filter(asset =>
      matchesSearch(this.globalSearch(), [
        asset.code,
        asset.model,
        asset.status,
        asset.location,
        asset.assignedSince,
      ])
    )
  );

  protected updateGlobalSearch(event: Event): void {
    this.globalSearch.set(controlValue(event));
  }
}
