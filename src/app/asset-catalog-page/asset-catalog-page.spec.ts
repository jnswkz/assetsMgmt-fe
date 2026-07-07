import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AssetCatalogPage } from './asset-catalog-page';
import { AuthService } from '../services/auth.service';
import { AssetsService, ModelQuery } from '../services/assets.service';
import { AssetModelDto, AssetModelListItem, PagedResult } from '../models/api.model';

const CATALOG_ITEMS: readonly AssetModelListItem[] = [
  {
    id: 'model-1',
    name: 'MacBook Pro 14"',
    category: 0,
    manufacturer: 'Apple',
    modelNumber: 'MBP14-M3',
    defaultUsefulLifeMonths: 48,
    instanceCount: 6,
  },
  {
    id: 'model-2',
    name: 'ThinkPad X1 Carbon',
    category: 0,
    manufacturer: 'Lenovo',
    modelNumber: 'X1C-G11',
    defaultUsefulLifeMonths: 36,
    instanceCount: 4,
  },
  {
    id: 'model-3',
    name: 'iPad Air',
    category: 3,
    manufacturer: 'Apple',
    modelNumber: 'iPad-Air-M2',
    defaultUsefulLifeMonths: 36,
    instanceCount: 2,
  },
  {
    id: 'model-4',
    name: 'Cisco Catalyst 9200',
    category: 6,
    manufacturer: 'Cisco',
    modelNumber: 'C9200-24P',
    defaultUsefulLifeMonths: 84,
    instanceCount: 2,
  },
];

