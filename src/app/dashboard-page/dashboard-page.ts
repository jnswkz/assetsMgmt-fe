import { UserMenu } from '../user-menu/user-menu';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { ReportsService } from '../services/reports.service';
import { RequestsService } from '../services/requests.service';
import { AssetsService } from '../services/assets.service';
import { AllocationsService } from '../services/allocations.service';
import { Role } from '../models/nav-item';
import { controlValue, matchesSearch } from '../utils/search';
import {
  AssetInstanceListItem,
  AssetModelListItem,
  DashboardStatsDto,
  MyAssetItem,
  RequestListItem,
} from '../models/api.model';
import { assetCategoryLabel, assetStatusLabel, requestStatusLabel } from '../models/enums';

interface StatCard {
  readonly label: string;
  readonly value: string;
  readonly icon: string;
  readonly tone: 'purple' | 'green' | 'blue' | 'orange' | 'amber';
}

interface StatusSlice {
  readonly label: string;
  readonly value: number;
  readonly color: string;
}

interface CategoryBar {
  readonly label: string;
  readonly value: number;
}

interface RequestRow {
  readonly id: string;
  readonly asset: string;
  readonly details: string;
  readonly status: string;
  readonly lockExpiresAt: string;
}

interface AssignedAssetRow {
  readonly id: string;
  readonly code: string;
  readonly model: string;
  readonly status: string;
  readonly location: string;
  readonly assignedSince: string;
}

interface AvailableModelRow {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly manufacturer: string;
  readonly instanceCount: number;
}

interface AvailableAssetRow {
  readonly id: string;
  readonly code: string;
  readonly model: string;
  readonly location: string;
}

interface AttentionItem {
  readonly label: string;
  readonly detail: string;
  readonly icon: string;
}

// Stable colors per asset status index (matches enums.ASSET_STATUS order).
const STATUS_COLORS = [
  '#10b981', // In stock
  '#f59e0b', // Locked
  '#3b82f6', // Allocated
  '#f97316', // Maintenance
  '#9ca3af', // Retired
  '#ef4444', // Lost
  '#1f2937', // Disposed
];

