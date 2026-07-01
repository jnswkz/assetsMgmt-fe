import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { controlValue, matchesSearch } from '../utils/search';

type ApprovalDecision = 'approved' | 'rejected';

interface PendingApproval {
  readonly requester: string;
  readonly assetCode: string;
  readonly model: string;
  readonly reason: string;
  readonly duration: string;
  readonly submitted: string;
  readonly lockExpires: string;
}

const APPROVALS: readonly PendingApproval[] = [
  {
    requester: 'Chloe Davis',
    assetCode: 'AH-0002',
    model: 'MacBook Pro 14"',
    reason: 'Replacement for failing battery on current laptop.',
    duration: '24 mo',
    submitted: '2026-06-28',
    lockExpires: '2026-07-01',
  },
  {
    requester: 'Ivy Tanaka',
    assetCode: 'AH-0006',
    model: 'ThinkPad X1 Carbon',
    reason: 'New hire onboarding - Engineering.',
    duration: '36 mo',
    submitted: '2026-06-29',
    lockExpires: '2026-07-02',
  },
  {
    requester: 'Gina Patel',
    assetCode: 'AH-0010',
    model: 'Dell UltraSharp 27',
    reason: 'Secondary monitor for design review work.',
    duration: '18 mo',
    submitted: '2026-06-27',
    lockExpires: '-',
  },
  {
    requester: 'Chloe Davis',
    assetCode: 'AH-0015',
    model: 'iPad Air',
    reason: 'Field testing for upcoming launch.',
    duration: '3 mo',
    submitted: '2026-06-29',
    lockExpires: '-',
  },
];

@Component({
  selector: 'app-pending-approvals-page',
  imports: [MatIconModule],
  templateUrl: './pending-approvals-page.html',
  styleUrl: './pending-approvals-page.css',
})
export class PendingApprovalsPage {
  private readonly auth = inject(AuthService);

  protected readonly user = this.auth.currentUser;
  protected readonly canReview = computed(() => this.user().role === 'AdminIT' || this.user().role === 'Manager');
  protected readonly globalSearch = signal('');
  protected readonly decisions = signal<Readonly<Record<string, ApprovalDecision>>>({});
  protected readonly decisionMessage = signal('');

  protected readonly pendingApprovals = computed(() =>
    APPROVALS.filter(approval => !this.decisions()[approval.assetCode])
  );
  protected readonly awaitingCount = computed(() => this.pendingApprovals().length);
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

  protected updateGlobalSearch(event: Event): void {
    this.globalSearch.set(controlValue(event));
  }

  protected decide(approval: PendingApproval, decision: ApprovalDecision): void {
    this.decisions.update(decisions => ({
      ...decisions,
      [approval.assetCode]: decision,
    }));
    this.decisionMessage.set(`${decision === 'approved' ? 'Approved' : 'Rejected'} ${approval.assetCode}`);
  }
}
