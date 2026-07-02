import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AllocationHistoryPage } from './allocation-history-page';
import { AuthService } from '../services/auth.service';
import { AllocationsService } from '../services/allocations.service';
import { AllocationHistoryItem, PagedResult } from '../models/api.model';

const RECORDS: readonly AllocationHistoryItem[] = [
  historyItem('history-1', 'AH-0001', 'MacBook Pro 14"', 'Chloe Davis', 0, '2026-01-10T00:00:00Z', null, 'Allocated to engineering hire.'),
  historyItem('history-2', 'AH-0002', 'MacBook Pro 14"', 'Diego Ramirez', 1, '2026-02-14T00:00:00Z', null, 'Transferred from u4.'),
  historyItem('history-3', 'AH-0003', 'MacBook Pro 14"', 'Ivy Tanaka', 2, '2026-03-01T00:00:00Z', '2026-03-18T00:00:00Z', 'Returned for keyboard repair.'),
  historyItem('history-4', 'AH-0004', 'MacBook Pro 14"', 'Diego Ramirez', 0, '2026-03-20T00:00:00Z', null, 'Allocated after repair.'),
  historyItem('history-5', 'AH-0005', 'ThinkPad X1 Carbon', 'Felix Wong', 0, '2026-04-01T00:00:00Z', null, 'Issued to sales lead.'),
  historyItem('history-6', 'AH-0011', 'iPhone 15 Pro', 'Felix Wong', 1, '2026-04-10T00:00:00Z', null, 'Transferred from mobile pool.'),
  historyItem('history-7', 'AH-0012', 'iPhone 15 Pro', 'Felix Wong', 2, '2026-04-18T00:00:00Z', '2026-04-30T00:00:00Z', 'Returned after pilot campaign.'),
  historyItem('history-8', 'AH-0014', 'iPad Air', 'Gina Patel', 1, '2026-05-02T00:00:00Z', null, 'Transferred to marketing.'),
  historyItem('history-9', 'AH-0016', 'Logitech MX Master 3S', 'Chloe Davis', 0, '2026-05-12T00:00:00Z', null, 'Accessory refresh.'),
  historyItem('history-10', 'AH-0019', 'Cisco Catalyst 9200', 'Jonas Berg', 0, '2026-06-01T00:00:00Z', null, 'Network expansion project.'),
];

describe('AllocationHistoryPage', () => {
  let fixture: ComponentFixture<AllocationHistoryPage>;
  let auth: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllocationHistoryPage],
      providers: [
        {
          provide: AllocationsService,
          useValue: {
            history: vi.fn(() => of(page(RECORDS))),
          },
        },
      ],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
  });

  async function createPage(username = 'alice'): Promise<HTMLElement> {
    auth.selectMockUser(username);
    fixture = TestBed.createComponent(AllocationHistoryPage);
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('should render the Figma allocation timeline for AdminIT and Manager roles', async () => {
    for (const username of ['alice', 'ben']) {
      const compiled = await createPage(username);
      expect(compiled.textContent).toContain('Allocation history');
      expect(compiled.textContent).toContain('A global timeline of every allocation event.');
      expect(compiled.textContent).toContain('AH-0001');
      expect(compiled.textContent).toContain('MacBook Pro 14"');
      expect(compiled.textContent).toContain('Chloe Davis');
      expect(compiled.textContent).toContain('Transferred from u4.');
      expect(compiled.textContent).toContain('Returned for keyboard repair.');
      expect(compiled.querySelectorAll('tbody tr').length).toBe(10);
      fixture.destroy();
    }
  });

  it('should filter allocation history from the top search', async () => {
    const compiled = await createPage();
    const search = compiled.querySelector<HTMLInputElement>('#history-global-search');
    search!.value = 'keyboard';
    search!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('tbody tr').length).toBe(1);
    expect(compiled.textContent).toContain('AH-0003');
    expect(compiled.textContent).toContain('Ivy Tanaka');
  });

  it('should filter allocation history by asset and user', async () => {
    const compiled = await createPage();
    const selects = compiled.querySelectorAll<HTMLSelectElement>('select');
    selects[0].value = 'AH-0014';
    selects[0].dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('tbody tr').length).toBe(1);
    expect(compiled.textContent).toContain('Gina Patel');
    expect(compiled.textContent).toContain('Transferred');

    selects[0].value = '';
    selects[0].dispatchEvent(new Event('change'));
    selects[1].value = 'Felix Wong';
    selects[1].dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('tbody tr').length).toBe(3);
    expect(compiled.textContent).toContain('AH-0005');
    expect(compiled.textContent).toContain('AH-0011');
    expect(compiled.textContent).toContain('AH-0012');
  });

  it('should block direct employee access', async () => {
    const compiled = await createPage('chloe');

    expect(compiled.textContent).toContain('Only managers and AdminIT users can view allocation history.');
    expect(compiled.querySelector('table')).toBeNull();
  });
});

function page<T>(items: readonly T[]): PagedResult<T> {
  return { items, total: items.length, page: 1, pageSize: 200, totalPages: 1 };
}

function historyItem(
  id: string,
  assetCode: string,
  modelName: string,
  userName: string,
  eventType: number,
  startDate: string,
  endDate: string | null,
  notes: string
): AllocationHistoryItem {
  return {
    id,
    assetInstanceId: `asset-${assetCode}`,
    assetCode,
    modelName,
    userId: `user-${userName}`,
    userName,
    eventType,
    startDate,
    endDate,
    allocationRequestId: null,
    notes,
    createdAt: startDate,
  };
}
