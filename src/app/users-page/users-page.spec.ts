import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth.service';
import { UsersPage } from './users-page';

describe('UsersPage', () => {
  let fixture: ComponentFixture<UsersPage>;
  let auth: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersPage],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
    auth.selectMockUser('alice');
    fixture = TestBed.createComponent(UsersPage);
    await fixture.whenStable();
  });

  it('should render the AdminIT users table from the Figma design', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Users');
    expect(compiled.textContent).toContain('Manage employees, managers, and IT administrators.');
    expect(compiled.textContent).toContain('alice');
    expect(compiled.textContent).toContain('Alice Morgan');
    expect(compiled.textContent).toContain('hugo');
    expect(compiled.textContent).toContain('Inactive');
    expect(compiled.querySelectorAll('tbody tr').length).toBe(10);
    expect(compiled.querySelector('.new-user-button')).toBeTruthy();
  });

  it('should filter users by search, role, department, and status', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const search = compiled.querySelector<HTMLInputElement>('#users-search');
    const selects = compiled.querySelectorAll<HTMLSelectElement>('.users-toolbar select');

    search!.value = 'engineering';
    search!.dispatchEvent(new Event('input'));
    selects[0].value = 'Employee';
    selects[0].dispatchEvent(new Event('change'));
    selects[1].value = 'Engineering';
    selects[1].dispatchEvent(new Event('change'));
    selects[2].value = 'Active';
    selects[2].dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('tbody tr').length).toBe(2);
    expect(compiled.textContent).toContain('chloe');
    expect(compiled.textContent).toContain('ivy');
    expect(compiled.textContent).not.toContain('ben@acme.co');
  });

  it('should let AdminIT activate and deactivate users from the row actions', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('[aria-label="User actions for Hugo Schmidt"]')?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.action-menu')?.textContent).toContain('Activate');

    compiled.querySelector<HTMLButtonElement>('.action-menu button')?.click();
    fixture.detectChanges();

    const hugoRow = Array.from(compiled.querySelectorAll('tbody tr')).find(row => row.textContent?.includes('hugo'));
    expect(compiled.textContent).toContain('Hugo Schmidt active');
    expect(hugoRow?.textContent).toContain('Active');
    expect(hugoRow?.textContent).not.toContain('Inactive');
  });

  it('should let AdminIT add a new mock user', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('.new-user-button')?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.user-dialog')).toBeTruthy();

    const inputs = compiled.querySelectorAll<HTMLInputElement>('.user-form input');
    const role = compiled.querySelector<HTMLSelectElement>('.user-form select');
    inputs[0].value = 'mina';
    inputs[0].dispatchEvent(new Event('input'));
    inputs[1].value = 'Mina Park';
    inputs[1].dispatchEvent(new Event('input'));
    inputs[2].value = 'mina@acme.co';
    inputs[2].dispatchEvent(new Event('input'));
    inputs[3].value = 'e-1011';
    inputs[3].dispatchEvent(new Event('input'));
    role!.value = 'Manager';
    role!.dispatchEvent(new Event('change'));
    inputs[4].value = 'Quality Assurance';
    inputs[4].dispatchEvent(new Event('input'));
    fixture.detectChanges();

    compiled.querySelector<HTMLButtonElement>('.user-form .primary-action')?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.user-dialog')).toBeNull();
    expect(compiled.textContent).toContain('mina');
    expect(compiled.textContent).toContain('Mina Park');
    expect(compiled.textContent).toContain('Quality Assurance');
    expect(compiled.textContent).toContain('Mina Park added');
    expect(compiled.querySelectorAll('tbody tr').length).toBe(11);
  });

  it('should block direct access for non-AdminIT users', () => {
    auth.selectMockUser('ben');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Only AdminIT users can manage users.');
    expect(compiled.querySelector('table')).toBeNull();
  });
});
