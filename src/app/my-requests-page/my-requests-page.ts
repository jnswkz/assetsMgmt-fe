import { Component, computed, inject, signal } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { controlValue, matchesSearch } from '../utils/search';

type RequestStatus = 'Pending' | 'Approved' | 'Cancelled';

interface AssetRequest {
  readonly assetCode: string;
  readonly model: string;
  readonly status: RequestStatus;
  readonly duration: string;
  readonly expectedDuration: string;
  readonly submitted: string;
  readonly reason: string;
  readonly approver: string;
  readonly decisionReason: string;
  readonly lockExpires: string;
}

const REQUESTS: readonly AssetRequest[] = [
  {
    assetCode: 'AH-0002',
    model: 'MacBook Pro 14"',
    status: 'Pending',
    duration: '24 mo',
    expectedDuration: '24 months',
    submitted: '2026-06-28',
    reason: 'Replacement for failing battery on current laptop.',
    approver: '-',
    decisionReason: '-',
    lockExpires: '2026-07-01',
  },
  {
    assetCode: 'AH-0017',
    model: 'Logitech MX Master 3S',
    status: 'Approved',
    duration: '24 mo',
    expectedDuration: '24 months',
    submitted: '2026-06-10',
    reason: 'Ergonomic mouse - current one is failing.',
    approver: 'Ben Carter',
    decisionReason: 'Approved for workstation kit replacement.',
    lockExpires: '-',
  },
  {
    assetCode: 'AH-0007',
    model: 'ThinkPad X1 Carbon',
    status: 'Cancelled',
    duration: '6 mo',
    expectedDuration: '6 months',
    submitted: '2026-06-22',
    reason: 'Backup laptop for travel.',
    approver: 'Alice Morgan',
    decisionReason: 'Cancelled after inventory review.',
    lockExpires: '-',
  },
  {
    assetCode: 'AH-0015',
    model: 'iPad Air',
    status: 'Pending',
    duration: '3 mo',
    expectedDuration: '3 months',
    submitted: '2026-06-29',
    reason: 'Field testing for upcoming launch.',
    approver: '-',
    decisionReason: '-',
    lockExpires: '2026-07-02',
  },
];

@Component({
  selector: 'app-my-requests-page',
  imports: [A11yModule, MatIconModule],
  templateUrl: './my-requests-page.html',
  styleUrl: './my-requests-page.css',
})
export class MyRequestsPage {
  private readonly auth = inject(AuthService);

  protected readonly user = this.auth.currentUser;
  protected readonly requests = REQUESTS;
  protected readonly globalSearch = signal('');
  protected readonly selectedRequest = signal<AssetRequest | null>(null);
  protected readonly filteredRequests = computed(() =>
    this.requests.filter(request =>
      matchesSearch(this.globalSearch(), [
        request.assetCode,
        request.model,
        request.status,
        request.duration,
        request.expectedDuration,
        request.submitted,
        request.reason,
        request.approver,
        request.decisionReason,
        request.lockExpires,
      ])
    )
  );

  protected updateGlobalSearch(event: Event): void {
    this.globalSearch.set(controlValue(event));
  }

  protected openRequestDetail(request: AssetRequest): void {
    this.selectedRequest.set(request);
  }

  protected closeRequestDetail(): void {
    this.selectedRequest.set(null);
  }
}
