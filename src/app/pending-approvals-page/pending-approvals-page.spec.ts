import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AllocationRequestDto, PagedResult, RequestListItem } from '../models/api.model';
import { RequestsService } from '../services/requests.service';
import { PendingApprovalsPage } from './pending-approvals-page';

const APPROVAL_ROWS: readonly RequestListItem[] = [
  requestListItem('approval-0002', 'AH-0002', 'MacBook Pro 14"', 'Chloe Davis', 0, 24, '2026-06-28T00:00:00Z', '2026-07-01T00:00:00Z'),
  requestListItem('approval-0006', 'AH-0006', 'Dell UltraSharp 27', 'Ivy Tanaka', 0, 12, '2026-06-27T00:00:00Z', null),
  requestListItem('approval-0014', 'AH-0014', 'iPad Air', 'Gina Patel', 0, 6, '2026-06-26T00:00:00Z', null),
  requestListItem('approval-0019', 'AH-0019', 'Cisco Catalyst 9200', 'Felix Wong', 0, 36, '2026-06-25T00:00:00Z', '2026-07-02T00:00:00Z'),
];

const APPROVAL_DETAILS: Readonly<Record<string, AllocationRequestDto>> = {
  'approval-0002': requestDetail('approval-0002', 'AH-0002', 'MacBook Pro 14"', 'Chloe Davis', 'Replacement for failing battery on current laptop.'),
  'approval-0006': requestDetail('approval-0006', 'AH-0006', 'Dell UltraSharp 27', 'Ivy Tanaka', 'Second display for analytics workstation.'),
  'approval-0014': requestDetail('approval-0014', 'AH-0014', 'iPad Air', 'Gina Patel', 'Temporary tablet for on-site event booth.'),
  'approval-0019': requestDetail('approval-0019', 'AH-0019', 'Cisco Catalyst 9200', 'Felix Wong', 'Spare switch for MDF maintenance window.'),
};

describe('PendingApprovalsPage', () => {
  let fixture: ComponentFixture<PendingApprovalsPage>;
  let auth: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingApprovalsPage],
      providers: [
        {
          provide: RequestsService,
          useValue: {
            pending: vi.fn(() => of(page(APPROVAL_ROWS))),
            get: vi.fn((id: string) => of(APPROVAL_DETAILS[id] ?? APPROVAL_DETAILS['approval-0002'])),
            approve: vi.fn((id: string) => of(APPROVAL_DETAILS[id] ?? APPROVAL_DETAILS['approval-0002'])),
            reject: vi.fn((id: string) => of(APPROVAL_DETAILS[id] ?? APPROVAL_DETAILS['approval-0002'])),
          },
        },
      ],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
  });

  async function createPage(username = 'alice'): Promise<HTMLElement> {
    auth.selectMockUser(username);
    fixture = TestBed.createComponent(PendingApprovalsPage);
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('should render the Figma approvals table for AdminIT and Manager roles', async () => {
    for (const username of ['alice', 'ben']) {
      const compiled = await createPage(username);
      expect(compiled.textContent).toContain('Pending approvals');
      expect(compiled.textContent).toContain('Requests waiting on your decision.');
      expect(compiled.textContent).toContain('4 awaiting');
      expect(compiled.textContent).toContain('Chloe Davis');
      expect(compiled.textContent).toContain('AH-0002');
      expect(compiled.textContent).toContain('MacBook Pro 14"');
      expect(compiled.textContent).toContain('Ivy Tanaka');
      expect(compiled.textContent).toContain('AH-0006');
      expect(compiled.textContent).toContain('Dell UltraSharp 27');
      expect(compiled.textContent).toContain('iPad Air');
      expect(compiled.querySelectorAll('tbody tr').length).toBe(4);
      fixture.destroy();
    }
  });

  it('should filter approvals from the top search', async () => {
    const compiled = await createPage();
    const search = compiled.querySelector<HTMLInputElement>('#approvals-global-search');
    search!.value = 'Ivy';
    search!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('tbody tr').length).toBe(1);
    expect(compiled.textContent).toContain('Ivy Tanaka');
    expect(compiled.textContent).toContain('AH-0006');
  });

  it('should remove approved and rejected requests from the awaiting list', async () => {
    const compiled = await createPage();
    compiled.querySelector<HTMLButtonElement>('[aria-label="Approve request for AH-0002"]')?.click();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Approved AH-0002');
    expect(compiled.textContent).toContain('3 awaiting');
    expect(compiled.querySelector('[aria-label="Approve request for AH-0002"]')).toBeNull();

    compiled.querySelector<HTMLButtonElement>('[aria-label="Reject request for AH-0006"]')?.click();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Rejected AH-0006');
    expect(compiled.textContent).toContain('2 awaiting');
    expect(compiled.querySelectorAll('tbody tr').length).toBe(2);
  });

  it('should block direct employee access', async () => {
    const compiled = await createPage('chloe');

    expect(compiled.textContent).toContain('Only managers and AdminIT users can review pending approvals.');
    expect(compiled.querySelector('table')).toBeNull();
  });
});

function page<T>(items: readonly T[]): PagedResult<T> {
  return { items, total: items.length, page: 1, pageSize: 100, totalPages: 1 };
}

function requestListItem(
  id: string,
  assetCode: string,
  modelName: string,
  requesterName: string,
  status: number,
  expectedDurationMonths: number,
  createdAt: string,
  lockExpiresAt: string | null
): RequestListItem {
  return {
    id,
    requesterId: `user-${requesterName}`,
    requesterName,
    assetInstanceId: `asset-${assetCode}`,
    assetCode,
    modelName,
    status,
    expectedDurationMonths,
    lockExpiresAt,
    createdAt,
  };
}

function requestDetail(
  id: string,
  assetCode: string,
  modelName: string,
  requesterName: string,
  reason: string
): AllocationRequestDto {
  return {
    id,
    requesterId: `user-${requesterName}`,
    requesterName,
    assetInstanceId: `asset-${assetCode}`,
    assetCode,
    modelName,
    status: 0,
    reason,
    expectedDurationMonths: 24,
    approverId: null,
    approverName: null,
    approvedAt: null,
    rejectedReason: null,
    lockExpiresAt: null,
    createdAt: '2026-06-28T00:00:00Z',
    updatedAt: '2026-06-28T00:00:00Z',
  };
}
