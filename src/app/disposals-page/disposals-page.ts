import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FilterSelect } from '../filter-select/filter-select';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { controlValue, matchesSearch, uniqueStrings } from '../utils/search';

type DisposalType = 'Sold' | 'Lost' | 'Donated' | 'Scrapped';

interface DisposalRecord {
  readonly assetCode: string;
  readonly type: DisposalType;
  readonly soldTo: string;
  readonly salePrice: string;
  readonly reason: string;
  readonly disposed: string;
}

const DISPOSALS: readonly DisposalRecord[] = [
  {
    assetCode: 'AH-0020',
    type: 'Sold',
    soldTo: 'Hugo Schmidt',
    salePrice: '$380',
    reason: 'Sold at end of life to former employee.',
    disposed: '2026-05-21',
  },
  {
    assetCode: 'AH-0013',
    type: 'Lost',
    soldTo: '-',
    salePrice: '-',
    reason: 'Lost in transit; insurance claim filed.',
    disposed: '2026-06-10',
  },
  {
    assetCode: 'AH-0012',
    type: 'Donated',
    soldTo: '-',
    salePrice: '-',
    reason: 'Donated to local non-profit.',
    disposed: '2026-05-01',
  },
  {
    assetCode: 'AH-0018',
    type: 'Scrapped',
    soldTo: '-',
    salePrice: '-',
    reason: 'Beyond economical repair.',
    disposed: '2026-04-11',
  },
];

@Component({
  selector: 'app-disposals-page',
  imports: [FilterSelect, MatIconModule],
  templateUrl: './disposals-page.html',
  styleUrl: './disposals-page.css',
})
export class DisposalsPage {
  private readonly auth = inject(AuthService);
  protected readonly theme = inject(ThemeService);

  protected readonly user = this.auth.currentUser;
  protected readonly canView = computed(() => this.user().role === 'AdminIT' || this.user().role === 'Manager');
  protected readonly globalSearch = signal('');
  protected readonly typeFilter = signal('');
  protected readonly typeOptions = uniqueStrings(DISPOSALS.map(record => record.type));
  protected readonly filteredDisposals = computed(() =>
    DISPOSALS.filter(record => {
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

  protected updateGlobalSearch(event: Event): void {
    this.globalSearch.set(controlValue(event));
  }

  protected updateTypeFilter(event: Event): void {
    this.typeFilter.set(controlValue(event));
  }
}
