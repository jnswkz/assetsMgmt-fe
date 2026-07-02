import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import {
  AllocationRequestDto,
  AssetInstanceListItem,
  AssetModelListItem,
  PagedResult,
  RequestListItem,
} from '../models/api.model';
import { AssetsService } from '../services/assets.service';
import { RequestsService } from '../services/requests.service';
import { MyRequestsPage } from './my-requests-page';
import { AssetQuery } from '../services/assets.service';

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
  let requestRows: RequestListItem[];
  let requestDetails: Record<string, AllocationRequestDto>;
  let availableAssets: AssetInstanceListItem[];
  let availableModels: AssetModelListItem[];
  let requestsApi: {
    mine: ReturnType<typeof vi.fn>;
    get: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
  let assetsApi: {
    list: ReturnType<typeof vi.fn>;
    models: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    requestRows = [...REQUEST_ROWS];
    requestDetails = { ...REQUEST_DETAILS };
    availableAssets = [
      asset('asset-ah-0021', 'AH-0021', 'Dell UltraSharp 27'),
      asset('asset-ah-0022', 'AH-0022', 'ThinkPad X1 Carbon'),
    ];
    availableModels = [
      model('model-ah-0021', 'Dell UltraSharp 27', 1, 'Dell', 'U2723QE'),
      model('model-ah-0022', 'ThinkPad X1 Carbon', 0, 'Lenovo', 'X1C-G11'),
      model('model-ah-0023', 'iPhone 15 Pro', 2, 'Apple', 'IP15-PRO'),
    ];
    requestsApi = {
      mine: vi.fn(() => of(page(requestRows))),
      get: vi.fn((id: string) => of(requestDetails[id] ?? requestDetails['request-0002'])),
      create: vi.fn((body: { assetInstanceId: string; reason?: string | null; expectedDurationMonths?: number | null }) => {
        const created = requestDetail(
          'request-new',
          'AH-0021',
          'Dell UltraSharp 27',
          'Chloe Davis',
          0,
          0,
          body.reason ?? '-',
          null,
          '2026-07-02T00:00:00Z'
        );
        requestDetails[created.id] = created;
        requestRows = [toListItem(created), ...requestRows];
        return of(created);
      }),
    };
    assetsApi = {
      list: vi.fn((query?: AssetQuery) =>
        of(
          page<AssetInstanceListItem>(
            availableAssets.filter(
              asset =>
                (query?.modelId ? asset.modelId === query.modelId : true) &&
                (query?.status !== undefined ? asset.status === query.status : true)
            )
          )
        )
      ),
      models: vi.fn(() => of(page<AssetModelListItem>(availableModels))),
    };

    await TestBed.configureTestingModule({
      imports: [MyRequestsPage],
      providers: [
        {
          provide: RequestsService,
          useValue: requestsApi,
        },
        {
          provide: AssetsService,
          useValue: assetsApi,
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

  it('should let a user create a new asset request from the page header', async () => {
    const compiled = await createPage();
    compiled.querySelector<HTMLButtonElement>('.page-header .primary-action')?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.request-dialog')).toBeTruthy();

    const textarea = compiled.querySelector<HTMLTextAreaElement>('.request-form textarea');

    const modelSearch = compiled.querySelector<HTMLInputElement>('#request-model-search');
    modelSearch!.value = 'Dell';
    modelSearch!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    compiled.querySelector<HTMLButtonElement>('.request-model-picker__trigger')?.click();
    fixture.detectChanges();

    Array.from(compiled.querySelectorAll<HTMLButtonElement>('.request-model-picker__option'))
      .find(button => button.textContent?.includes('Dell UltraSharp 27'))
      ?.click();
    fixture.detectChanges();

    Array.from(compiled.querySelectorAll<HTMLButtonElement>('.request-assets__option'))
      .find(button => button.textContent?.includes('AH-0021'))
      ?.click();
    fixture.detectChanges();

    textarea!.value = 'Need a second monitor for finance reporting.';
    textarea!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    compiled.querySelector<HTMLButtonElement>('.request-form .primary-action')?.click();
    fixture.detectChanges();

    expect(requestsApi.create).toHaveBeenCalled();
    expect(compiled.querySelector('.request-dialog')).toBeNull();
    expect(compiled.textContent).toContain('Request submitted for AH-0021');
    expect(compiled.textContent).toContain('AH-0021 - Dell UltraSharp 27');
    expect(compiled.textContent).toContain('Need a second monitor for finance reporting.');
  });

  it('should show a toast when a selected model has no in-stock instances left', async () => {
    const compiled = await createPage();
    compiled.querySelector<HTMLButtonElement>('.page-header .primary-action')?.click();
    fixture.detectChanges();

    const modelSearch = compiled.querySelector<HTMLInputElement>('#request-model-search');
    modelSearch!.value = 'iPhone';
    modelSearch!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    compiled.querySelector<HTMLButtonElement>('.request-model-picker__trigger')?.click();
    fixture.detectChanges();

    Array.from(compiled.querySelectorAll<HTMLButtonElement>('.request-model-picker__option'))
      .find(button => button.textContent?.includes('iPhone 15 Pro'))
      ?.click();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('No instances of iPhone 15 Pro are currently in stock.');
    expect(compiled.querySelectorAll('.request-assets__option').length).toBe(0);
  });

  it('should refresh available request instances whenever the dialog is reopened', async () => {
    const compiled = await createPage();

    compiled.querySelector<HTMLButtonElement>('.page-header .primary-action')?.click();
    fixture.detectChanges();
    expect(compiled.textContent).not.toContain('Claude');

    compiled.querySelector<HTMLButtonElement>('.request-form .secondary-action')?.click();
    fixture.detectChanges();

    availableAssets = [...availableAssets, asset('asset-claude-0001', 'IT-MT-0001', 'Claude')];
    availableModels = [...availableModels, model('model-claude-0001', 'Claude', 7, 'Anthropic', 'claude')];

    compiled.querySelector<HTMLButtonElement>('.page-header .primary-action')?.click();
    fixture.detectChanges();

    const modelSearch = compiled.querySelector<HTMLInputElement>('#request-model-search');
    modelSearch!.value = 'Claude';
    modelSearch!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    compiled.querySelector<HTMLButtonElement>('.request-model-picker__trigger')?.click();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Claude');
    expect(assetsApi.list).toHaveBeenLastCalledWith(
      expect.objectContaining({ modelId: 'model-claude-0001' })
    );
    expect(assetsApi.models).toHaveBeenCalledTimes(2);
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

function asset(id: string, assetCode: string, modelName: string): AssetInstanceListItem {
  return {
    id,
    assetCode,
    serial: `${assetCode}-SERIAL`,
    modelId:
      id === 'asset-ah-0021'
        ? 'model-ah-0021'
        : id === 'asset-ah-0022'
          ? 'model-ah-0022'
          : 'model-claude-0001',
    modelName,
    status: 0,
    currentHolderId: null,
    currentHolderName: null,
    location: 'HQ / IT Storage',
    qrCodePath: null,
  };
}

function model(
  id: string,
  name: string,
  category: number,
  manufacturer: string,
  modelNumber: string
): AssetModelListItem {
  return {
    id,
    name,
    category,
    manufacturer,
    modelNumber,
    defaultUsefulLifeMonths: 36,
    instanceCount: 1,
  };
}

function toListItem(detail: AllocationRequestDto): RequestListItem {
  return {
    id: detail.id,
    requesterId: detail.requesterId,
    requesterName: detail.requesterName,
    assetInstanceId: detail.assetInstanceId,
    assetCode: detail.assetCode,
    modelName: detail.modelName,
    status: detail.status,
    expectedDurationMonths: detail.expectedDurationMonths,
    lockExpiresAt: detail.lockExpiresAt,
    createdAt: detail.createdAt,
  };
}
