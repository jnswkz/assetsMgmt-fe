import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth.service';
import { DepartmentsPage } from './departments-page';

describe('DepartmentsPage', () => {
  let fixture: ComponentFixture<DepartmentsPage>;
  let auth: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentsPage],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
    auth.selectMockUser('alice');
    fixture = TestBed.createComponent(DepartmentsPage);
    await fixture.whenStable();
  });

  it('should render a read-only department table for managers', () => {
    auth.selectMockUser('ben');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Departments');
    expect(compiled.textContent).toContain('Organizational units and their managers.');
    expect(compiled.textContent).toContain('ENG');
    expect(compiled.textContent).toContain('Engineering');
    expect(compiled.textContent).toContain('Ben Carter');
    expect(compiled.textContent).toContain('Human Resources');
    expect(compiled.querySelectorAll('tbody tr').length).toBe(8);
    expect(compiled.querySelector('.new-department-button')).toBeNull();
    expect(compiled.querySelector('[aria-label="Department actions for Engineering"]')).toBeNull();
    expect(compiled.querySelector<HTMLButtonElement>('[aria-label="Disable Engineering"]')?.disabled).toBe(true);
  });

  it('should filter departments from the top search', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const search = compiled.querySelector<HTMLInputElement>('#departments-global-search');
    search!.value = 'Finance';
    search!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('tbody tr').length).toBe(1);
    expect(compiled.textContent).toContain('FIN');
    expect(compiled.textContent).toContain('Jonas Berg');
  });

  it('should let AdminIT disable and enable departments', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const engineeringSwitch = compiled.querySelector<HTMLButtonElement>('[aria-label="Disable Engineering"]');
    expect(engineeringSwitch?.disabled).toBe(false);
    expect(engineeringSwitch?.getAttribute('aria-pressed')).toBe('true');

    engineeringSwitch?.click();
    fixture.detectChanges();

    const disabledSwitch = compiled.querySelector<HTMLButtonElement>('[aria-label="Enable Engineering"]');
    expect(disabledSwitch?.getAttribute('aria-pressed')).toBe('false');
    expect(compiled.textContent).toContain('Engineering disabled');

    disabledSwitch?.click();
    fixture.detectChanges();

    expect(compiled.querySelector<HTMLButtonElement>('[aria-label="Disable Engineering"]')?.getAttribute('aria-pressed')).toBe('true');
    expect(compiled.textContent).toContain('Engineering enabled');
  });

  it('should let AdminIT add a new department', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('.new-department-button')?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.department-dialog')).toBeTruthy();

    const inputs = compiled.querySelectorAll<HTMLInputElement>('.department-form input');
    inputs[0].value = 'qa';
    inputs[0].dispatchEvent(new Event('input'));
    inputs[1].value = 'Quality Assurance';
    inputs[1].dispatchEvent(new Event('input'));
    inputs[2].value = 'Mina Park';
    inputs[2].dispatchEvent(new Event('input'));
    inputs[3].value = '3';
    inputs[3].dispatchEvent(new Event('input'));
    fixture.detectChanges();

    compiled.querySelector<HTMLButtonElement>('.department-form .primary-action')?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.department-dialog')).toBeNull();
    expect(compiled.textContent).toContain('QA');
    expect(compiled.textContent).toContain('Quality Assurance');
    expect(compiled.textContent).toContain('Mina Park');
    expect(compiled.textContent).toContain('Quality Assurance added');
    expect(compiled.querySelectorAll('tbody tr').length).toBe(9);
  });

  it('should block direct employee access', () => {
    auth.selectMockUser('chloe');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Only managers and AdminIT users can view departments.');
    expect(compiled.querySelector('table')).toBeNull();
  });
});
