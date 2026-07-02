import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AllocationRequestDto, PagedResult, RequestListItem } from '../models/api.model';
import { RequestsService } from '../services/requests.service';
import { MyRequestsPage } from './my-requests-page';

const REQUEST_ROWS: readonly RequestListItem[] = [
  requestListItem('request-0002', 'AH-0002', 'MacBook Pro 14"', 'Chloe Davis', 0, 24, '2026-06-28T00:00:00Z', '2026-07-01T00:00:00Z'),
  requestListItem('request-0017', 'AH-0017', 'Logitech MX Master 3S', 'Chloe Davis', 2, 12, '2026-06-29T00:00:00Z', null),
  requestListItem('request-0007', 'AH-0007', 'ThinkPad X1 Carbon', 'Ivy Tanaka', 0, 18, '2026-06-27T00:00:00Z', null),
  requestListItem('request-0015', 'AH-0015', 'iPad Air', 'Gina Patel', 1, 6, '2026-06-26T00:00:00Z', '2026-06-30T00:00:00Z'),
];

const REQUEST_DETAILS: Readonly<Record<string, AllocationRequestDto>> = {
  'request-0002': requestDetail('request-0002', 'AH-0002', 'MacBook Pro 14"', 'Chloe Davis', 0, 24, 'Replacement for failing battery on current laptop.', '2026-07-01T00:00:00Z', '2026-06-28T00:00:00Z'),
  'request-0017': requestDetail('request-0017', 'AH-0017', 'Logitech MX Master 3S', 'Chloe Davis', 2, 12, 'Need a quieter mouse for shared seating.', null, '2026-06-29T00:00:00Z'),
  'request-0007': requestDetail('request-0007', 'AH-0007', 'ThinkPad X1 Carbon', 'Ivy Tanaka', 0, 18, 'Replacement for damaged screen.', null, '2026-06-27T00:00:00Z'),
  'request-0015': requestDetail('request-0015', 'AH-0015', 'iPad Air', 'Gina Patel', 1, 6, 'Temporary loan for event demo setup.', '2026-06-30T00:00:00Z', '2026-06-26T00:00:00Z'),
};

describe('MyRequestsPage', () => {
  let fixture: ComponentFixture<MyRequestsPage>;
  let auth: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyRequestsPage],
      providers: [
        {
          provide: RequestsService,
          useValue: {
            mine: vi.fn(() => of(page(REQUEST_ROWS))),
            get: vi.fn((id: string) => of(REQUEST_DETAILS[id] ?? REQUEST_DETAILS['request-0002'])),
          },
        },
      ],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
  });

  async function createPage(username = 'chloe'): Promise<HTMLElement> {
    auth.selectMockUser(username);
    fixture = TestBed.createComponent(MyRequestsPage);
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('should render the Figma request table for all mock roles', async () => {
    for (const username of ['alice', 'ben', 'chloe']) {
      const compiled = await createPage(username);
      expect(compiled.textContent).toContain('My requests');
      expect(compiled.textContent).toContain("Requests you've submitted across all assets.");
      expect(compiled.textContent).toContain('AH-0002');
      expect(compiled.textContent).toContain('AH-0017');
      expect(compiled.textContent).toContain('AH-0007');
      expect(compiled.textContent).toContain('AH-0015');
      expect(compiled.querySelectorAll('tbody tr').length).toBe(4);
      fixture.destroy();
    }
  });

  it('should filter requests from the top search', async () => {
    const compiled = await createPage();
    const search = compiled.querySelector<HTMLInputElement>('#requests-global-search');
    search!.value = 'Logitech';
    search!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('tbody tr').length).toBe(1);
    expect(compiled.textContent).toContain('AH-0017');
    expect(compiled.textContent).not.toContain('AH-0002');
  });

  it('should open the request details drawer from an asset row and close it', async () => {
    const compiled = await createPage();
    compiled.querySelector<HTMLButtonElement>('[aria-label="View request for AH-0002"]')?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.request-drawer')).toBeTruthy();
    expect(compiled.textContent).toContain('AH-0002 - MacBook Pro 14"');
    expect(compiled.textContent).toContain('Submitted 2026-06-28');
    expect(compiled.textContent).toContain('Replacement for failing battery on current laptop.');
    expect(compiled.textContent).toContain('Expected duration');
    expect(compiled.textContent).toContain('24 months');
    expect(compiled.textContent).toContain('Lock expires');
    expect(compiled.textContent).toContain('2026-07-01');

    compiled.querySelector<HTMLButtonElement>('.drawer-close')?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.request-drawer')).toBeNull();
  });

  it('should update the profile area for the current mock user', async () => {
    const compiled = await createPage('ben');

    expect(compiled.textContent).toContain('Ben Carter');
    expect(compiled.textContent).toContain('Operations');
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
  status: number,
  expectedDurationMonths: number,
  reason: string,
  lockExpiresAt: string | null,
  createdAt: string
): AllocationRequestDto {
  return {
    id,
    requesterId: `user-${requesterName}`,
    requesterName,
    assetInstanceId: `asset-${assetCode}`,
    assetCode,
    modelName,
    status,
    reason,
    expectedDurationMonths,
    approverId: 'user-alice',
    approverName: 'Alice Morgan',
    approvedAt: status === 2 ? '2026-06-30T00:00:00Z' : null,
    rejectedReason: null,
    lockExpiresAt,
    createdAt,
    updatedAt: createdAt,
  };
}