const MODEL_DETAIL: AssetModelDto = {
  id: 'model-1',
  name: 'MacBook Pro 14"',
  category: 0,
  manufacturer: 'Apple',
  modelNumber: 'MBP14-M3',
  specs: 'M3 Pro, 18GB RAM, 512GB SSD',
  defaultUsefulLifeMonths: 48,
  defaultDepreciationMethod: 0,
  imageUrl: null,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

describe('AssetCatalogPage', () => {
  let fixture: ComponentFixture<AssetCatalogPage>;
  let auth: AuthService;
  let assetsApi: {
    modelsPaged: ReturnType<typeof vi.fn>;
    model: ReturnType<typeof vi.fn>;
    createModel: ReturnType<typeof vi.fn>;
    updateModel: ReturnType<typeof vi.fn>;
    deleteModel: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    assetsApi = {
      modelsPaged: vi.fn((query: ModelQuery) => of(pageFor(query))),
      model: vi.fn(() => of(MODEL_DETAIL)),
      createModel: vi.fn(() => of(MODEL_DETAIL)),
      updateModel: vi.fn(() => of(MODEL_DETAIL)),
      deleteModel: vi.fn(() => of(void 0)),
    };

    await TestBed.configureTestingModule({
      imports: [AssetCatalogPage],
      providers: [{ provide: AssetsService, useValue: assetsApi }],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(AssetCatalogPage);
    await fixture.whenStable();
  });

  it('should show catalog management actions for AdminIT', () => {
    auth.selectMockUser('alice');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('New model');
    expect(compiled.querySelector('[aria-label^="Edit MacBook Pro 14"]')).toBeTruthy();
    expect(compiled.querySelector('[aria-label^="Delete MacBook Pro 14"]')).toBeTruthy();
  });

  it('should render a read-only catalog for Employee', () => {
    auth.selectMockUser('chloe');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('MacBook Pro 14"');
    expect(compiled.textContent).not.toContain('New model');
    expect(compiled.querySelector('[aria-label^="Edit MacBook Pro 14"]')).toBeNull();
    expect(compiled.querySelector('[aria-label^="Delete MacBook Pro 14"]')).toBeNull();
  });

  it('should filter model rows with the API model search', async () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const search = compiled.querySelector<HTMLInputElement>('#model-search');
    search!.value = 'Cisco';
    search!.dispatchEvent(new Event('input'));
    await new Promise(resolve => setTimeout(resolve, 350));
    fixture.detectChanges();

    expect(assetsApi.modelsPaged).toHaveBeenLastCalledWith({
      category: undefined,
      search: 'Cisco',
      page: 1,
      pageSize: 20,
    });
    expect(compiled.querySelectorAll('tbody tr').length).toBe(1);
    expect(compiled.textContent).toContain('Cisco Catalyst 9200');
    expect(compiled.textContent).not.toContain('MacBook Pro 14"');
    expect(compiled.textContent).toContain('Showing 1 of 1');
  });

  it('should combine top search with the category filter', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const globalSearch = compiled.querySelector<HTMLInputElement>('#catalog-global-search');
    const categoryFilter = compiled.querySelector<HTMLSelectElement>(
      '[aria-label="Filter by category"]'
    );
    globalSearch!.value = 'Apple';
    globalSearch!.dispatchEvent(new Event('input'));
    categoryFilter!.value = 'Tablet';
    categoryFilter!.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(assetsApi.modelsPaged).toHaveBeenLastCalledWith({
      category: 3,
      search: undefined,
      page: 1,
      pageSize: 20,
    });
    expect(compiled.querySelectorAll('tbody tr').length).toBe(1);
    expect(compiled.textContent).toContain('iPad Air');
    expect(compiled.textContent).not.toContain('MacBook Pro 14"');
    expect(compiled.textContent).toContain('Showing 1 of 1');
  });

  it('should create an asset model from the AdminIT dialog', () => {
    auth.selectMockUser('alice');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('.primary-action')?.click();
    fixture.detectChanges();

    const inputs = compiled.querySelectorAll<HTMLInputElement>('.model-form input');
    const selects = compiled.querySelectorAll<HTMLSelectElement>('.model-form select');
    inputs[0].value = 'Surface Laptop 7';
    inputs[0].dispatchEvent(new Event('input'));
    selects[0].value = '0';
    selects[0].dispatchEvent(new Event('change'));
    inputs[1].value = 'Microsoft';
    inputs[1].dispatchEvent(new Event('input'));
    inputs[2].value = 'SL7-15';
    inputs[2].dispatchEvent(new Event('input'));
    inputs[3].value = '36';
    inputs[3].dispatchEvent(new Event('input'));
    selects[1].value = '0';
    selects[1].dispatchEvent(new Event('change'));
    inputs[4].value = 'platform';
    inputs[4].dispatchEvent(new Event('input'));
    inputs[5].value = 'Copilot+ PC';
    inputs[5].dispatchEvent(new Event('input'));
    fixture.detectChanges();

    submitModelForm(compiled);
    fixture.detectChanges();

    expect(assetsApi.createModel).toHaveBeenCalledWith({
      name: 'Surface Laptop 7',
      category: 0,
      manufacturer: 'Microsoft',
      modelNumber: 'SL7-15',
      specs: '{"platform":"Copilot+ PC"}',
      defaultUsefulLifeMonths: 36,
      defaultDepreciationMethod: 0,
      imageUrl: null,
    });
    expect(compiled.querySelector('.model-dialog')).toBeNull();
    expect(compiled.textContent).toContain('Model created');
  });

  it('should update an asset model from the AdminIT dialog', () => {
    auth.selectMockUser('alice');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('[aria-label^="Edit MacBook Pro 14"]')?.click();
    fixture.detectChanges();

    const name = compiled.querySelector<HTMLInputElement>('.model-form input');
    name!.value = 'MacBook Pro 14" M3';
    name!.dispatchEvent(new Event('input'));
    submitModelForm(compiled);
    fixture.detectChanges();

    expect(assetsApi.model).toHaveBeenCalledWith('model-1');
    expect(assetsApi.updateModel).toHaveBeenCalledWith(
      'model-1',
      expect.objectContaining({ name: 'MacBook Pro 14" M3' })
    );
    expect(compiled.querySelector('.model-dialog')).toBeNull();
    expect(compiled.textContent).toContain('Model updated');
  });

  it('should delete an asset model after confirmation', () => {
    auth.selectMockUser('alice');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('[aria-label^="Delete MacBook Pro 14"]')?.click();
    fixture.detectChanges();

    compiled.querySelector<HTMLButtonElement>('.danger-action')?.click();
    fixture.detectChanges();

    expect(assetsApi.deleteModel).toHaveBeenCalledWith('model-1');
    expect(compiled.querySelector('.model-dialog--confirm')).toBeNull();
    expect(compiled.textContent).toContain('Model deleted');
  });
});

function pageFor(query: ModelQuery): PagedResult<AssetModelListItem> {
  const search = query.search?.toLowerCase().trim() ?? '';
  const items = CATALOG_ITEMS.filter(item => {
    const matchesCategory = query.category === undefined || item.category === query.category;
    const searchable = [item.name, item.manufacturer, item.modelNumber].join(' ').toLowerCase();
    return matchesCategory && (!search || searchable.includes(search));
  });

  return {
    items,
    total: items.length,
    page: query.page,
    pageSize: query.pageSize,
    totalPages: Math.max(1, Math.ceil(items.length / query.pageSize)),
  };
}

function submitModelForm(compiled: HTMLElement): void {
  compiled
    .querySelector<HTMLFormElement>('.model-form')
    ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}
