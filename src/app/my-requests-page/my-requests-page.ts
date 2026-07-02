import { UserMenu } from '../user-menu/user-menu';
import { Component, computed, inject, signal } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { RequestsService } from '../services/requests.service';
import { controlValue, matchesSearch } from '../utils/search';
import { AllocationRequestDto, RequestListItem } from '../models/api.model';
import { requestStatusLabel } from '../models/enums';

interface AssetRequest {
  readonly id: string;
  readonly assetCode: string;
  readonly model: string;
  readonly status: string;
  readonly duration: string;
  readonly submitted: string;
}

interface AssetRequestDetail extends AssetRequest {
  readonly expectedDuration: string;
  readonly submitted: string;
  readonly reason: string;
  readonly approver: string;
  readonly decisionReason: string;
  readonly lockExpires: string;
}

@Component({
  selector: 'app-my-requests-page',
  imports: [A11yModule, MatIconModule, UserMenu],
  templateUrl: './my-requests-page.html',
  styleUrl: './my-requests-page.css',
})
export class MyRequestsPage {
  private readonly auth = inject(AuthService);
  private readonly requestsApi = inject(RequestsService);
  protected readonly theme = inject(ThemeService);

  protected readonly user = this.auth.profile;
  private readonly requests = signal<readonly AssetRequest[]>([]);
  protected readonly globalSearch = signal('');
  protected readonly selectedRequest = signal<AssetRequestDetail | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly filteredRequests = computed(() =>
    this.requests().filter(request =>
      matchesSearch(this.globalSearch(), [
        request.assetCode,
        request.model,
        request.status,
        request.duration,
      ])
    )
  );

  constructor() {
    this.load();
  }

  protected updateGlobalSearch(event: Event): void {
    this.globalSearch.set(controlValue(event));
  }

  protected openRequestDetail(request: AssetRequest): void {
    this.requestsApi.get(request.id).subscribe({
      next: detail => this.selectedRequest.set(toRequestDetail(detail)),
      error: () => this.errorMessage.set('Unable to load request details.'),
    });
  }

  protected closeRequestDetail(): void {
    this.selectedRequest.set(null);
  }

  private load(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.requestsApi.mine({ page: 1, pageSize: 100 }).subscribe({
      next: result => {
        this.requests.set(result.items.map(toRequestRow));
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load your requests.');
        this.isLoading.set(false);
      },
    });
  }
}

function toRequestRow(item: RequestListItem): AssetRequest {
  return {
    id: item.id,
    assetCode: item.assetCode ?? '-',
    model: item.modelName ?? '-',
    status: requestStatusLabel(item.status),
    duration: item.expectedDurationMonths ? `${item.expectedDurationMonths} mo` : '-',
    submitted: item.createdAt.slice(0, 10),
  };
}

function toRequestDetail(item: AllocationRequestDto): AssetRequestDetail {
  const durationMonths = item.expectedDurationMonths ?? 0;
  return {
    id: item.id,
    assetCode: item.assetCode ?? '-',
    model: item.modelName ?? '-',
    status: requestStatusLabel(item.status),
    duration: durationMonths ? `${durationMonths} mo` : '-',
    submitted: item.createdAt.slice(0, 10),
    expectedDuration: durationMonths ? `${durationMonths} months` : '-',
    reason: item.reason ?? '-',
    approver: item.approverName ?? '-',
    decisionReason: item.rejectedReason ?? '-',
    lockExpires: item.lockExpiresAt?.slice(0, 10) ?? '-',
  };
}
