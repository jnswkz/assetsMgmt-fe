import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AllocationsService } from '../services/allocations.service';
import { MyAssetItem } from '../models/api.model';
import { MyAssetsPage } from './my-assets-page';

const ASSIGNED_ASSETS: readonly MyAssetItem[] = [
  assignedAsset('asset-1', 'AH-0001', 'MacBook Pro 14"', 1, 'HQ / 4F / Desk 412', '2026-01-10T00:00:00Z'),
  assignedAsset('asset-8', 'AH-0008', 'Dell UltraSharp 27', 1, 'HQ / 4F / Desk 412', '2026-02-14T00:00:00Z'),
  assignedAsset('asset-16', 'AH-0016', 'Logitech MX Master 3S', 1, 'HQ / 4F', '2026-03-02T00:00:00Z'),
];

describe('MyAssetsPage', () => {
  let fixture: ComponentFixture<MyAssetsPage>;
  let auth: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAssetsPage],
      providers: [
        {
          provide: AllocationsService,
          useValue: { mineAssets: vi.fn(() => of(ASSIGNED_ASSETS)) },
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
});

function assignedAsset(
  assetInstanceId: string,
  assetCode: string,
  modelName: string,
  status: number,
  location: string,
  startDate: string
): MyAssetItem {
  return { assetInstanceId, assetCode, modelName, status, location, startDate };
}
