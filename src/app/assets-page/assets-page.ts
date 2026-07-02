import { UserMenu } from '../user-menu/user-menu';
import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Subject, catchError, debounceTime, forkJoin, of } from 'rxjs';
import { FilterSelect } from '../filter-select/filter-select';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { AssetsService } from '../services/assets.service';
import { UsersService } from '../services/users.service';
import { controlValue, matchesSearch } from '../utils/search';
import { environment } from '../../environments/environment';
import {
  AllocationHistoryItem,
  AssetInstanceDto,
  AssetInstanceListItem,
  AssetModelListItem,
  CreateAssetInstanceRequest,
  MaintenanceRecordDto,
  PagedResult,
  UserListItem,
} from '../models/api.model';
import {
  ASSET_STATUS,
  DISPOSAL_TYPE,
  MAINTENANCE_TYPE,
  DisposalTypeLabel,
  assetStatusLabel,
  assetStatusValue,
  depreciationMethodLabel,
  maintenanceStatusLabel,
} from '../models/enums';

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
    readonly qrCodeUrl: string | null;
  };
  readonly manufacturer: string;
  readonly acquisitionCost: string;
  readonly acquisitionDate: string;
  readonly salvageValue: string;
  readonly warrantyExpiry: string;
  readonly notes: string;
  readonly specs: string;
  readonly usefulLife: string;
  readonly depreciationMethod: string;
  readonly maintenanceRecords: number;
  readonly allocationEvents: number;
  readonly allocationHistory: readonly AssetAllocationHistoryView[];
  readonly maintenanceHistory: readonly AssetMaintenanceHistoryView[];
  readonly depreciation: AssetDepreciationView;
}

interface AssetAllocationHistoryView {
  readonly event: string;
  readonly user: string;
  readonly start: string;
  readonly end: string;
  readonly notes: string;
}

interface AssetMaintenanceHistoryView {
  readonly type: string;
  readonly status: string;
  readonly description: string;
  readonly vendor: string;
  readonly start: string;
  readonly end: string;
  readonly cost: string;
  readonly notes: string;
}

interface AssetDepreciationView {
  readonly method: string;
  readonly usefulLife: string;
  readonly acquisitionCost: string;
  readonly salvageValue: string;
  readonly depreciableBase: string;
  readonly monthlyDepreciation: string;
  readonly annualDepreciation: string;
  readonly estimatedBookValue: string;
  readonly remainingLife: string;
}

type AssetDetailTab = 'overview' | 'history' | 'maintenance' | 'depreciation';

type ActionMode = 'return' | 'transfer' | 'maintenance' | 'dispose';

interface InstanceForm {
  modelId: string;
  serial: string;
  acquisitionCost: string;
  acquisitionDate: string;
  salvageValue: string;
  location: string;
  warrantyExpiresAt: string;
  notes: string;
}

const EMPTY_INSTANCE_FORM: InstanceForm = {
  modelId: '',
  serial: '',
  acquisitionCost: '',
  acquisitionDate: '',
  salvageValue: '',
  location: '',
  warrantyExpiresAt: '',
  notes: '',
};

@Component({
  selector: 'app-assets-page',
  imports: [FilterSelect, MatIconModule, UserMenu],
  templateUrl: './assets-page.html',
  styleUrl: './assets-page.css',
})
export class AssetsPage {
  private readonly auth = inject(AuthService);
  private readonly assetsApi = inject(AssetsService);
  private readonly usersApi = inject(UsersService);
  protected readonly theme = inject(ThemeService);

  protected readonly user = this.auth.profile;
  /** Manager + AdminIT can run lifecycle actions (transfer/return/maintenance/dispose). */
  protected readonly canManageLifecycle = computed(() => this.auth.role() !== 'Employee');
  /** Only AdminIT can create/edit/delete asset instances and see maintenance history. */
  protected readonly canAdminAssets = computed(() => this.auth.role() === 'AdminIT');

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
  protected readonly selectedDetailTab = signal<AssetDetailTab>('overview');

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

