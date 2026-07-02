import { UserMenu } from '../user-menu/user-menu';
import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Subject, debounceTime, forkJoin } from 'rxjs';
import { FilterSelect } from '../filter-select/filter-select';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { AssetsService } from '../services/assets.service';
import { ApiService } from '../services/api.service';
import { controlValue, matchesSearch } from '../utils/search';
import {
  AssetInstanceDto,
  AssetInstanceListItem,
  AssetModelListItem,
  PagedResult,
  UserListItem,
} from '../models/api.model';
import { ASSET_STATUS, DISPOSAL_TYPE, MAINTENANCE_TYPE, assetStatusLabel, assetStatusValue } from '../models/enums';

interface AssetRow {
  readonly id: string;
  readonly code: string;
  readonly serial: string;
  readonly model: string;
  readonly status: string;
  readonly currentHolder: string;
  readonly location: string;
}

interface AssetDetailView {
  readonly id: string;
  readonly asset: {
    readonly code: string;
    readonly status: string;
    readonly model: string;
    readonly serial: string;
    readonly currentHolder: string;
    readonly location: string;
  };
  readonly manufacturer: string;
  readonly acquisitionCost: string;
  readonly acquisitionDate: string;
  readonly salvageValue: string;
  readonly warrantyExpiry: string;
  readonly notes: string;
  readonly specs: string;
  readonly usefulLife: string;
  readonly maintenanceRecords: number;
  readonly allocationEvents: number;
}

type ActionMode = 'return' | 'transfer' | 'maintenance' | 'dispose';

@Component({
  selector: 'app-assets-page',
  imports: [FilterSelect, MatIconModule, UserMenu],
  templateUrl: './assets-page.html',
  styleUrl: './assets-page.css',
})
export class AssetsPage {
  private readonly auth = inject(AuthService);
  private readonly assetsApi = inject(AssetsService);
  private readonly api = inject(ApiService);
  protected readonly theme = inject(ThemeService);

  protected readonly user = this.auth.profile;
  protected readonly canManageAssets = computed(() => this.auth.role() !== 'Employee');

  private readonly pageSize = 20;
  protected readonly page = signal(1);
  private readonly result = signal<PagedResult<AssetInstanceListItem> | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly statusMessage = signal('');

  protected readonly globalSearch = signal('');
  protected readonly assetSearch = signal('');
  protected readonly statusFilter = signal('');
  protected readonly modelFilter = signal('');
  private readonly searchInput = new Subject<string>();

  private readonly modelList = signal<readonly AssetModelListItem[]>([]);
  protected readonly statuses = ASSET_STATUS;
  protected readonly models = computed(() =>
    this.modelList()
      .map(model => model.name ?? '')
      .filter(Boolean)
  );

  protected readonly selectedAsset = signal<AssetDetailView | null>(null);

  // Inline mutation panel state
  protected readonly actionMode = signal<ActionMode | null>(null);
  protected readonly actionError = signal('');
  protected readonly actionNotes = signal('');
  protected readonly transferUserId = signal('');
  protected readonly maintenanceType = signal(0);
  protected readonly maintenanceVendor = signal('');
  protected readonly maintenanceCost = signal('');
  protected readonly disposalType = signal(0);
  protected readonly disposalSoldTo = signal('');
  protected readonly disposalPrice = signal('');
  protected readonly users = signal<readonly UserListItem[]>([]);
  protected readonly maintenanceTypes = MAINTENANCE_TYPE;
  protected readonly disposalTypes = DISPOSAL_TYPE;

  protected readonly rows = computed<readonly AssetRow[]>(() =>
    (this.result()?.items ?? []).map(toRow)
  );
  protected readonly filteredAssets = computed(() =>
    this.rows().filter(asset =>
      matchesSearch(this.globalSearch(), [
        asset.code,
        asset.serial,
        asset.model,
        asset.status,
        asset.currentHolder,
        asset.location,
      ])
    )
  );
  protected readonly total = computed(() => this.result()?.total ?? 0);
  protected readonly totalPages = computed(() => this.result()?.totalPages ?? 0);