const EMPTY_DASHBOARD_STATS: DashboardStatsDto = {
  totalAssets: 0,
  inStock: 0,
  allocated: 0,
  lockedTemp: 0,
  maintenance: 0,
  endOfLife: 0,
  pendingRequests: 0,
  totalAcquisitionCost: 0,
  byStatus: [],
  byCategory: [],
};

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterModule, MatIconModule, UserMenu],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  private readonly auth = inject(AuthService);
  private readonly reports = inject(ReportsService);
  private readonly requestsApi = inject(RequestsService);
  private readonly assetsApi = inject(AssetsService);
  private readonly allocationsApi = inject(AllocationsService);
  protected readonly theme = inject(ThemeService);

  protected readonly user = this.auth.profile;
  protected readonly globalSearch = signal('');

  private readonly stats = signal<DashboardStatsDto | null>(null);
  private readonly requests = signal<readonly RequestRow[]>([]);
  private readonly assignedAssets = signal<readonly AssignedAssetRow[]>([]);
  private readonly availableModels = signal<readonly AvailableModelRow[]>([]);
  private readonly availableAssets = signal<readonly AvailableAssetRow[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly isEmployeeDashboard = computed(() => (this.auth.role() ?? 'Employee') === 'Employee');

  protected readonly statusSlices = computed<readonly StatusSlice[]>(() =>
    (this.stats()?.byStatus ?? []).map(entry => ({
      label: assetStatusLabel(entry.status),
      value: entry.count,
      color: STATUS_COLORS[entry.status] ?? '#9ca3af',
    }))
  );
  protected readonly categoryBars = computed<readonly CategoryBar[]>(() =>
    (this.stats()?.byCategory ?? []).map(entry => ({
      label: assetCategoryLabel(entry.category),
      value: entry.count,
    }))
  );
  protected readonly donutBackground = computed(() => buildDonutBackground(this.statusSlices()));
  protected readonly maxCategoryValue = computed(() =>
    Math.max(1, ...this.categoryBars().map(bar => bar.value))
  );

  protected readonly view = computed(() => {
    const role = this.auth.role() ?? 'Employee';
    const employeeView = role === 'Employee';
    return {
      stats: buildStats(role, this.stats()),
      requestsTitle: employeeView ? 'My recent requests' : 'Requests awaiting approval',
      showApprovalActions: !employeeView,
    };
  });

  protected readonly employeeStats = computed<readonly StatCard[]>(() => {
    const requests = this.requests();
    const assigned = this.assignedAssets();
    const pending = requests.filter(request => request.status === 'Pending').length;
    const approved = requests.filter(request => request.status === 'Approved').length;
    const needsAttention = this.attentionItems().length;

    return [
      { label: 'Assigned to me', value: assigned.length.toString(), icon: 'devices', tone: 'blue' },
      { label: 'Pending requests', value: pending.toString(), icon: 'pending_actions', tone: 'amber' },
      { label: 'Approved requests', value: approved.toString(), icon: 'task_alt', tone: 'green' },
      { label: 'Needs attention', value: needsAttention.toString(), icon: 'priority_high', tone: 'orange' },
    ];
  });

  protected readonly attentionItems = computed<readonly AttentionItem[]>(() => {
    const items: AttentionItem[] = [];
    const pendingWithLocks = this.requests().filter(request => request.status === 'Pending' && request.lockExpiresAt !== '-');

    for (const request of pendingWithLocks.slice(0, 2)) {
      items.push({
        label: 'Request lock active',
        detail: `${request.asset} is held until ${request.lockExpiresAt}.`,
        icon: 'lock_clock',
      });
    }

    for (const asset of this.assignedAssets().filter(asset => asset.status === 'Maintenance').slice(0, 2)) {
      items.push({
        label: 'Asset in maintenance',
        detail: `${asset.code} · ${asset.model}`,
        icon: 'construction',
      });
    }

    return items;
  });

  protected readonly filteredRequests = computed(() =>
    this.requests().filter(request =>
      matchesSearch(this.globalSearch(), [request.id, request.asset, request.details, request.status, request.lockExpiresAt])
    )
  );
  protected readonly filteredAssignedAssets = computed(() =>
    this.assignedAssets().filter(asset =>
      matchesSearch(this.globalSearch(), [asset.code, asset.model, asset.status, asset.location, asset.assignedSince])
    )
  );
  protected readonly filteredAvailableModels = computed(() =>
    this.availableModels().filter(model =>
      matchesSearch(this.globalSearch(), [
        model.name,
        model.category,
        model.manufacturer,
        model.instanceCount,
      ])
    )
  );
  protected readonly filteredAvailableAssets = computed(() =>
    this.availableAssets().filter(asset =>
      matchesSearch(this.globalSearch(), [asset.code, asset.model, asset.location])
    )
  );

  constructor() {
    this.load();
  }

  private load(): void {
    const employeeView = this.auth.role() === 'Employee';

    this.isLoading.set(true);
    this.errorMessage.set('');

    if (employeeView) {
      this.loadEmployeeDashboard();
      return;
    }

    const requests$ = this.requestsApi.pending({ page: 1, pageSize: 6 });
    const stats$ = this.reports.dashboard();

    forkJoin({
      stats: stats$,
      requests: requests$,
    }).subscribe({
      next: ({ stats, requests }) => {
        this.stats.set(stats);
        this.requests.set(requests.items.map(toRequestRow));
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load dashboard data.');
        this.isLoading.set(false);
      },
    });
  }

  private loadEmployeeDashboard(): void {
    forkJoin({
      assignedAssets: this.allocationsApi.mineAssets(),
      requests: this.requestsApi.mine({ page: 1, pageSize: 6 }),
      availableAssets: this.assetsApi.list({ status: 0, page: 1, pageSize: 4 }),
      models: this.assetsApi.modelsPaged({ page: 1, pageSize: 5 }),
      stats: of(EMPTY_DASHBOARD_STATS),
    }).subscribe({
      next: ({ assignedAssets, requests, availableAssets, models, stats }) => {
        this.stats.set(stats);
        this.assignedAssets.set(assignedAssets.map(toAssignedAssetRow));
        this.requests.set(requests.items.map(toRequestRow));
        this.availableAssets.set(availableAssets.items.map(toAvailableAssetRow));
        this.availableModels.set(models.items.map(toAvailableModelRow));
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load your workspace.');
        this.isLoading.set(false);
      },
    });
  }

  protected updateGlobalSearch(event: Event): void {
    this.globalSearch.set(controlValue(event));
  }

  protected barHeight(value: number): string {
    return `${(value / this.maxCategoryValue()) * 100}%`;
  }
}