  // Instance create/edit dialog (AdminIT only)
  protected readonly isInstanceDialogOpen = signal(false);
  protected readonly editingInstanceId = signal<string | null>(null);
  protected readonly instanceForm = signal<InstanceForm>({ ...EMPTY_INSTANCE_FORM });
  protected readonly instanceError = signal('');
  protected readonly isSavingInstance = signal(false);
  protected readonly deletingId = signal<string | null>(null);
  protected readonly instanceDialogTitle = computed(() =>
    this.editingInstanceId() ? 'Edit asset' : 'New asset'
  );
  protected readonly modelOptions = computed(() => this.modelList());

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
    this.selectedDetailTab.set('overview');
    this.closeActionPanel();
    this.loadAssetDetail(asset.id);
  }

  protected closeAssetDetail(): void {
    this.selectedAsset.set(null);
    this.selectedDetailTab.set('overview');
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
    if (mode === 'dispose') {
      this.disposalType.set(disposalTypeValue('Scrapped'));
    }
    if ((mode === 'transfer' || mode === 'dispose') && this.users().length === 0) {
      this.usersApi.list({ page: 1, pageSize: 200 }).subscribe(result => this.users.set(result.items));
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
        if (!this.actionNotes().trim()) {
          this.actionError.set('Enter maintenance notes.');
          return;
        }
        this.assetsApi
          .startMaintenance(id, {
            type: this.maintenanceType(),
            description: this.actionNotes().trim(),
            vendor: this.maintenanceVendor() || null,
            cost: numberOrNull(this.maintenanceCost()),
          })
          .subscribe({ next: () => done('Maintenance started'), error: fail });
        break;
      case 'dispose':
        if (this.disposalType() === disposalTypeValue('Sold')) {
          if (!this.disposalSoldTo() || numberOrNull(this.disposalPrice()) === null) {
            this.actionError.set('Choose a buyer and sale price for sold assets.');
            return;
          }
        }
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
    this.loadAssetDetail(id);
  }

  protected setDetailTab(tab: AssetDetailTab): void {
    this.selectedDetailTab.set(tab);
  }

  private loadAssetDetail(id: string): void {
    const zeroPage: PagedResult<never> = {
      items: [],
      total: 0,
      page: 1,
      pageSize: 50,
      totalPages: 0,
    };

    forkJoin({
      detail: this.assetsApi.get(id),
      history: this.assetsApi.history(id, { page: 1, pageSize: 50 }).pipe(catchError(() => of(zeroPage))),
      maintenance: this.canAdminAssets()
        ? this.assetsApi.maintenance(id, { page: 1, pageSize: 50 }).pipe(catchError(() => of(zeroPage)))
        : of(zeroPage),
    }).subscribe({
      next: ({ detail, history, maintenance }) => {
        this.assetsApi.model(detail.modelId).subscribe({
          next: model =>
            this.selectedAsset.set(
              toDetail(detail, {
                manufacturer: model.manufacturer ?? '-',
                specs: model.specs ?? '-',
                usefulLifeMonths: model.defaultUsefulLifeMonths,
                depreciationMethod: depreciationMethodLabel(model.defaultDepreciationMethod),
                allocationEvents: history.total,
                maintenanceRecords: maintenance.total,
                allocationHistory: history.items.map(toAllocationHistoryItem),
                maintenanceHistory: maintenance.items.map(toMaintenanceHistoryItem),
              })
            ),
          error: () =>
            this.selectedAsset.set(
              toDetail(detail, {
                manufacturer: '-',
                specs: '-',
                usefulLifeMonths: 0,
                depreciationMethod: '-',
                allocationEvents: history.total,
                maintenanceRecords: maintenance.total,
                allocationHistory: history.items.map(toAllocationHistoryItem),
                maintenanceHistory: maintenance.items.map(toMaintenanceHistoryItem),
              })
            ),
        });
      },
      error: () => this.errorMessage.set('Unable to load asset detail.'),
    });
  }

  // --- Instance CRUD (AdminIT only) ---

  protected openCreateInstance(): void {
    if (!this.canAdminAssets()) {
      return;
    }
    this.editingInstanceId.set(null);
    this.instanceForm.set({
      ...EMPTY_INSTANCE_FORM,
      modelId: this.modelList()[0]?.id ?? '',
    });
    this.instanceError.set('');
    this.isInstanceDialogOpen.set(true);
  }

  protected openEditInstance(): void {
    const detail = this.selectedAsset();
    if (!this.canAdminAssets() || !detail) {
      return;
    }
    this.instanceError.set('');
    this.editingInstanceId.set(detail.id);
    this.assetsApi.get(detail.id).subscribe({
      next: dto => {
        this.instanceForm.set({
          modelId: dto.modelId,
          serial: dto.serial ?? '',
          acquisitionCost: String(dto.acquisitionCost ?? ''),
          acquisitionDate: (dto.acquisitionDate ?? '').slice(0, 10),
          salvageValue: String(dto.salvageValue ?? ''),
          location: dto.location ?? '',
          warrantyExpiresAt: (dto.warrantyExpiresAt ?? '').slice(0, 10),
          notes: dto.notes ?? '',
        });
        this.isInstanceDialogOpen.set(true);
      },
      error: () => this.errorMessage.set('Unable to load the asset for editing.'),
    });
  }

  protected closeInstanceDialog(): void {
    this.isInstanceDialogOpen.set(false);
    this.editingInstanceId.set(null);
  }

  protected updateInstanceField(field: keyof InstanceForm, event: Event): void {
    const value = controlValue(event);
    this.instanceForm.update(current => ({ ...current, [field]: value }));
  }

  protected saveInstance(): void {
    const form = this.instanceForm();
    const editingId = this.editingInstanceId();

    if (!editingId && !form.modelId) {
      this.instanceError.set('Choose a model.');
      return;
    }
    if (!form.acquisitionDate) {
      this.instanceError.set('Acquisition date is required.');
      return;
    }
    if (!form.serial.trim()) {
      this.instanceError.set('Serial is required.');
      return;
    }

    const acquisitionDate = new Date(form.acquisitionDate).toISOString();
    const warrantyExpiresAt = form.warrantyExpiresAt
      ? new Date(form.warrantyExpiresAt).toISOString()
      : null;

    this.isSavingInstance.set(true);
    this.instanceError.set('');

    if (editingId) {
      this.assetsApi
        .updateAsset(editingId, {
          serial: form.serial.trim() || null,
          acquisitionCost: Number(form.acquisitionCost) || 0,
          acquisitionDate,
          salvageValue: Number(form.salvageValue) || 0,
          location: form.location.trim() || null,
          warrantyExpiresAt,
          notes: form.notes.trim() || null,
        })
        .subscribe({
          next: () => this.onInstanceSaved('Asset updated', editingId),
          error: () => this.onInstanceSaveError(),
        });
    } else {
      const body: CreateAssetInstanceRequest = {
        modelId: form.modelId,
        serial: form.serial.trim() || null,
        acquisitionCost: Number(form.acquisitionCost) || 0,
        acquisitionDate,
        salvageValue: numberOrNull(form.salvageValue),
        location: form.location.trim() || null,
        warrantyExpiresAt,
        notes: form.notes.trim() || null,
      };
      this.assetsApi.createAsset(body).subscribe({
        next: () => this.onInstanceSaved('Asset created', null),
        error: () => this.onInstanceSaveError(),
      });
    }
  }

  private onInstanceSaved(message: string, editingId: string | null): void {
    this.isSavingInstance.set(false);
    this.statusMessage.set(message);
    this.closeInstanceDialog();
    if (editingId && this.selectedAsset()) {
      this.refreshDetail(editingId);
    }
    this.load();
  }

  private onInstanceSaveError(): void {
    this.isSavingInstance.set(false);
    this.instanceError.set('Save failed. Check the fields and try again.');
  }

  protected askDeleteInstance(): void {
    const detail = this.selectedAsset();
    if (this.canAdminAssets() && detail) {
      this.deletingId.set(detail.id);
    }
  }

  protected cancelDeleteInstance(): void {
    this.deletingId.set(null);
  }

  protected confirmDeleteInstance(): void {
    const id = this.deletingId();
    if (!id) {
      return;
    }
    this.assetsApi.deleteAsset(id).subscribe({
      next: () => {
        this.statusMessage.set('Asset deleted');
        this.deletingId.set(null);
        this.closeAssetDetail();
        this.load();
      },
      error: () => {
        this.errorMessage.set('Delete failed. The asset may be allocated or in use.');
        this.deletingId.set(null);
      },
    });
  }

  protected onSelectChange(target: (value: number) => void, event: Event): void {
    const value = Number(controlValue(event));
    target(Number.isNaN(value) ? 0 : value);
  }

  protected onTextChange(target: (value: string) => void, event: Event): void {
    target(controlValue(event));
  }
}