  constructor() {
    this.searchInput.pipe(debounceTime(300)).subscribe(value => {
      this.assetSearch.set(value);
      this.page.set(1);
      this.load();
    });
    this.assetsApi.models().subscribe(result => this.modelList.set(result.items));
    this.load();
  }

  private load(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const statusLabel = this.statusFilter();
    const modelName = this.modelFilter();
    const modelId = modelName
      ? this.modelList().find(model => model.name === modelName)?.id
      : undefined;

    this.assetsApi
      .list({
        status: statusLabel ? assetStatusValue(statusLabel) : undefined,
        modelId,
        search: this.assetSearch() || undefined,
        page: this.page(),
        pageSize: this.pageSize,
      })
      .subscribe({
        next: result => {
          this.result.set(result);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Unable to load assets.');
          this.isLoading.set(false);
        },
      });
  }

  protected updateGlobalSearch(event: Event): void {
    this.globalSearch.set(controlValue(event));
  }

  protected updateAssetSearch(event: Event): void {
    this.searchInput.next(controlValue(event));
  }

  protected setStatusFilter(value: string): void {
    this.statusFilter.set(value);
    this.page.set(1);
    this.load();
  }

  protected setModelFilter(value: string): void {
    this.modelFilter.set(value);
    this.page.set(1);
    this.load();
  }

  protected prevPage(): void {
    if (this.page() > 1) {
      this.page.update(p => p - 1);
      this.load();
    }
  }

  protected nextPage(): void {
    if (this.page() < this.totalPages()) {
      this.page.update(p => p + 1);
      this.load();
    }
  }

  protected openAssetDetail(asset: AssetRow): void {
    this.closeActionPanel();
    forkJoin({
      detail: this.assetsApi.get(asset.id),
      history: this.assetsApi.history(asset.id),
      maintenance: this.assetsApi.maintenance(asset.id),
    }).subscribe({
      next: ({ detail, history, maintenance }) => {
        this.assetsApi.model(detail.modelId).subscribe({
          next: model =>
            this.selectedAsset.set(
              toDetail(detail, {
                manufacturer: model.manufacturer ?? '-',
                specs: model.specs ?? '-',
                usefulLifeMonths: model.defaultUsefulLifeMonths,
                allocationEvents: history.total,
                maintenanceRecords: maintenance.total,
              })
            ),
          error: () =>
            this.selectedAsset.set(
              toDetail(detail, {
                manufacturer: '-',
                specs: '-',
                usefulLifeMonths: 0,
                allocationEvents: history.total,
                maintenanceRecords: maintenance.total,
              })
            ),
        });
      },
      error: () => this.errorMessage.set('Unable to load asset detail.'),
    });
  }

  protected closeAssetDetail(): void {
    this.selectedAsset.set(null);
    this.closeActionPanel();
  }

  // --- Mutations ---

  protected openAction(mode: ActionMode): void {
    this.actionMode.set(mode);
    this.actionError.set('');
    this.actionNotes.set('');
    this.transferUserId.set('');
    this.maintenanceVendor.set('');
    this.maintenanceCost.set('');
    this.disposalSoldTo.set('');
    this.disposalPrice.set('');
    if ((mode === 'transfer' || mode === 'dispose') && this.users().length === 0) {
      this.api
        .get<PagedResult<UserListItem>>('/api/users', { page: 1, pageSize: 200 })
        .subscribe(result => this.users.set(result.items));
    }
  }

  protected closeActionPanel(): void {
    this.actionMode.set(null);
    this.actionError.set('');
  }

  protected updateActionNotes(event: Event): void {
    this.actionNotes.set(controlValue(event));
  }

