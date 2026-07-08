import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AllocationsService } from '../services/allocations.service';
import { MyAssetItem } from '../models/api.model';
import { MyAssetsPage } from './my-assets-page';

const ASSIGNED_ASSETS: readonly MyAssetItem[] = [
  assignedAsset('asset-1', 'AH-0001', 'MacBook Pro 14"', 1, 'HQ / 4F / Desk 412', '2026-01-10T00:00:00Z', 'BB-2026-0001'),
  assignedAsset('asset-8', 'AH-0008', 'Dell UltraSharp 27', 1, 'HQ / 4F / Desk 412', '2026-02-14T00:00:00Z', 'BB-2026-0002'),
  assignedAsset('asset-16', 'AH-0016', 'Logitech MX Master 3S', 1, 'HQ / 4F', '2026-03-02T00:00:00Z', null),
];

describe('MyAssetsPage', () => {
  let fixture: ComponentFixture<MyAssetsPage>;
  let auth: AuthService;
  let allocations: { mineAssets: ReturnType<typeof vi.fn>; downloadHandover: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    allocations = {
      mineAssets: vi.fn(() => of(ASSIGNED_ASSETS)),
      downloadHandover: vi.fn(() => of(new Blob(['handover'], { type: 'application/pdf' }))),
    };

    await TestBed.configureTestingModule({
      imports: [MyAssetsPage],
      providers: [
        {
          provide: AllocationsService,
          useValue: allocations,
        },
      ],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
  });

  async function createPage(username = 'chloe'): Promise<HTMLElement> {
    auth.selectMockUser(username);
    fixture = TestBed.createComponent(MyAssetsPage);
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('should show the assigned assets from the Figma screen', async () => {
    const compiled = await createPage();

    expect(compiled.textContent).toContain('My assets');
    expect(compiled.textContent).toContain('Hardware currently assigned to you.');
    expect(compiled.textContent).toContain('AH-0001');
    expect(compiled.textContent).toContain('MacBook Pro 14"');
    expect(compiled.textContent).toContain('AH-0008');
    expect(compiled.textContent).toContain('Dell UltraSharp 27');
    expect(compiled.textContent).toContain('AH-0016');
    expect(compiled.textContent).toContain('Logitech MX Master 3S');
    expect(compiled.querySelectorAll('.handover-button').length).toBe(3);
  });

  it('should keep the same assigned assets across all mock roles', async () => {
    for (const username of ['alice', 'ben', 'chloe']) {
      const compiled = await createPage(username);
      expect(compiled.querySelectorAll('.asset-card').length).toBe(3);
      expect(compiled.textContent).toContain('AH-0001');
      expect(compiled.textContent).toContain('AH-0008');
      expect(compiled.textContent).toContain('AH-0016');
      fixture.destroy();
    }
  });

  it('should update the profile area for the current mock user', async () => {
    const compiled = await createPage('alice');

    expect(compiled.textContent).toContain('Alice Morgan');
    expect(compiled.textContent).toContain('IT');
  });

  it('should filter assigned cards from the top search', async () => {
    const compiled = await createPage();
    const search = compiled.querySelector<HTMLInputElement>('#my-assets-global-search');
    search!.value = 'Dell';
    search!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('.asset-card').length).toBe(1);
    expect(compiled.textContent).toContain('AH-0008');
    expect(compiled.textContent).not.toContain('AH-0001');
  });

  it('should download an available handover document', async () => {
    const createObjectUrl = vi.fn(() => 'blob:handover');
    const revokeObjectUrl = vi.fn();
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createObjectUrl });
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revokeObjectUrl });
    const anchorClick = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);

    const compiled = await createPage();
    compiled.querySelector<HTMLButtonElement>('.handover-button')?.click();
    fixture.detectChanges();

    expect(allocations.downloadHandover).toHaveBeenCalledWith('asset-1');
    expect(createObjectUrl).toHaveBeenCalled();
    expect(anchorClick).toHaveBeenCalled();
    expect(revokeObjectUrl).toHaveBeenCalledWith('blob:handover');
    expect(compiled.textContent).toContain('Downloaded BB-2026-0001.');
  });

  it('should show the handover action even before document metadata is loaded', async () => {
    const compiled = await createPage();
    const buttons = compiled.querySelectorAll<HTMLButtonElement>('.handover-button');

    buttons[2]?.click();
    fixture.detectChanges();

    expect(buttons.length).toBe(3);
    expect(allocations.downloadHandover).toHaveBeenCalledWith('asset-16');
    expect(compiled.textContent).toContain('Downloaded handover-AH-0016.pdf.');
  });
});

function assignedAsset(
  assetInstanceId: string,
  assetCode: string,
  modelName: string,
  status: number,
  location: string,
  startDate: string,
  handoverDocumentNumber: string | null
): MyAssetItem {
  return {
    assetInstanceId,
    assetCode,
    modelName,
    status,
    location,
    startDate,
    handoverDocumentNumber,
    hasHandover: handoverDocumentNumber !== null,
  };
}