function disposalTypeValue(label: DisposalTypeLabel): number {
  return DISPOSAL_TYPE.indexOf(label);
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
    depreciationMethod: string;
    allocationEvents: number;
    maintenanceRecords: number;
    allocationHistory: readonly AssetAllocationHistoryView[];
    maintenanceHistory: readonly AssetMaintenanceHistoryView[];
  }
): AssetDetailView {
  const depreciation = toDepreciationView(
    dto.acquisitionCost,
    dto.salvageValue,
    dto.acquisitionDate,
    extra.usefulLifeMonths,
    extra.depreciationMethod
  );

  return {
    id: dto.id,
    asset: {
      code: dto.assetCode ?? '-',
      status: assetStatusLabel(dto.status),
      model: dto.modelName ?? '-',
      serial: dto.serial ?? '-',
      currentHolder: dto.currentHolderName ?? '-',
      location: dto.location ?? '-',
      qrCodeUrl: toAssetUrl(dto.qrCodeUrl ?? dto.qrCodePath),
    },
    manufacturer: extra.manufacturer,
    acquisitionCost: formatCurrency(dto.acquisitionCost),
    acquisitionDate: formatDate(dto.acquisitionDate),
    salvageValue: formatCurrency(dto.salvageValue),
    warrantyExpiry: formatDate(dto.warrantyExpiresAt),
    notes: dto.notes ?? '-',
    specs: extra.specs,
    usefulLife: extra.usefulLifeMonths ? `${extra.usefulLifeMonths} months` : '-',
    depreciationMethod: extra.depreciationMethod,
    maintenanceRecords: extra.maintenanceRecords,
    allocationEvents: extra.allocationEvents,
    allocationHistory: extra.allocationHistory,
    maintenanceHistory: extra.maintenanceHistory,
    depreciation,
  };
}

