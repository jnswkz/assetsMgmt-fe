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
  readonly id: string;
  readonly code: string;
  readonly model: string;
  readonly status: string;
  readonly location: string;
  readonly assignedSince: string;
  readonly handoverDocumentNumber: string | null;
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
  protected readonly statusMessage = signal('');
  protected readonly downloadingAssetId = signal<string | null>(null);
  protected readonly filteredAssignedAssets = computed(() =>
    this.assignedAssetsState().filter(asset =>
      matchesSearch(this.globalSearch(), [
        asset.code,
        asset.model,
        asset.status,
        asset.location,
        asset.assignedSince,
        asset.handoverDocumentNumber,
      ])
    )
  );

  constructor() {
    this.load();
  }

  protected updateGlobalSearch(event: Event): void {
    this.globalSearch.set(controlValue(event));
  }

  protected downloadHandover(asset: AssignedAsset): void {
    if (this.downloadingAssetId()) {
      return;
    }

    this.downloadingAssetId.set(asset.id);
    this.statusMessage.set('');
    this.errorMessage.set('');

    this.allocations.downloadHandover(asset.id).subscribe({
      next: file => {
        const fileName = handoverFileName(asset);
        triggerDownload(file, fileName);
        this.statusMessage.set(`Downloaded ${fileName}.`);
        this.downloadingAssetId.set(null);
      },
      error: () => {
        this.errorMessage.set('Handover document is not available for this asset yet.');
        this.downloadingAssetId.set(null);
      },
    });
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
    id: item.assetInstanceId,
    code: item.assetCode ?? '-',
    model: item.modelName ?? '-',
    status: assetStatusLabel(item.status),
    location: item.location ?? '-',
    assignedSince: (item.startDate ?? '').slice(0, 10) || '-',
    handoverDocumentNumber: item.handoverDocumentNumber ?? null,
  };
}

function handoverFileName(asset: AssignedAsset): string {
  const documentName = asset.handoverDocumentNumber?.trim();
  if (documentName) {
    return `${documentName}.pdf`;
  }

  const code = asset.code === '-' ? asset.id : asset.code;
  return `handover-${code}.pdf`;
}

function triggerDownload(file: Blob, fileName: string): void {
  const url = URL.createObjectURL(file);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