  protected submitAction(): void {
    const detail = this.selectedAsset();
    if (!detail) {
      return;
    }
    const id = detail.id;
    const mode = this.actionMode();
    if (!mode) {
      return;
    }

    const done = (message: string) => {
      this.statusMessage.set(message);
      this.closeActionPanel();
      this.refreshDetail(id);
      this.load();
    };
    const fail = () => this.actionError.set('Action failed. Please try again.');

    switch (mode) {
      case 'return':
        this.assetsApi
          .returnAsset(id, { notes: this.actionNotes() || null })
          .subscribe({ next: () => done('Asset returned'), error: fail });
        break;
      case 'transfer':
        if (!this.transferUserId()) {
          this.actionError.set('Choose a user to transfer to.');
          return;
        }
        this.assetsApi
          .transfer(id, { toUserId: this.transferUserId(), notes: this.actionNotes() || null })
          .subscribe({ next: () => done('Asset transferred'), error: fail });
        break;
      case 'maintenance':
        this.assetsApi
          .startMaintenance(id, {
            type: this.maintenanceType(),
            description: this.actionNotes() || null,
            vendor: this.maintenanceVendor() || null,
            cost: numberOrNull(this.maintenanceCost()),
          })
          .subscribe({ next: () => done('Maintenance started'), error: fail });
        break;
      case 'dispose':
        this.assetsApi
          .dispose(id, {
            type: this.disposalType(),
            soldToUserId: this.disposalSoldTo() || null,
            salePrice: numberOrNull(this.disposalPrice()),
            reason: this.actionNotes() || null,
          })
          .subscribe({ next: () => done('Asset disposed'), error: fail });
        break;
    }
  }

  private refreshDetail(id: string): void {
    const current = this.selectedAsset();
    this.assetsApi.get(id).subscribe(detail =>
      this.selectedAsset.set(
        toDetail(detail, {
          manufacturer: current?.manufacturer ?? '-',
          specs: current?.specs ?? '-',
          usefulLifeMonths: 0,
          allocationEvents: current?.allocationEvents ?? 0,
          maintenanceRecords: current?.maintenanceRecords ?? 0,
        })
      )
    );
  }

  protected onSelectChange(target: (value: number) => void, event: Event): void {
    const value = Number(controlValue(event));
    target(Number.isNaN(value) ? 0 : value);
  }

  protected onTextChange(target: (value: string) => void, event: Event): void {
    target(controlValue(event));
  }
}

function toRow(item: AssetInstanceListItem): AssetRow {
  return {
    id: item.id,
    code: item.assetCode ?? '-',
    serial: item.serial ?? '-',
    model: item.modelName ?? '-',
    status: assetStatusLabel(item.status),
    currentHolder: item.currentHolderName ?? '-',
    location: item.location ?? '-',
  };
}

function toDetail(
  dto: AssetInstanceDto,
  extra: {
    manufacturer: string;
    specs: string;
    usefulLifeMonths: number;
    allocationEvents: number;
    maintenanceRecords: number;
  }
): AssetDetailView {
  return {
    id: dto.id,
    asset: {
      code: dto.assetCode ?? '-',
      status: assetStatusLabel(dto.status),
      model: dto.modelName ?? '-',
      serial: dto.serial ?? '-',
      currentHolder: dto.currentHolderName ?? '-',
      location: dto.location ?? '-',
    },
    manufacturer: extra.manufacturer,
    acquisitionCost: formatCurrency(dto.acquisitionCost),
    acquisitionDate: formatDate(dto.acquisitionDate),
    salvageValue: formatCurrency(dto.salvageValue),
    warrantyExpiry: formatDate(dto.warrantyExpiresAt),
    notes: dto.notes ?? '-',
    specs: extra.specs,
    usefulLife: extra.usefulLifeMonths ? `${extra.usefulLifeMonths} months` : '-',
    maintenanceRecords: extra.maintenanceRecords,
    allocationEvents: extra.allocationEvents,
  };
}

function formatCurrency(value: number | null): string {
  if (value === null || value === undefined) {
    return '-';
  }
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

function formatDate(value: string | null): string {
  if (!value) {
    return '-';
  }
  return value.slice(0, 10);
}

function numberOrNull(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}
