import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth.service';
import { AllocationHistoryPage } from './allocation-history-page';

describe('AllocationHistoryPage', () => {
  let fixture: ComponentFixture<AllocationHistoryPage>;
  let auth: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllocationHistoryPage],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
    auth.selectMockUser('alice');
    fixture = TestBed.createComponent(AllocationHistoryPage);
    await fixture.whenStable();
  });

  it('should render the Figma allocation timeline for AdminIT and Manager roles', () => {
    for (const username of ['alice', 'ben']) {
      auth.selectMockUser(username);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Allocation history');
      expect(compiled.textContent).toContain('A global timeline of every allocation event.');
      expect(compiled.textContent).toContain('AH-0001');
      expect(compiled.textContent).toContain('MacBook Pro 14"');
      expect(compiled.textContent).toContain('Chloe Davis');
      expect(compiled.textContent).toContain('Transferred from u4.');
      expect(compiled.textContent).toContain('Returned for keyboard repair.');
      expect(compiled.querySelectorAll('tbody tr').length).toBe(10);
    }
  });

  it('should filter allocation history from the top search', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const search = compiled.querySelector<HTMLInputElement>('#history-global-search');
    search!.value = 'keyboard';
    search!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('tbody tr').length).toBe(1);
    expect(compiled.textContent).toContain('AH-0003');
    expect(compiled.textContent).toContain('Ivy Tanaka');
  });

  it('should filter allocation history by asset and user', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
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

  it('should block direct employee access', () => {
    auth.selectMockUser('chloe');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Only managers and AdminIT users can view allocation history.');
    expect(compiled.querySelector('table')).toBeNull();
  });
});
