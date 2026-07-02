import { UserMenu } from '../user-menu/user-menu';
import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { catchError, forkJoin, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { RequestsService } from '../services/requests.service';
import { controlValue, matchesSearch } from '../utils/search';
import { AllocationRequestDto, RequestListItem } from '../models/api.model';

interface PendingApproval {
  readonly id: string;
  readonly requester: string;
  readonly assetCode: string;
  readonly model: string;
  readonly reason: string;
  readonly duration: string;
  readonly submitted: string;
  readonly lockExpires: string;
}

@Component({
  selector: 'app-pending-approvals-page',
  imports: [MatIconModule, UserMenu],
  templateUrl: './pending-approvals-page.html',
  styleUrl: './pending-approvals-page.css',
})
export class PendingApprovalsPage {
  private readonly auth = inject(AuthService);
  private readonly requestsApi = inject(RequestsService);
  protected readonly theme = inject(ThemeService);

  protected readonly user = this.auth.profile;
  protected readonly canReview = computed(() => this.user().role === 'AdminIT' || this.user().role === 'Manager');
  protected readonly globalSearch = signal('');
  private readonly approvals = signal<readonly PendingApproval[]>([]);
  protected readonly decisionMessage = signal('');
  protected readonly errorMessage = signal('');
  protected readonly isLoading = signal(true);

  protected readonly pendingApprovals = computed(() => this.approvals());
  protected readonly awaitingCount = computed(() => this.approvals().length);
  protected readonly filteredApprovals = computed(() =>
    this.pendingApprovals().filter(approval =>
      matchesSearch(this.globalSearch(), [
        approval.requester,
        approval.assetCode,
        approval.model,
        approval.reason,
        approval.duration,
        approval.submitted,
        approval.lockExpires,
      ])
    )
  );

  constructor() {
    if (this.canReview()) {
      this.load();
    } else {
      this.isLoading.set(false);
    }
  }

  protected updateGlobalSearch(event: Event): void {
    this.globalSearch.set(controlValue(event));
  }

  protected approve(approval: PendingApproval): void {
    this.requestsApi.approve(approval.id).subscribe({
      next: () => this.finishDecision(approval, 'Approved'),
      error: () => this.errorMessage.set(`Unable to approve ${approval.assetCode}.`),
    });
  }

  protected reject(approval: PendingApproval): void {
    this.requestsApi.reject(approval.id, { reason: 'Rejected from approvals page.' }).subscribe({
      next: () => this.finishDecision(approval, 'Rejected'),
      error: () => this.errorMessage.set(`Unable to reject ${approval.assetCode}.`),
    });
  }

  private load(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.requestsApi.pending({ page: 1, pageSize: 100 }).subscribe({
      next: result => {
        if (result.items.length === 0) {
          this.approvals.set([]);
          this.isLoading.set(false);
          return;
        }
        forkJoin(
          result.items.map(item =>
            this.requestsApi.get(item.id).pipe(catchError(() => of<AllocationRequestDto | null>(null)))
          )
        ).subscribe(details => {
          this.approvals.set(result.items.map((item, index) => toPendingApproval(item, details[index])));
          this.isLoading.set(false);
        });
      },
      error: () => {
        this.errorMessage.set('Unable to load pending approvals.');
        this.isLoading.set(false);
      },
    });
  }

  private finishDecision(approval: PendingApproval, action: 'Approved' | 'Rejected'): void {
    this.approvals.update(items => items.filter(item => item.id !== approval.id));
    this.decisionMessage.set(`${action} ${approval.assetCode}`);
  }
}

function toPendingApproval(
  item: RequestListItem,
  detail: AllocationRequestDto | null
): PendingApproval {
  return {
    id: item.id,
    requester: item.requesterName ?? '-',
    assetCode: item.assetCode ?? '-',
    model: item.modelName ?? '-',
    reason: detail?.reason ?? '-',
    duration: item.expectedDurationMonths ? `${item.expectedDurationMonths} mo` : '-',
    submitted: item.createdAt.slice(0, 10),
    lockExpires: item.lockExpiresAt?.slice(0, 10) ?? '-',
  };
}
