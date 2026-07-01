import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth.service';
import { MyRequestsPage } from './my-requests-page';

describe('MyRequestsPage', () => {
  let fixture: ComponentFixture<MyRequestsPage>;
  let auth: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyRequestsPage],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(MyRequestsPage);
    await fixture.whenStable();
  });

  it('should render the Figma request table for all mock roles', () => {
    for (const username of ['alice', 'ben', 'chloe']) {
      auth.selectMockUser(username);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('My requests');
      expect(compiled.textContent).toContain("Requests you've submitted across all assets.");
      expect(compiled.textContent).toContain('AH-0002');
      expect(compiled.textContent).toContain('AH-0017');
      expect(compiled.textContent).toContain('AH-0007');
      expect(compiled.textContent).toContain('AH-0015');
      expect(compiled.querySelectorAll('tbody tr').length).toBe(4);
    }
  });

  it('should filter requests from the top search', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const search = compiled.querySelector<HTMLInputElement>('#requests-global-search');
    search!.value = 'Logitech';
    search!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('tbody tr').length).toBe(1);
    expect(compiled.textContent).toContain('AH-0017');
    expect(compiled.textContent).not.toContain('AH-0002');
  });

  it('should open the request details drawer from an asset row and close it', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
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

  it('should update the profile area for the current mock user', () => {
    auth.selectMockUser('ben');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Ben Carter');
    expect(compiled.textContent).toContain('Operations');
  });
});
