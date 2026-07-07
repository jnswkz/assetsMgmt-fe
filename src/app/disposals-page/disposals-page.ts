import { UserMenu } from '../user-menu/user-menu';
import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FilterSelect } from '../filter-select/filter-select';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { LoadingSkeleton } from '../loading-skeleton/loading-skeleton';
import { DisposalsService } from '../services/disposals.service';
import { controlValue, matchesSearch } from '../utils/search';
import { DisposalDto } from '../models/api.model';
import { DISPOSAL_TYPE, DisposalTypeLabel } from '../models/enums';

type DisposalType = DisposalTypeLabel;

interface DisposalRecord {
  readonly assetCode: string;
  readonly type: DisposalType;
  readonly soldTo: string;
  readonly salePrice: string;
  readonly reason: string;
  readonly disposed: string;
}
const DISPOSAL_TYPES: readonly DisposalType[] = DISPOSAL_TYPE;

@Component({
  selector: 'app-disposals-page',
  imports: [FilterSelect, LoadingSkeleton, MatIconModule, UserMenu],
  templateUrl: './disposals-page.html',
  styleUrl: './disposals-page.css',
})
export class DisposalsPage {
  private readonly auth = inject(AuthService);
  private readonly disposalsApi = inject(DisposalsService);
  protected readonly theme = inject(ThemeService);

  protected readonly user = this.auth.profile;
  protected readonly canView = computed(() => this.user().role === 'AdminIT' || this.user().role === 'Manager');
  protected readonly globalSearch = signal('');
  protected readonly typeFilter = signal('');
  private readonly records = signal<readonly DisposalRecord[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly typeOptions = DISPOSAL_TYPES;
  protected readonly filteredDisposals = computed(() =>
    this.records().filter(record => {
      const matchesType = this.typeFilter() === '' || record.type === this.typeFilter();
      const matchesQuery = matchesSearch(this.globalSearch(), [
        record.assetCode,
        record.type,
        record.soldTo,
        record.salePrice,
        record.reason,
        record.disposed,
      ]);

      return matchesType && matchesQuery;
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

  protected setTypeFilter(value: string): void {
    this.typeFilter.set(value);
    if (this.canView()) {
      this.load();
    }
  }

  private load(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.disposalsApi
      .list({
        type: this.typeFilter() === '' ? undefined : DISPOSAL_TYPES.indexOf(this.typeFilter() as DisposalType),
        page: 1,
        pageSize: 200,
      })
      .subscribe({
        next: result => {
          this.records.set(result.items.map(toDisposalRecord));
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Unable to load disposals.');
          this.isLoading.set(false);
        },
      });
  }
}

function toDisposalRecord(item: DisposalDto): DisposalRecord {
  return {
    assetCode: item.assetCode ?? '-',
    type: DISPOSAL_TYPES[item.disposalType] ?? 'Scrapped',
    soldTo: item.soldToUserName ?? '-',
    salePrice: item.salePrice === null ? '-' : formatCurrency(item.salePrice),
    reason: item.reason ?? '-',
    disposed: item.disposedAt.slice(0, 10),
  };
}

function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}
