import { UserMenu } from '../user-menu/user-menu';
import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FilterSelect } from '../filter-select/filter-select';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { LoadingSkeleton } from '../loading-skeleton/loading-skeleton';
import { AllocationsService } from '../services/allocations.service';
import { controlValue, matchesSearch, uniqueStrings } from '../utils/search';
import { AllocationHistoryItem } from '../models/api.model';

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

@Component({
  selector: 'app-allocation-history-page',
  imports: [FilterSelect, LoadingSkeleton, MatIconModule, UserMenu],
  templateUrl: './allocation-history-page.html',
  styleUrl: './allocation-history-page.css',
})
export class AllocationHistoryPage {
  private readonly auth = inject(AuthService);
  private readonly allocationsApi = inject(AllocationsService);
  protected readonly theme = inject(ThemeService);

  protected readonly user = this.auth.profile;
  protected readonly canView = computed(() => this.user().role === 'AdminIT' || this.user().role === 'Manager');
  protected readonly globalSearch = signal('');
  protected readonly assetFilter = signal('');
  protected readonly userFilter = signal('');
  private readonly records = signal<readonly AllocationRecord[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly assetOptions = computed(() =>
    uniqueStrings(this.records().map(record => record.assetCode))
  );
  protected readonly userOptions = computed(() =>
    uniqueStrings(this.records().map(record => record.user))
  );
  protected readonly filteredRecords = computed(() =>
    this.records().filter(record => {
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

  constructor() {
    if (this.canView()) {
      this.load();
    } else {
      this.isLoading.set(false);
    }
  }

  protected updateGlobalSearch(event: Event): void {
    this.globalSearch.set(controlValue(event));
  }

  protected updateAssetFilter(event: Event): void {
    this.assetFilter.set(controlValue(event));
  }

  protected updateUserFilter(event: Event): void {
    this.userFilter.set(controlValue(event));
  }

  private load(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.allocationsApi.history({ page: 1, pageSize: 200 }).subscribe({
      next: result => {
        this.records.set(result.items.map(toAllocationRecord));
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load allocation history.');
        this.isLoading.set(false);
      },
    });
  }
}

function toAllocationRecord(item: AllocationHistoryItem): AllocationRecord {
  return {
    assetCode: item.assetCode ?? '-',
    model: item.modelName ?? '-',
    user: item.userName ?? '-',
    event: allocationEventLabel(item.eventType),
    start: item.startDate.slice(0, 10),
    end: item.endDate?.slice(0, 10) ?? '-',
    notes: item.notes ?? '-',
  };
}

function allocationEventLabel(value: number): AllocationEvent {
  return (['Allocated', 'Transferred', 'Returned'] as const)[value] ?? 'Allocated';
}
