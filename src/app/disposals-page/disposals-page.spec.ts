import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth.service';
import { DisposalsPage } from './disposals-page';

describe('DisposalsPage', () => {
  let fixture: ComponentFixture<DisposalsPage>;
  let auth: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisposalsPage],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
    auth.selectMockUser('alice');
    fixture = TestBed.createComponent(DisposalsPage);
    await fixture.whenStable();
  });

  it('should render the Figma disposals table for AdminIT and Manager roles', () => {
    for (const username of ['alice', 'ben']) {
      auth.selectMockUser(username);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Disposals');
      expect(compiled.textContent).toContain('Assets that have left active inventory.');
      expect(compiled.textContent).toContain('AH-0020');
      expect(compiled.textContent).toContain('Sold');
      expect(compiled.textContent).toContain('Hugo Schmidt');
      expect(compiled.textContent).toContain('$380');
      expect(compiled.textContent).toContain('Lost in transit; insurance claim filed.');
      expect(compiled.textContent).toContain('Donated to local non-profit.');
      expect(compiled.textContent).toContain('Beyond economical repair.');
      expect(compiled.querySelectorAll('tbody tr').length).toBe(4);
    }
  });

  it('should filter disposals from the top search', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const search = compiled.querySelector<HTMLInputElement>('#disposals-global-search');
    search!.value = 'insurance';
    search!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('tbody tr').length).toBe(1);
    expect(compiled.textContent).toContain('AH-0013');
    expect(compiled.textContent).toContain('Lost');
  });

  it('should filter disposals by type', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const typeSelect = compiled.querySelector<HTMLSelectElement>('select');
    typeSelect!.value = 'Donated';
    typeSelect!.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('tbody tr').length).toBe(1);
    expect(compiled.textContent).toContain('AH-0012');
    expect(compiled.textContent).toContain('Donated');
    expect(compiled.textContent).not.toContain('AH-0020');
  });

  it('should block direct employee access', () => {
    auth.selectMockUser('chloe');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Only managers and AdminIT users can view disposals.');
    expect(compiled.querySelector('table')).toBeNull();
  });
});
