import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AssetsPage } from './assets-page';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { AssetQuery, AssetsService } from '../services/assets.service';
import {
  AssetInstanceDto,
  AssetInstanceListItem,
  AssetModelDto,
  AssetModelListItem,
  PagedResult,
} from '../models/api.model';

const MODELS: readonly AssetModelListItem[] = [
  model('model-mbp', 'MacBook Pro 14"', 0, 'Apple', 'MBP14-M3', 48, 6),
  model('model-x1', 'ThinkPad X1 Carbon', 0, 'Lenovo', 'X1C-G11', 36, 4),
  model('model-dell', 'Dell UltraSharp 27', 1, 'Dell', 'U2724D', 60, 3),
  model('model-logi', 'Logitech MX Master 3S', 4, 'Logitech', 'MX3S', 36, 2),
];

const ASSETS: readonly AssetInstanceListItem[] = [
  asset('asset-1', 'AH-0001', 'C02XW0AAJG5J', 'model-mbp', 'MacBook Pro 14"', 1, 'Chloe Davis', 'HQ / 4F / Desk 412'),
  asset('asset-2', 'AH-0002', 'C02XW0BBJG5K', 'model-mbp', 'MacBook Pro 14"', 0, null, 'HQ / IT Storage'),
  asset('asset-3', 'AH-0003', 'C02XW0CCJG5L', 'model-mbp', 'MacBook Pro 14"', 3, null, 'Repair Center'),
  asset('asset-4', 'AH-0004', 'C02XW0DDJG5M', 'model-mbp', 'MacBook Pro 14"', 1, 'Diego Ramirez', 'HQ / 3F / Desk 318'),
  asset('asset-5', 'AH-0005', 'LX1C2304871', 'model-x1', 'ThinkPad X1 Carbon', 1, 'Felix Wong', 'HQ / 2F / Desk 207'),
  asset('asset-6', 'AH-0006', 'LX1C2304872', 'model-x1', 'ThinkPad X1 Carbon', 0, null, 'HQ / IT Storage'),
  asset('asset-7', 'AH-0007', 'LX1C2304873', 'model-x1', 'ThinkPad X1 Carbon', 2, null, 'HQ / IT Storage'),
  asset('asset-8', 'AH-0008', 'CN-DELL-1011', 'model-dell', 'Dell UltraSharp 27', 1, 'Chloe Davis', 'HQ / 4F / Desk 412'),
  asset('asset-9', 'AH-0009', 'CN-DELL-1012', 'model-dell', 'Dell UltraSharp 27', 1, 'Diego Ramirez', 'HQ / 3F / Desk 318'),
  asset('asset-10', 'AH-0010', 'CN-DELL-1013', 'model-dell', 'Dell UltraSharp 27', 0, null, 'HQ / IT Storage'),
  asset('asset-11', 'AH-0011', 'F2LX-9981', 'model-phone', 'iPhone 15 Pro', 1, 'Felix Wong', 'Mobile / Sales'),
  asset('asset-12', 'AH-0012', 'F2LX-9982', 'model-phone', 'iPhone 15 Pro', 6, null, 'Archive'),
  asset('asset-13', 'AH-0013', 'F2LX-9983', 'model-phone', 'iPhone 15 Pro', 5, null, '-'),
  asset('asset-14', 'AH-0014', 'DMX-AIR-101', 'model-ipad', 'iPad Air', 1, 'Gina Patel', 'Marketing'),
  asset('asset-15', 'AH-0015', 'DMX-AIR-102', 'model-ipad', 'iPad Air', 0, null, 'HQ / IT Storage'),
  asset('asset-16', 'AH-0016', 'LGT-MX3S-A1', 'model-logi', 'Logitech MX Master 3S', 1, 'Chloe Davis', 'HQ / 4F'),
  asset('asset-17', 'AH-0017', 'LGT-MX3S-A2', 'model-logi', 'Logitech MX Master 3S', 0, null, 'HQ / IT Storage'),
  asset('asset-18', 'AH-0018', 'HP-LJP-3301', 'model-printer', 'HP LaserJet Pro', 1, null, 'HQ / 2F / Print'),
  asset('asset-19', 'AH-0019', 'CSC-9200-77', 'model-network', 'Cisco Catalyst 9200', 1, null, 'MDF Room'),
  asset('asset-20', 'AH-0020', 'C02XW0EEJG5N', 'model-mbp', 'MacBook Pro 14"', 6, null, 'Disposed'),
];

