import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { DashboardPage } from './dashboard-page';
import { AuthService } from '../services/auth.service';
import { DashboardStatsDto, PagedResult, RequestListItem } from '../models/api.model';
import { ReportsService } from '../services/reports.service';
import { RequestsService } from '../services/requests.service';

const DASHBOARD_STATS: DashboardStatsDto = {
  totalAssets: 20,
  inStock: 5,
  allocated: 10,
  lockedTemp: 1,
  maintenance: 2,
  endOfLife: 1,
  pendingRequests: 4,
  totalAcquisitionCost: 100000,
  byStatus: [
    { status: 0, count: 5 },
    { status: 1, count: 10 },
    { status: 3, count: 2 },
  ],
  byCategory: [
    { category: 0, count: 8 },
    { category: 1, count: 4 },
    { category: 4, count: 3 },
  ],
};

const REQUESTS: PagedResult<RequestListItem> = {
  items: [
    request('req-0017', 'AH-0017', 'Logitech MX Master 3S', 'Chloe Davis', 2),
    request('req-0007', 'AH-0007', 'ThinkPad X1 Carbon', 'Ivy Tanaka', 0),
  ],
  total: 2,
  page: 1,
  pageSize: 6,
  totalPages: 1,
};

describe('DashboardPage', () => {
  let fixture: ComponentFixture<DashboardPage>;
  let auth: AuthService;
  let reports: { dashboard: ReturnType<typeof vi.fn> };
  let requestsApi: {
    mine: ReturnType<typeof vi.fn>;
    pending: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    reports = {
      dashboard: vi.fn(() => of(DASHBOARD_STATS)),
    };
    requestsApi = {
      mine: vi.fn(() => of(REQUESTS)),
      pending: vi.fn(() => of(REQUESTS)),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        provideRouter([]),
        { provide: ReportsService, useValue: reports },
        { provide: RequestsService, useValue: requestsApi },
      ],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
  });

  async function createDashboard(username = 'chloe'): Promise<HTMLElement> {
    auth.selectMockUser(username);
    fixture = TestBed.createComponent(DashboardPage);
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('should render the employee dashboard by default', async () => {
    const compiled = await createDashboard();

    expect(compiled.textContent).toContain('Welcome, Chloe');
    expect(compiled.textContent).toContain('Locked (temp)');
    expect(compiled.textContent).toContain('My recent requests');
  });

  it('should render the approval dashboard for AdminIT', async () => {
    const compiled = await createDashboard('alice');

    expect(compiled.textContent).toContain('Welcome, Alice');
    expect(compiled.textContent).toContain('Pending Requests');
    expect(compiled.textContent).toContain('Requests awaiting approval');
  });

  it('should filter requests from the top search', async () => {
    const compiled = await createDashboard();
    const search = compiled.querySelector<HTMLInputElement>('#dashboard-search');
    search!.value = 'Logitech';
    search!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('.request-row').length).toBe(1);
    expect(compiled.textContent).toContain('req-0017');
    expect(compiled.textContent).not.toContain('req-0007');
    expect(compiled.textContent).toContain('Activity feed is not available yet.');
  });

  it('should toggle the document theme from the topbar button', async () => {
    const compiled = await createDashboard();
    const toggle = compiled.querySelector<HTMLButtonElement>('[data-theme-toggle]');
    const initialTheme = document.documentElement.getAttribute('data-theme');

    toggle?.click();
    fixture.detectChanges();

    const nextTheme = document.documentElement.getAttribute('data-theme');
    expect(toggle).toBeTruthy();
    expect(nextTheme).not.toBe(initialTheme);
    expect(nextTheme === 'dark' || nextTheme === 'light').toBe(true);
  });
});

function request(
  id: string,
  assetCode: string,
  modelName: string,
  requesterName: string,
  status: number
): RequestListItem {
  return {
    id,
    requesterId: `user-${requesterName}`,
    requesterName,
    assetInstanceId: `asset-${assetCode}`,
    assetCode,
    modelName,
    status,
    expectedDurationMonths: 24,
    lockExpiresAt: null,
    createdAt: '2026-06-29T00:00:00Z',
  };
}
