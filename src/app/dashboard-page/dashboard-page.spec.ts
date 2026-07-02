import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardPage } from './dashboard-page';
import { AuthService } from '../services/auth.service';

describe('DashboardPage', () => {
  let fixture: ComponentFixture<DashboardPage>;
  let auth: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [provideRouter([])],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(DashboardPage);
    await fixture.whenStable();
  });

  it('should render the employee dashboard by default', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Welcome, Chloe');
    expect(compiled.textContent).toContain('Assigned to Me');
    expect(compiled.textContent).toContain('My recent requests');
  });

  it('should render the approval dashboard for AdminIT', () => {
    auth.selectMockUser('alice');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Welcome, Alice');
    expect(compiled.textContent).toContain('Pending Requests');
    expect(compiled.textContent).toContain('Requests awaiting approval');
  });

  it('should filter requests and activity from the top search', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const search = compiled.querySelector<HTMLInputElement>('#dashboard-search');
    search!.value = 'Logitech';
    search!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('.request-row').length).toBe(1);
    expect(compiled.querySelectorAll('.activity-list article').length).toBe(1);
    expect(compiled.textContent).toContain('AH-0017');
    expect(compiled.textContent).not.toContain('AH-0007');
  });

  it('should toggle the document theme from the topbar button', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector<HTMLButtonElement>('[data-theme-toggle]');
    const initialTheme = document.documentElement.getAttribute('data-theme');

    toggle?.click();
    fixture.detectChanges();

    const nextTheme = document.documentElement.getAttribute('data-theme');
    expect(toggle).toBeTruthy();
    expect(nextTheme).not.toBe(initialTheme);
    expect(nextTheme === 'dark' || nextTheme === 'light').toBe(true);
  });
});