function toRequestRow(item: RequestListItem): RequestRow {
  const asset = [item.assetCode, item.modelName].filter(Boolean).join(' · ') || 'Asset';
  return {
    id: item.id.slice(0, 8),
    asset,
    details: item.requesterName ?? '',
    status: requestStatusLabel(item.status),
    lockExpiresAt: formatShortDateTime(item.lockExpiresAt),
  };
}

function toAssignedAssetRow(item: MyAssetItem): AssignedAssetRow {
  return {
    id: item.assetInstanceId,
    code: item.assetCode ?? '-',
    model: item.modelName ?? '-',
    status: assetStatusLabel(item.status),
    location: item.location ?? '-',
    assignedSince: formatDate(item.startDate),
  };
}

function toAvailableModelRow(item: AssetModelListItem): AvailableModelRow {
  return {
    id: item.id,
    name: item.name ?? '-',
    category: assetCategoryLabel(item.category),
    manufacturer: item.manufacturer ?? '-',
    instanceCount: item.instanceCount,
  };
}

function toAvailableAssetRow(item: AssetInstanceListItem): AvailableAssetRow {
  return {
    id: item.id,
    code: item.assetCode ?? '-',
    model: item.modelName ?? '-',
    location: item.location ?? '-',
  };
}

function formatDate(value: string | null | undefined): string {
  return value?.slice(0, 10) || '-';
}

function formatShortDateTime(value: string | null | undefined): string {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 16);
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function buildStats(role: Role, stats: DashboardStatsDto | null): readonly StatCard[] {
  const value = (n: number | undefined) => (n ?? 0).toString();
  return [
    { label: 'Total Assets', value: value(stats?.totalAssets), icon: 'device_hub', tone: 'purple' },
    { label: 'In Stock', value: value(stats?.inStock), icon: 'inventory_2', tone: 'green' },
    { label: 'Allocated', value: value(stats?.allocated), icon: 'person_add', tone: 'blue' },
    { label: 'In Maintenance', value: value(stats?.maintenance), icon: 'construction', tone: 'orange' },
    role === 'Employee'
      ? { label: 'Locked (temp)', value: value(stats?.lockedTemp), icon: 'lock_clock', tone: 'purple' }
      : { label: 'Pending Requests', value: value(stats?.pendingRequests), icon: 'assignment', tone: 'amber' },
  ];
}

function buildDonutBackground(slices: readonly StatusSlice[]): string {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  if (total === 0) {
    return 'conic-gradient(#e5e7eb 0% 100%)';
  }
  let cursor = 0;
  const stops = slices.map(slice => {
    const start = (cursor / total) * 100;
    cursor += slice.value;
    const end = (cursor / total) * 100;
    return `${slice.color} ${start}% ${end}%`;
  });
  return `conic-gradient(${stops.join(', ')})`;
}
