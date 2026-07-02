import { UserMenu } from '../user-menu/user-menu';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { ReportsService } from '../services/reports.service';
import { RequestsService } from '../services/requests.service';
import { Role } from '../models/nav-item';
import { controlValue, matchesSearch } from '../utils/search';
import { DashboardStatsDto, RequestListItem } from '../models/api.model';
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
})
export class DashboardPage {
  private readonly auth = inject(AuthService);
  private readonly reports = inject(ReportsService);
  private readonly requestsApi = inject(RequestsService);
  protected readonly theme = inject(ThemeService);

  protected readonly user = this.auth.profile;
  protected readonly globalSearch = signal('');

  private readonly stats = signal<DashboardStatsDto | null>(null);
  private readonly requests = signal<readonly RequestRow[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');

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

  protected readonly filteredRequests = computed(() =>
    this.requests().filter(request =>
      matchesSearch(this.globalSearch(), [request.id, request.asset, request.details, request.status])
    )
  );

  constructor() {
    this.load();
  }

  private load(): void {
    const employeeView = this.auth.role() === 'Employee';
    const requests$ = employeeView
      ? this.requestsApi.mine({ page: 1, pageSize: 6 })
      : this.requestsApi.pending({ page: 1, pageSize: 6 });
    const stats$ = employeeView ? of(EMPTY_DASHBOARD_STATS) : this.reports.dashboard();

    this.isLoading.set(true);
    this.errorMessage.set('');

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
  };
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
