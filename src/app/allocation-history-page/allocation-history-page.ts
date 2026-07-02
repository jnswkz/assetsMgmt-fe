import { UserMenu } from '../user-menu/user-menu';
import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FilterSelect } from '../filter-select/filter-select';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { controlValue, matchesSearch, uniqueStrings } from '../utils/search';

type AllocationEvent = 'Allocated' | 'Transferred' | 'Returned';

interface AllocationRecord {
  readonly assetCode: string;
  readonly model: string;
  readonly user: string;
  readonly event: AllocationEvent;
  readonly start: string;
  readonly end: string;
  readonly notes: string;
}

const ALLOCATION_HISTORY: readonly AllocationRecord[] = [
  {
    assetCode: 'AH-0001',
    model: 'MacBook Pro 14"',
    user: 'Chloe Davis',
    event: 'Allocated',
    start: '2025-06-15',
    end: '-',
    notes: 'Onboarding allocation.',
  },
  {
    assetCode: 'AH-0004',
    model: 'MacBook Pro 14"',
    user: 'Diego Ramirez',
    event: 'Allocated',
    start: '2025-12-02',
    end: '-',
    notes: '-',
  },
  {
    assetCode: 'AH-0005',
    model: 'ThinkPad X1 Carbon',
    user: 'Felix Wong',
    event: 'Allocated',
    start: '2026-01-11',
    end: '-',
    notes: '-',
  },
  {
    assetCode: 'AH-0008',
    model: 'Dell UltraSharp 27',
    user: 'Chloe Davis',
    event: 'Allocated',
    start: '2025-09-13',
    end: '-',
    notes: '-',
  },
  {
    assetCode: 'AH-0014',
    model: 'iPad Air',
    user: 'Gina Patel',
    event: 'Transferred',
    start: '2026-04-21',
    end: '-',
    notes: 'Transferred from u4.',
  },
  {
    assetCode: 'AH-0012',
    model: 'iPhone 15 Pro',
    user: 'Felix Wong',
    event: 'Returned',
    start: '2024-01-12',
    end: '2025-06-25',
    notes: 'Returned at end of life.',
  },
  {
    assetCode: 'AH-0011',
    model: 'iPhone 15 Pro',
    user: 'Felix Wong',
    event: 'Allocated',
    start: '2026-02-10',
    end: '-',
    notes: '-',
  },
  {
    assetCode: 'AH-0009',
    model: 'Dell UltraSharp 27',
    user: 'Diego Ramirez',
    event: 'Allocated',
    start: '2025-09-13',
    end: '-',
    notes: '-',
  },
  {
    assetCode: 'AH-0016',
    model: 'Logitech MX Master 3S',
    user: 'Chloe Davis',
    event: 'Allocated',
    start: '2025-12-22',
    end: '-',
    notes: '-',
  },
  {
    assetCode: 'AH-0003',
    model: 'MacBook Pro 14"',
    user: 'Ivy Tanaka',
    event: 'Returned',
    start: '2025-02-15',
    end: '2026-05-31',
    notes: 'Returned for keyboard repair.',
  },
];

@Component({
  selector: 'app-allocation-history-page',
  imports: [FilterSelect, MatIconModule, UserMenu],
  templateUrl: './allocation-history-page.html',
  styleUrl: './allocation-history-page.css',
})
export class AllocationHistoryPage {
  private readonly auth = inject(AuthService);
  protected readonly theme = inject(ThemeService);

  protected readonly user = this.auth.profile;
  protected readonly canView = computed(() => this.user().role === 'AdminIT' || this.user().role === 'Manager');
  protected readonly globalSearch = signal('');
  protected readonly assetFilter = signal('');
  protected readonly userFilter = signal('');
  protected readonly assetOptions = uniqueStrings(ALLOCATION_HISTORY.map(record => record.assetCode));
  protected readonly userOptions = uniqueStrings(ALLOCATION_HISTORY.map(record => record.user));
  protected readonly filteredRecords = computed(() =>
    ALLOCATION_HISTORY.filter(record => {
      const matchesAsset = this.assetFilter() === '' || record.assetCode === this.assetFilter();
      const matchesUser = this.userFilter() === '' || record.user === this.userFilter();
      const matchesQuery = matchesSearch(this.globalSearch(), [
        record.assetCode,
        record.model,
        record.user,
        record.event,
        record.start,
        record.end,
        record.notes,
      ]);

      return matchesAsset && matchesUser && matchesQuery;
    })
  );

  protected updateGlobalSearch(event: Event): void {
    this.globalSearch.set(controlValue(event));
  }

  protected updateAssetFilter(event: Event): void {
    this.assetFilter.set(controlValue(event));
  }

  protected updateUserFilter(event: Event): void {
    this.userFilter.set(controlValue(event));
  }
}
