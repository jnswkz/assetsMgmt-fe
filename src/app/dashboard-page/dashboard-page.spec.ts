import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DashboardPage } from './dashboard-page';
import { AuthService } from '../services/auth.service';
import {
  AssetInstanceListItem,
  AssetModelListItem,
  DashboardStatsDto,
  MyAssetItem,
  PagedResult,
  RequestListItem,
} from '../models/api.model';
import { AssetsService } from '../services/assets.service';
import { AllocationsService } from '../services/allocations.service';
import { ReportsService } from '../services/reports.service';
import { RequestsService } from '../services/requests.service';
import { InventoryService } from '../services/inventory.service';

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
    request('req-0017', 'AH-0017', 'Logitech MX Master 3S', 'Chloe Davis', 2, null),
    request('req-0007', 'AH-0007', 'ThinkPad X1 Carbon', 'Ivy Tanaka', 0, '2026-07-07T10:30:00Z'),
  ],
  total: 2,
  page: 1,
  pageSize: 6,
  totalPages: 1,
};

const MY_ASSETS: readonly MyAssetItem[] = [
  {
    assetInstanceId: 'asset-monitor',
    assetCode: 'IT-MT-0006',
    modelName: 'Dell UltraSharp U2723QE',
    status: 2,
    location: 'Desk A12',
    startDate: '2026-06-01T00:00:00Z',
    allocationRequestId: 'req-monitor',
    handoverDocumentNumber: null,
    hasHandover: false,
  },
];

const AVAILABLE_ASSETS: PagedResult<AssetInstanceListItem> = {
  items: [
    {
      id: 'asset-claude',
      assetCode: 'IT-OTH-0001',
      serial: 'CLAUDE-1',
      modelId: 'model-claude',
      modelName: 'Claude Pro',
      status: 0,
      currentHolderId: null,
      currentHolderName: null,
      location: 'IT Store',
      qrCodePath: null,
      qrCodeUrl: null,
    },
  ],
  total: 1,
  page: 1,
  pageSize: 4,
  totalPages: 1,
};

const MODELS: PagedResult<AssetModelListItem> = {
  items: [
    {
      id: 'model-claude',
      name: 'Claude Pro',
      category: 7,
      manufacturer: 'Anthropic',
      modelNumber: 'PRO',
      defaultUsefulLifeMonths: 12,
      instanceCount: 1,
    },
  ],
  total: 1,
  page: 1,
  pageSize: 5,
  totalPages: 1,
};