describe('AssetsPage', () => {
  let fixture: ComponentFixture<AssetsPage>;
  let auth: AuthService;
  let assetsApi: {
    list: ReturnType<typeof vi.fn>;
    models: ReturnType<typeof vi.fn>;
    model: ReturnType<typeof vi.fn>;
    get: ReturnType<typeof vi.fn>;
    history: ReturnType<typeof vi.fn>;
    maintenance: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    assetsApi = {
      list: vi.fn((query: AssetQuery) => of(pageForAssets(query))),
      models: vi.fn(() => of(page(MODELS))),
      model: vi.fn((id: string) => of(modelDetail(id))),
      get: vi.fn((id: string) => of(assetDetail(id))),
      history: vi.fn(() => of({ items: [], total: 3, page: 1, pageSize: 1, totalPages: 1 })),
      maintenance: vi.fn(() => of({ items: [], total: 1, page: 1, pageSize: 1, totalPages: 1 })),
    };

    await TestBed.configureTestingModule({
      imports: [AssetsPage],
      providers: [
        { provide: AssetsService, useValue: assetsApi },
        { provide: ApiService, useValue: { get: vi.fn(() => of(page([]))) } },
      ],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(AssetsPage);
    await fixture.whenStable();
  });

  it('should show asset management actions for AdminIT', () => {
    auth.selectMockUser('alice');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('New asset');
    expect(compiled.textContent).toContain('AH-0001');
    expect(compiled.querySelector('[aria-label="Show QR details for AH-0001"]')).toBeTruthy();
    expect(compiled.querySelector('[aria-label="Edit AH-0001"]')).toBeNull();
  });

  it('should show QR actions for Employee without the new asset action', () => {
    auth.selectMockUser('chloe');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('New asset');
    expect(compiled.querySelector('[aria-label="Show QR details for AH-0001"]')).toBeTruthy();
    expect(compiled.querySelector('[aria-label="Request AH-0001"]')).toBeNull();
    expect(compiled.querySelector('[aria-label="Edit AH-0001"]')).toBeNull();
  });

  it('should open and close the full asset information page from the QR action', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('[aria-label="Show QR details for AH-0001"]')?.click();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Back to assets');
    expect(compiled.textContent).toContain('Scan to look up');
    expect(compiled.querySelector<HTMLImageElement>('.qr-code')?.src).toBe('http://localhost:5046/qr/AH-0001.png');
    expect(compiled.textContent).toContain('Acquisition cost');
    expect(compiled.textContent).toContain('Standard issue dev laptop.');

    compiled.querySelector<HTMLButtonElement>('.back-button')?.click();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Every physical asset unit');
    expect(compiled.textContent).not.toContain('Back to assets');
  });

  it('should filter asset rows from the top search', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const search = compiled.querySelector<HTMLInputElement>('#assets-global-search');
    search!.value = 'Chloe Davis';
    search!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('tbody tr').length).toBe(3);
    expect(compiled.textContent).toContain('AH-0001');
    expect(compiled.textContent).toContain('AH-0008');
    expect(compiled.textContent).toContain('AH-0016');
    expect(compiled.textContent).toContain('Showing 3 of 20');
  });

  it('should combine asset search with status and model filters', async () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const search = compiled.querySelector<HTMLInputElement>('#asset-search');
    const statusFilter = compiled.querySelector<HTMLSelectElement>('[aria-label="Filter by status"]');
    const modelFilter = compiled.querySelector<HTMLSelectElement>('[aria-label="Filter by model"]');
    search!.value = 'Dell';
    search!.dispatchEvent(new Event('input'));
    await new Promise(resolve => setTimeout(resolve, 350));
    statusFilter!.value = 'In stock';
    statusFilter!.dispatchEvent(new Event('change'));
    modelFilter!.value = 'Dell UltraSharp 27';
    modelFilter!.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('tbody tr').length).toBe(1);
    expect(compiled.textContent).toContain('AH-0010');
    expect(compiled.textContent).not.toContain('AH-0008');
    expect(compiled.textContent).toContain('Showing 1 of 1');
  });
});

function asset(
  id: string,
  assetCode: string,
  serial: string,
  modelId: string,
  modelName: string,
  status: number,
  currentHolderName: string | null,
  location: string
): AssetInstanceListItem {
  return {
    id,
    assetCode,
    serial,
    modelId,
    modelName,
    status,
    currentHolderId: currentHolderName ? `user-${currentHolderName}` : null,
    currentHolderName,
    location,
    qrCodePath: `/qr/${assetCode}.png`,
  };
}

function model(
  id: string,
  name: string,
  category: number,
  manufacturer: string,
  modelNumber: string,
  defaultUsefulLifeMonths: number,
  instanceCount: number
): AssetModelListItem {
  return { id, name, category, manufacturer, modelNumber, defaultUsefulLifeMonths, instanceCount };
}

function page<T>(items: readonly T[]): PagedResult<T> {
  return { items, total: items.length, page: 1, pageSize: 20, totalPages: 1 };
}

function pageForAssets(query: AssetQuery): PagedResult<AssetInstanceListItem> {
  const search = query.search?.toLowerCase().trim() ?? '';
  const items = ASSETS.filter(item => {
    const matchesStatus = query.status === undefined || item.status === query.status;
    const matchesModel = query.modelId === undefined || item.modelId === query.modelId;
    const searchable = [item.assetCode, item.serial, item.modelName].join(' ').toLowerCase();
    return matchesStatus && matchesModel && (!search || searchable.includes(search));
  });
  return {
    items,
    total: items.length,
    page: query.page,
    pageSize: query.pageSize,
    totalPages: Math.max(1, Math.ceil(items.length / query.pageSize)),
  };
}

function assetDetail(id: string): AssetInstanceDto {
  const item = ASSETS.find(assetItem => assetItem.id === id) ?? ASSETS[0];
  return {
    ...item,
    acquisitionCost: 42000000,
    acquisitionDate: '2026-01-10T00:00:00Z',
    salvageValue: 4000000,
    warrantyExpiresAt: '2027-01-10T00:00:00Z',
    notes: item.assetCode === 'AH-0001' ? 'Standard issue dev laptop.' : null,
    version: 1,
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
  };
}

function modelDetail(id: string): AssetModelDto {
  const item = MODELS.find(modelItem => modelItem.id === id) ?? MODELS[0];
  return {
    ...item,
    specs: `${item.name} standard configuration`,
    defaultDepreciationMethod: 0,
    imageUrl: null,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };
}
