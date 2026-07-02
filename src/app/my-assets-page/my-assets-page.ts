import { UserMenu } from '../user-menu/user-menu';
import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { AllocationsService } from '../services/allocations.service';
import { controlValue, matchesSearch } from '../utils/search';
import { MyAssetItem } from '../models/api.model';
import { assetStatusLabel } from '../models/enums';

interface AssignedAsset {
  readonly code: string;
  readonly model: string;
  readonly status: string;
  readonly location: string;
  readonly assignedSince: string;
}

@Component({
  selector: 'app-my-assets-page',
  imports: [MatIconModule, UserMenu],
  templateUrl: './my-assets-page.html',
  styleUrl: './my-assets-page.css',
})
export class MyAssetsPage {
  private readonly auth = inject(AuthService);
  private readonly allocations = inject(AllocationsService);
  protected readonly theme = inject(ThemeService);

  protected readonly user = this.auth.profile;
  private readonly assignedAssetsState = signal<readonly AssignedAsset[]>([]);
  protected readonly globalSearch = signal('');
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly filteredAssignedAssets = computed(() =>
    this.assignedAssetsState().filter(asset =>
      matchesSearch(this.globalSearch(), [
        asset.code,
        asset.model,
        asset.status,
        asset.location,
        asset.assignedSince,
      ])
    )
  );

  constructor() {
    this.load();
  }

  protected updateGlobalSearch(event: Event): void {
    this.globalSearch.set(controlValue(event));
  }

  private load(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.allocations.mineAssets().subscribe({
      next: assets => {
        this.assignedAssetsState.set(assets.map(toAssignedAsset));
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load your assigned assets.');
        this.isLoading.set(false);
      },
    });
  }
}

function toAssignedAsset(item: MyAssetItem): AssignedAsset {
  return {
    code: item.assetCode ?? '-',
    model: item.modelName ?? '-',
    status: assetStatusLabel(item.status),
    location: item.location ?? '-',
    assignedSince: (item.startDate ?? '').slice(0, 10) || '-',
  };
}
