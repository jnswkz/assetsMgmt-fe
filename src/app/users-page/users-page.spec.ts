import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { DepartmentsService } from '../services/departments.service';
import { UsersService } from '../services/users.service';
import { DepartmentListItem, PagedResult, UserDto, UserListItem } from '../models/api.model';
import { UsersPage } from './users-page';

const DEPARTMENTS: readonly DepartmentListItem[] = [
  department('dept-it', 'IT', 'IT Asset Management'),
  department('dept-eng', 'ENG', 'Engineering'),
  department('dept-ops', 'OPS', 'Operations'),
  department('dept-fin', 'FIN', 'Finance'),
  department('dept-qa', 'QA', 'Quality Assurance'),
];

describe('UsersPage', () => {
  let fixture: ComponentFixture<UsersPage>;
  let auth: AuthService;
  let users: UserDto[];
  let usersApi: {
    list: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    users = [
      managedUser('user-alice', 'alice', 'Alice Morgan', 'IT-1001', 2, 'dept-it', 'IT Asset Management', true),
      managedUser('user-ben', 'ben', 'Ben Carter', 'M-1002', 1, 'dept-ops', 'Operations', true),
      managedUser('user-chloe', 'chloe', 'Chloe Davis', 'E-1003', 0, 'dept-eng', 'Engineering', true),
      managedUser('user-ivy', 'ivy', 'Ivy Tanaka', 'E-1004', 0, 'dept-eng', 'Engineering', true),
      managedUser('user-diego', 'diego', 'Diego Ramirez', 'E-1005', 0, 'dept-ops', 'Operations', true),
      managedUser('user-felix', 'felix', 'Felix Wong', 'E-1006', 0, 'dept-fin', 'Finance', true),
      managedUser('user-gina', 'gina', 'Gina Patel', 'E-1007', 0, 'dept-ops', 'Operations', true),
      managedUser('user-jonas', 'jonas', 'Jonas Berg', 'M-1008', 1, 'dept-fin', 'Finance', true),
      managedUser('user-nina', 'nina', 'Nina Chen', 'E-1009', 0, 'dept-it', 'IT Asset Management', true),
      managedUser('user-hugo', 'hugo', 'Hugo Schmidt', 'E-1010', 0, 'dept-qa', 'Quality Assurance', false),
    ];

    usersApi = {
      list: vi.fn(() => of(page(users))),
      update: vi.fn((id: string, body: { email: string | null; fullName: string | null; role: number; departmentId?: string | null; isActive: boolean }) => {
        const current = users.find(item => item.id === id) ?? users[0];
        const departmentInfo = DEPARTMENTS.find(item => item.id === (body.departmentId ?? null));
        const updated = {
          ...current,
          email: body.email,
          fullName: body.fullName,
          role: body.role,
          departmentId: body.departmentId ?? null,
          departmentName: departmentInfo?.name ?? current.departmentName,
          isActive: body.isActive,
          updatedAt: '2026-07-02T00:00:00Z',
        };
        users = users.map(item => (item.id === id ? updated : item));
        return of(updated);
      }),
      create: vi.fn((body: { userName: string | null; email: string | null; password: string | null; fullName: string | null; employeeCode: string | null; role: number; departmentId?: string | null }) => {
        const departmentInfo = DEPARTMENTS.find(item => item.id === (body.departmentId ?? null));
        const created = {
          id: `user-${body.userName}`,
          userName: body.userName,
          email: body.email,
          fullName: body.fullName,
          employeeCode: body.employeeCode,
          role: body.role,
          departmentId: body.departmentId ?? null,
          departmentName: departmentInfo?.name ?? null,
          isActive: true,
          lastLoginAt: null,
          createdAt: '2026-07-02T00:00:00Z',
          updatedAt: '2026-07-02T00:00:00Z',
        } satisfies UserDto;
        users = [...users, created];
        return of(created);
      }),
    };

    await TestBed.configureTestingModule({
      imports: [UsersPage],
      providers: [
        { provide: UsersService, useValue: usersApi },
        {
          provide: DepartmentsService,
          useValue: {
            list: vi.fn(() => of(page(DEPARTMENTS))),
          },
        },
      ],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
  });

  async function createPage(username = 'alice'): Promise<HTMLElement> {
    auth.selectMockUser(username);
    fixture = TestBed.createComponent(UsersPage);
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('should render the AdminIT users table from the Figma design', async () => {
    const compiled = await createPage();

    expect(compiled.textContent).toContain('Users');
    expect(compiled.textContent).toContain('Manage employees, managers, and IT administrators.');
    expect(compiled.textContent).toContain('alice');
    expect(compiled.textContent).toContain('Alice Morgan');
    expect(compiled.textContent).toContain('hugo');
    expect(compiled.textContent).toContain('Inactive');
    expect(compiled.querySelectorAll('tbody tr').length).toBe(10);
    expect(compiled.querySelector('.new-user-button')).toBeTruthy();
  });

  it('should filter users by search, role, department, and status', async () => {
    const compiled = await createPage();
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

  it('should let AdminIT activate and deactivate users from the row actions', async () => {
    const compiled = await createPage();
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

  it('should let AdminIT add a new mock user', async () => {
    const compiled = await createPage();
    compiled.querySelector<HTMLButtonElement>('.new-user-button')?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.user-dialog')).toBeTruthy();

    const inputs = compiled.querySelectorAll<HTMLInputElement>('.user-form input');
    const selects = compiled.querySelectorAll<HTMLSelectElement>('.user-form select');
    inputs[0].value = 'mina';
    inputs[0].dispatchEvent(new Event('input'));
    inputs[1].value = 'Mina Park';
    inputs[1].dispatchEvent(new Event('input'));
    inputs[2].value = 'mina@acme.co';
    inputs[2].dispatchEvent(new Event('input'));
    inputs[3].value = 'Password123';
    inputs[3].dispatchEvent(new Event('input'));
    inputs[4].value = 'e-1011';
    inputs[4].dispatchEvent(new Event('input'));
    selects[0].value = 'Manager';
    selects[0].dispatchEvent(new Event('change'));
    selects[1].value = 'dept-qa';
    selects[1].dispatchEvent(new Event('change'));
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

  it('should block direct access for non-AdminIT users', async () => {
    const compiled = await createPage('ben');

    expect(compiled.textContent).toContain('Only AdminIT users can manage users.');
    expect(compiled.querySelector('table')).toBeNull();
  });
});

function page<T>(items: readonly T[]): PagedResult<T> {
  return { items, total: items.length, page: 1, pageSize: 200, totalPages: 1 };
}

function department(id: string, code: string, name: string): DepartmentListItem {
  return {
    id,
    code,
    name,
    managerId: null,
    managerName: null,
    isActive: true,
    userCount: 0,
  };
}

function managedUser(
  id: string,
  userName: string,
  fullName: string,
  employeeCode: string,
  role: number,
  departmentId: string,
  departmentName: string,
  isActive: boolean
): UserDto {
  return {
    id,
    userName,
    email: `${userName}@acme.co`,
    fullName,
    employeeCode,
    role,
    departmentId,
    departmentName,
    isActive,
    lastLoginAt: null,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };
}
