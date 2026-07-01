import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/nav-item';
import { controlValue, matchesSearch } from '../utils/search';

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
  readonly status: 'Pending' | 'Locked' | 'Approved' | 'Cancelled';
}

interface ActivityRow {
  readonly message: string;
  readonly time: string;
}

interface DashboardView {
  readonly stats: readonly StatCard[];
  readonly requestsTitle: string;
  readonly showApprovalActions: boolean;
  readonly requests: readonly RequestRow[];
  readonly activities: readonly ActivityRow[];
}

const STATUS_SLICES: readonly StatusSlice[] = [
  { label: 'Allocated', value: 10, color: '#3b82f6' },
  { label: 'InStock', value: 5, color: '#10b981' },
  { label: 'Maintenance', value: 1, color: '#f97316' },
  { label: 'LockedTemp', value: 1, color: '#f59e0b' },
  { label: 'Retired', value: 1, color: '#9ca3af' },
  { label: 'Lost', value: 1, color: '#ef4444' },
  { label: 'Disposed', value: 1, color: '#1f2937' },
];

const CATEGORY_BARS: readonly CategoryBar[] = [
  { label: 'Laptop', value: 10 },
  { label: 'Monitor', value: 5 },
  { label: 'Phone', value: 3 },
  { label: 'Tablet', value: 2 },
  { label: 'Peripheral', value: 8 },
  { label: 'Printer', value: 2 },
  { label: 'NetworkDevice', value: 2 },
];

const APPROVAL_REQUESTS: readonly RequestRow[] = [
  {
    id: '002',
    asset: 'AH-0002 · MacBook Pro 14"',
    details: 'Chloe Davis · Replacement for failing battery on current laptop.',
    status: 'Pending',
  },
  {
    id: '006',
    asset: 'AH-0006 · ThinkPad X1 Carbon',
    details: 'Ivy Tanaka · New hire onboarding — Engineering.',
    status: 'Locked',
  },
  {
    id: '010',
    asset: 'AH-0010 · Dell UltraSharp 27',
    details: 'Gina Patel · Secondary monitor for design review work.',
    status: 'Pending',
  },
  {
    id: '015',
    asset: 'AH-0015 · iPad Air',
    details: 'Chloe Davis · Field testing for upcoming launch.',
    status: 'Pending',
  },
];

const EMPLOYEE_REQUESTS: readonly RequestRow[] = [
  APPROVAL_REQUESTS[0],
  {
    id: '017',
    asset: 'AH-0017 · Logitech MX Master 3S',
    details: 'Chloe Davis · Ergonomic mouse — current one is failing.',
    status: 'Approved',
  },
  {
    id: '007',
    asset: 'AH-0007 · ThinkPad X1 Carbon',
    details: 'Chloe Davis · Backup laptop for travel.',
    status: 'Cancelled',
  },
  APPROVAL_REQUESTS[3],
];

const ACTIVITIES: readonly ActivityRow[] = [
  { message: 'Ben Carter approved request — AH-0014 (iPad Air)', time: '2h ago' },
  { message: 'Alice Morgan created asset — AH-0017 (Logitech MX Master 3S)', time: '5h ago' },
  { message: 'Chloe Davis requested — AH-0002 (MacBook Pro 14")', time: '1d ago' },
  { message: 'Ben Carter started maintenance — AH-0003 (MacBook Pro 16")', time: '1d ago' },
  { message: 'Ella Nguyen disposed — AH-0020 — Sold', time: '2d ago' },
  { message: 'Jonas Berg transferred — AH-0014 → Gina Patel', time: '3d ago' },
];

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterModule, MatIconModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  private readonly auth = inject(AuthService);

  protected readonly user = this.auth.currentUser;
  protected readonly globalSearch = signal('');
  protected readonly statusSlices = STATUS_SLICES;
  protected readonly categoryBars = CATEGORY_BARS;
  protected readonly donutBackground = buildDonutBackground(STATUS_SLICES);
  protected readonly maxCategoryValue = 12;

  protected readonly view = computed<DashboardView>(() => {
    const role = this.auth.role();
    const employeeView = role === 'Employee';

    return {
      stats: buildStats(role),
      requestsTitle: employeeView ? 'My recent requests' : 'Requests awaiting approval',
      showApprovalActions: !employeeView,
      requests: employeeView ? EMPLOYEE_REQUESTS : APPROVAL_REQUESTS,
      activities: ACTIVITIES,
    };
  });
  protected readonly filteredRequests = computed(() =>
    this.view().requests.filter(request =>
      matchesSearch(this.globalSearch(), [
        request.id,
        request.asset,
        request.details,
        request.status,
      ])
    )
  );
  protected readonly filteredActivities = computed(() =>
    this.view().activities.filter(activity =>
      matchesSearch(this.globalSearch(), [
        activity.message,
        activity.time,
      ])
    )
  );

  protected updateGlobalSearch(event: Event): void {
    this.globalSearch.set(controlValue(event));
  }

  protected barHeight(value: number): string {
    return `${(value / this.maxCategoryValue) * 100}%`;
  }
}

function buildStats(role: Role): readonly StatCard[] {
  return [
    { label: 'Total Assets', value: '20', icon: 'device_hub', tone: 'purple' },
    { label: 'In Stock', value: '5', icon: 'inventory_2', tone: 'green' },
    { label: 'Allocated', value: '10', icon: 'person_add', tone: 'blue' },
    { label: 'In Maintenance', value: '1', icon: 'construction', tone: 'orange' },
    role === 'Employee'
      ? { label: 'Assigned to Me', value: '3', icon: 'person_add', tone: 'purple' }
      : { label: 'Pending Requests', value: '4', icon: 'assignment', tone: 'amber' },
  ];
}

function buildDonutBackground(slices: readonly StatusSlice[]): string {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  let cursor = 0;
  const stops = slices.map(slice => {
    const start = (cursor / total) * 100;
    cursor += slice.value;
    const end = (cursor / total) * 100;
    return `${slice.color} ${start}% ${end}%`;
  });

  return `conic-gradient(${stops.join(', ')})`;
}
