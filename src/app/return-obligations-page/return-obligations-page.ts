import { UserMenu } from '../user-menu/user-menu';
import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { LoadingSkeleton } from '../loading-skeleton/loading-skeleton';
import { ReturnsService } from '../services/returns.service';
import { controlValue, matchesSearch } from '../utils/search';
import { ReturnObligationDto } from '../models/api.model';
import { returnObligationReasonLabel, ReturnObligationReasonLabel } from '../models/enums';

interface ReturnObligationRecord {
  readonly id: string;
  readonly employee: string;
  readonly assetCode: string;
  readonly model: string;
  readonly reason: ReturnObligationReasonLabel;
  readonly due: string;
  readonly resolved: string;
  readonly notes: string;
  readonly open: boolean;
}

@Component({
  selector: 'app-return-obligations-page',
  imports: [LoadingSkeleton, MatIconModule, UserMenu],
  templateUrl: './return-obligations-page.html',
  styleUrl: './return-obligations-page.css',
})
export class ReturnObligationsPage {
  private readonly auth = inject(AuthService);
  private readonly returnsApi = inject(ReturnsService);
  protected readonly theme = inject(ThemeService);

  protected readonly user = this.auth.profile;
  protected readonly canView = computed(() => this.user().role === 'AdminIT' || this.user().role === 'Manager');
  protected readonly globalSearch = signal('');
  protected readonly includeResolved = signal(false);
  protected readonly obligations = signal<readonly ReturnObligationRecord[]>([]);
  protected readonly resolvingId = signal<string | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly statusMessage = signal('');
  protected readonly openCount = computed(() => this.obligations().filter(item => item.open).length);
  protected readonly filteredObligations = computed(() =>
    this.obligations().filter(item =>
      matchesSearch(this.globalSearch(), [
        item.employee,
        item.assetCode,
        item.model,
        item.reason,
        item.due,
        item.resolved,
        item.notes,
      ])
    )
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

  protected toggleIncludeResolved(event: Event): void {
    this.includeResolved.set((event.target as HTMLInputElement).checked);
    if (this.canView()) {
      this.load();
    }
  }

  protected resolve(record: ReturnObligationRecord): void {
    this.resolvingId.set(record.id);
    this.errorMessage.set('');
    this.returnsApi.resolve(record.id, { notes: 'Asset returned during offboarding.' }).subscribe({
      next: updated => {
        this.obligations.update(items => {
          const mapped = toRecord(updated);
          if (this.includeResolved()) {
            return items.map(item => (item.id === mapped.id ? mapped : item));
          }
          return items.filter(item => item.id !== mapped.id);
        });
        this.statusMessage.set(`${record.assetCode} returned`);
        this.resolvingId.set(null);
      },
      error: () => {
        this.errorMessage.set(`Unable to resolve ${record.assetCode}.`);
        this.resolvingId.set(null);
      },
    });
  }

  private load(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.returnsApi.list({ includeResolved: this.includeResolved() }).subscribe({
      next: items => {
        this.obligations.set(items.map(toRecord));
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load return obligations.');
        this.isLoading.set(false);
      },
    });
  }
}

function toRecord(item: ReturnObligationDto): ReturnObligationRecord {
  return {
    id: item.id,
    employee: item.userName ?? '-',
    assetCode: item.assetCode ?? '-',
    model: item.modelName ?? '-',
    reason: returnObligationReasonLabel(item.reason),
    due: item.dueAt.slice(0, 10),
    resolved: item.resolvedAt ? item.resolvedAt.slice(0, 10) : '-',
    notes: item.resolutionNotes ?? '-',
    open: item.resolvedAt === null,
  };
}
