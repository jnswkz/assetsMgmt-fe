import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { DisposalsService } from '../services/disposals.service';
import { DisposalDto, PagedResult } from '../models/api.model';
import { DisposalsPage } from './disposals-page';

const DISPOSALS: readonly DisposalDto[] = [
  disposal('disposal-20', 'AH-0020', 0, 'Hugo Schmidt', 380, 'Sold after device refresh cycle.'),
  disposal('disposal-13', 'AH-0013', 1, null, null, 'Scrapped after failed repair.'),
  disposal('disposal-12', 'AH-0012', 2, null, null, 'Donated to local non-profit.'),
  disposal('disposal-03', 'AH-0003', 3, null, null, 'Lost in transit; insurance claim filed.'),
];

describe('DisposalsPage', () => {
  let fixture: ComponentFixture<DisposalsPage>;
  let auth: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisposalsPage],
      providers: [
        {
          provide: DisposalsService,
          useValue: {
            list: vi.fn((query: { type?: number }) =>
              of(page(DISPOSALS.filter(item => query.type === undefined || item.disposalType === query.type)))
            ),
          },
        },
      ],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
  });

  async function createPage(username = 'alice'): Promise<HTMLElement> {
    auth.selectMockUser(username);
    fixture = TestBed.createComponent(DisposalsPage);
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('should render the Figma disposals table for AdminIT and Manager roles', async () => {
    for (const username of ['alice', 'ben']) {
      const compiled = await createPage(username);
      expect(compiled.textContent).toContain('Disposals');
      expect(compiled.textContent).toContain('Assets that have left active inventory.');
      expect(compiled.textContent).toContain('AH-0020');
      expect(compiled.textContent).toContain('Sold');
      expect(compiled.textContent).toContain('Hugo Schmidt');
      expect(compiled.textContent).toContain('$380');
      expect(compiled.textContent).toContain('Scrapped after failed repair.');
      expect(compiled.textContent).toContain('Donated to local non-profit.');
      expect(compiled.textContent).toContain('Lost in transit; insurance claim filed.');
      expect(compiled.querySelectorAll('tbody tr').length).toBe(4);
      fixture.destroy();
    }
  });

  it('should filter disposals from the top search', async () => {
    const compiled = await createPage();
    const search = compiled.querySelector<HTMLInputElement>('#disposals-global-search');
    search!.value = 'insurance';
    search!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('tbody tr').length).toBe(1);
    expect(compiled.textContent).toContain('AH-0003');
    expect(compiled.textContent).toContain('Lost');
  });

  it('should filter disposals by type', async () => {
    const compiled = await createPage();
    const typeSelect = compiled.querySelector<HTMLSelectElement>('select');
    typeSelect!.value = 'Donated';
    typeSelect!.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('tbody tr').length).toBe(1);
    expect(compiled.textContent).toContain('AH-0012');
    expect(compiled.textContent).toContain('Donated');
    expect(compiled.textContent).not.toContain('AH-0020');
  });

  it('should block direct employee access', async () => {
    const compiled = await createPage('chloe');

    expect(compiled.textContent).toContain('Only managers and AdminIT users can view disposals.');
    expect(compiled.querySelector('table')).toBeNull();
  });
});

function page<T>(items: readonly T[]): PagedResult<T> {
  return { items, total: items.length, page: 1, pageSize: 200, totalPages: 1 };
}

function disposal(
  id: string,
  assetCode: string,
  disposalType: number,
  soldToUserName: string | null,
  salePrice: number | null,
  reason: string
): DisposalDto {
  return {
    id,
    assetInstanceId: `asset-${assetCode}`,
    assetCode,
    disposalType,
    soldToUserId: soldToUserName ? `user-${soldToUserName}` : null,
    soldToUserName,
    salePrice,
    reason,
    disposedAt: '2026-06-30T00:00:00Z',
    createdAt: '2026-06-30T00:00:00Z',
  };
}
