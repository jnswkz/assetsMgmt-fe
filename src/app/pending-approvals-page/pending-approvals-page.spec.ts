import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth.service';
import { PendingApprovalsPage } from './pending-approvals-page';

describe('PendingApprovalsPage', () => {
  let fixture: ComponentFixture<PendingApprovalsPage>;
  let auth: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingApprovalsPage],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
    auth.selectMockUser('alice');
    fixture = TestBed.createComponent(PendingApprovalsPage);
    await fixture.whenStable();
  });

  it('should render the Figma approvals table for AdminIT and Manager roles', () => {
    for (const username of ['alice', 'ben']) {
      auth.selectMockUser(username);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Pending approvals');
      expect(compiled.textContent).toContain('Requests waiting on your decision.');
      expect(compiled.textContent).toContain('4 awaiting');
      expect(compiled.textContent).toContain('Chloe Davis');
      expect(compiled.textContent).toContain('AH-0002');
      expect(compiled.textContent).toContain('MacBook Pro 14"');
      expect(compiled.textContent).toContain('Ivy Tanaka');
      expect(compiled.textContent).toContain('AH-0006');
      expect(compiled.textContent).toContain('Dell UltraSharp 27');
      expect(compiled.textContent).toContain('iPad Air');
      expect(compiled.querySelectorAll('tbody tr').length).toBe(4);
    }
  });

  it('should filter approvals from the top search', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const search = compiled.querySelector<HTMLInputElement>('#approvals-global-search');
    search!.value = 'Ivy';
    search!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('tbody tr').length).toBe(1);
    expect(compiled.textContent).toContain('Ivy Tanaka');
    expect(compiled.textContent).toContain('AH-0006');
  });

  it('should remove approved and rejected requests from the awaiting list', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('[aria-label="Approve request for AH-0002"]')?.click();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Approved AH-0002');
    expect(compiled.textContent).toContain('3 awaiting');
    expect(compiled.querySelector('[aria-label="Approve request for AH-0002"]')).toBeNull();

    compiled.querySelector<HTMLButtonElement>('[aria-label="Reject request for AH-0006"]')?.click();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Rejected AH-0006');
    expect(compiled.textContent).toContain('2 awaiting');
    expect(compiled.querySelectorAll('tbody tr').length).toBe(2);
  });

  it('should block direct employee access', () => {
    auth.selectMockUser('chloe');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Only managers and AdminIT users can review pending approvals.');
    expect(compiled.querySelector('table')).toBeNull();
  });
});