function toAllocationHistoryItem(item: AllocationHistoryItem): AssetAllocationHistoryView {
  return {
    event: allocationEventLabel(item.eventType),
    user: item.userName ?? '-',
    start: formatDate(item.startDate),
    end: formatDate(item.endDate),
    notes: item.notes ?? '-',
  };
}

function toMaintenanceHistoryItem(item: MaintenanceRecordDto): AssetMaintenanceHistoryView {
  return {
    type: MAINTENANCE_TYPE[item.maintenanceType] ?? 'Other',
    status: maintenanceStatusLabel(item.status),
    description: item.description ?? '-',
    vendor: item.vendor ?? '-',
    start: formatDate(item.startDate),
    end: formatDate(item.endDate),
    cost: formatCurrency(item.cost),
    notes: item.notes ?? item.description ?? '-',
  };
}

function toDepreciationView(
  acquisitionCost: number,
  salvageValue: number,
  acquisitionDate: string,
  usefulLifeMonths: number,
  depreciationMethod: string
): AssetDepreciationView {
  const depreciableBase = Math.max(acquisitionCost - salvageValue, 0);
  const elapsedMonths = monthsSince(acquisitionDate);
  const monthlyDepreciation =
    usefulLifeMonths > 0 && depreciationMethod === 'Straight line'
      ? depreciableBase / usefulLifeMonths
      : null;
  const annualDepreciation = monthlyDepreciation === null ? null : monthlyDepreciation * 12;
  const estimatedBookValue =
    monthlyDepreciation === null
      ? null
      : Math.max(acquisitionCost - Math.min(elapsedMonths, usefulLifeMonths) * monthlyDepreciation, salvageValue);
  const remainingLifeMonths =
    usefulLifeMonths > 0 ? Math.max(usefulLifeMonths - Math.min(elapsedMonths, usefulLifeMonths), 0) : null;

  return {
    method: depreciationMethod,
    usefulLife: usefulLifeMonths ? `${usefulLifeMonths} months` : '-',
    acquisitionCost: formatCurrency(acquisitionCost),
    salvageValue: formatCurrency(salvageValue),
    depreciableBase: formatCurrency(depreciableBase),
    monthlyDepreciation: monthlyDepreciation === null ? 'Unavailable' : formatCurrency(monthlyDepreciation),
    annualDepreciation: annualDepreciation === null ? 'Unavailable' : formatCurrency(annualDepreciation),
    estimatedBookValue: estimatedBookValue === null ? 'Unavailable' : formatCurrency(estimatedBookValue),
    remainingLife: remainingLifeMonths === null ? '-' : `${remainingLifeMonths} months`,
  };
}

function allocationEventLabel(value: number): string {
  return (['Allocated', 'Transferred', 'Returned'] as const)[value] ?? 'Allocated';
}

function toAssetUrl(pathOrUrl: string | null | undefined): string | null {
  if (!pathOrUrl) {
    return null;
  }
  try {
    return new URL(pathOrUrl, environment.apiBaseUrl).toString();
  } catch {
    return pathOrUrl;
  }
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

function monthsSince(value: string): number {
  if (!value) {
    return 0;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 0;
  }

  const now = new Date();
  let months = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
  if (now.getDate() < date.getDate()) {
    months -= 1;
  }
  return Math.max(months, 0);
}

function numberOrNull(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}