describe('DashboardPage', () => {
  let fixture: ComponentFixture<DashboardPage>;
  let auth: AuthService;
  let reports: {
    dashboard: ReturnType<typeof vi.fn>;
    assetMatrix: ReturnType<typeof vi.fn>;
    allocationTimeline: ReturnType<typeof vi.fn>;
    depreciationAlerts: ReturnType<typeof vi.fn>;
  };
  let requestsApi: {
    mine: ReturnType<typeof vi.fn>;
    pending: ReturnType<typeof vi.fn>;
  };
  let assetsApi: {
    available: ReturnType<typeof vi.fn>;
  };
  let allocationsApi: {
    mineAssets: ReturnType<typeof vi.fn>;
  };
  let inventoryApi: {
    create: ReturnType<typeof vi.fn>;
    addItem: ReturnType<typeof vi.fn>;
    close: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    reports = {
      dashboard: vi.fn(() => of(DASHBOARD_STATS)),
      assetMatrix: vi.fn(() => of([{ assetInstanceId: 'asset-1', assetCode: 'IT-LAP-0001',
        modelName: 'ThinkPad X1', category: 0, status: 2, location: 'Desk A1', holderId: 'user-1',
        holderName: 'Ben Carter', departmentId: 'dept-1', departmentName: 'Operations' }])),
      allocationTimeline: vi.fn(() => of([{ allocationId: 'allocation-1', assetInstanceId: 'asset-1',
        assetCode: 'IT-LAP-0001', modelName: 'ThinkPad X1', userId: 'user-1', userName: 'Ben Carter',
        departmentId: 'dept-1', departmentName: 'Operations', eventType: 0,
        startDate: '2026-07-01', endDate: null, expectedReturnAt: '2027-07-01' }])),
      depreciationAlerts: vi.fn(() => of([])),
    };
    requestsApi = {
      mine: vi.fn(() => of(REQUESTS)),
      pending: vi.fn(() => of(REQUESTS)),
    };
    assetsApi = {
      available: vi.fn(() => of(AVAILABLE_ASSETS.items.map(item => ({
        id: item.id,
        assetCode: item.assetCode ?? '',
        modelId: item.modelId,
        modelName: item.modelName ?? '',
        category: 7,
        specsSummary: null,
        location: item.location,
      })))),
    };
    allocationsApi = {
      mineAssets: vi.fn(() => of(MY_ASSETS)),
    };
    const openScan = { id: 'scan-1', departmentId: 'dept-1', departmentName: 'Operations', status: 0,
      startedAt: '2026-07-07', closedAt: null, found: 0, missing: 0, unexpected: 0, items: [] };
    inventoryApi = {
      create: vi.fn(() => of(openScan)),
      addItem: vi.fn(() => of({ ...openScan, found: 1, items: [{ id: 'item-1', assetInstanceId: 'asset-1',
        assetCode: 'IT-LAP-0001', result: 0, scannedAt: '2026-07-07' }] })),
      close: vi.fn(() => of({ ...openScan, status: 1, closedAt: '2026-07-07', found: 1, items: [] })),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        provideRouter([]),
        { provide: ReportsService, useValue: reports },
        { provide: RequestsService, useValue: requestsApi },
        { provide: AssetsService, useValue: assetsApi },
        { provide: AllocationsService, useValue: allocationsApi },
        { provide: InventoryService, useValue: inventoryApi },
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
    expect(compiled.textContent).toContain('Assigned to me');
    expect(compiled.textContent).toContain('My devices');
    expect(compiled.textContent).toContain('Active requests');
    expect(compiled.textContent).toContain('Available to request');
    expect(compiled.textContent).toContain('IT-MT-0006');
    expect(compiled.textContent).toContain('Claude Pro');
    expect(compiled.textContent).not.toContain('Assets by status');
    expect(reports.dashboard).not.toHaveBeenCalled();
  });

  it('keeps successful employee panels when one endpoint fails', async () => {
    assetsApi.available.mockReturnValueOnce(throwError(() => new Error('network')));

    const compiled = await createDashboard();

    expect(compiled.textContent).toContain('IT-MT-0006');
    expect(compiled.textContent).toContain('Some sections could not be loaded: available assets.');
    expect(compiled.textContent).not.toContain('Unable to load your workspace.');
  });

  it('should render the approval dashboard for AdminIT', async () => {
    const compiled = await createDashboard('alice');

    expect(compiled.textContent).toContain('Welcome, Alice');
    expect(compiled.textContent).toContain('Pending Requests');
    expect(compiled.textContent).toContain('Requests awaiting approval');
    expect(compiled.textContent).toContain('IT-LAP-0001');
    expect(compiled.textContent).toContain('Allocation timeline');
  });

  it('should record an inventory scan from the manager dashboard', async () => {
    const compiled = await createDashboard('alice');
    Array.from(compiled.querySelectorAll<HTMLButtonElement>('button'))
      .find(button => button.textContent?.includes('Start session'))?.click();
    fixture.detectChanges();
    const input = compiled.querySelector<HTMLInputElement>('#inventory-code');
    input!.value = 'IT-LAP-0001';
    input!.dispatchEvent(new Event('input'));
    compiled.querySelector<HTMLButtonElement>('.inventory-entry button[type="submit"]')?.click();
    fixture.detectChanges();

    expect(inventoryApi.addItem).toHaveBeenCalledWith('scan-1', 'IT-LAP-0001');
    expect(compiled.textContent).toContain('Found');
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
    expect(compiled.textContent).toContain('Quick actions');
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
  status: number,
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
    expectedDurationMonths: 24,
    lockExpiresAt,
    createdAt: '2026-06-29T00:00:00Z',
  };
}
