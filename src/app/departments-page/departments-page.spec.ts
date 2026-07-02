import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { DepartmentsService } from '../services/departments.service';
import { UsersService } from '../services/users.service';
import { DepartmentDto, DepartmentListItem, PagedResult, UserListItem } from '../models/api.model';
import { DepartmentsPage } from './departments-page';

const MANAGERS: readonly UserListItem[] = [
  user('user-ben', 'ben', 'Ben Carter', 1, 'dept-eng', 'Engineering', true),
  user('user-jonas', 'jonas', 'Jonas Berg', 1, 'dept-fin', 'Finance', true),
  user('user-mina', 'mina', 'Mina Park', 1, 'dept-qa', 'Quality Assurance', true),
];

describe('DepartmentsPage', () => {
  let fixture: ComponentFixture<DepartmentsPage>;
  let auth: AuthService;
  let departments: Array<DepartmentDto & { userCount: number }>;
  let departmentsApi: {
    list: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    departments = [
      department('dept-eng', 'ENG', 'Engineering', 'user-ben', 'Ben Carter', true, 12),
      department('dept-fin', 'FIN', 'Finance', 'user-jonas', 'Jonas Berg', true, 6),
      department('dept-hr', 'HR', 'Human Resources', null, '-', true, 4),
      department('dept-mkt', 'MKT', 'Marketing', null, '-', true, 5),
      department('dept-sales', 'SAL', 'Sales', null, '-', true, 8),
      department('dept-ops', 'OPS', 'Operations', null, '-', true, 9),
      department('dept-proc', 'PRC', 'Procurement', null, '-', true, 3),
      department('dept-it', 'IT', 'IT Asset Management', 'user-alice', 'Alice Morgan', true, 7),
    ];

    departmentsApi = {
      list: vi.fn(() => of(page(departments.map(item => toListItem(item))))),
      update: vi.fn((id: string, body: { name: string | null; managerId?: string | null; isActive: boolean }) => {
        const current = departments.find(item => item.id === id) ?? departments[0];
        const updated = {
          ...current,
          name: body.name,
          managerId: body.managerId ?? null,
          managerName: managerName(body.managerId ?? null),
          isActive: body.isActive,
          updatedAt: '2026-07-02T00:00:00Z',
        };
        departments = departments.map(item => (item.id === id ? updated : item));
        return of(updated);
      }),
      create: vi.fn((body: { code: string | null; name: string | null; managerId?: string | null }) => {
        const created = {
          id: `dept-${body.code?.toLowerCase() ?? 'new'}`,
          code: body.code,
          name: body.name,
          managerId: body.managerId ?? null,
          managerName: managerName(body.managerId ?? null),
          isActive: true,
          userCount: 0,
          createdAt: '2026-07-02T00:00:00Z',
          updatedAt: '2026-07-02T00:00:00Z',
        } satisfies DepartmentDto & { userCount: number };
        departments = [...departments, created];
        return of(created);
      }),
    };

    await TestBed.configureTestingModule({
      imports: [DepartmentsPage],
      providers: [
        { provide: DepartmentsService, useValue: departmentsApi },
        {
          provide: UsersService,
          useValue: {
            list: vi.fn(() => of(page(MANAGERS))),
          },
        },
      ],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
  });

  async function createPage(username = 'alice'): Promise<HTMLElement> {
    auth.selectMockUser(username);
    fixture = TestBed.createComponent(DepartmentsPage);
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('should render a read-only department table for managers', async () => {
    const compiled = await createPage('ben');

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

  it('should filter departments from the top search', async () => {
    const compiled = await createPage();
    const search = compiled.querySelector<HTMLInputElement>('#departments-global-search');
    search!.value = 'Finance';
    search!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('tbody tr').length).toBe(1);
    expect(compiled.textContent).toContain('FIN');
    expect(compiled.textContent).toContain('Jonas Berg');
  });

  it('should let AdminIT disable and enable departments', async () => {
    const compiled = await createPage();
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

  it('should let AdminIT add a new department', async () => {
    const compiled = await createPage();
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

  it('should block direct employee access', async () => {
    const compiled = await createPage('chloe');

    expect(compiled.textContent).toContain('Only managers and AdminIT users can view departments.');
    expect(compiled.querySelector('table')).toBeNull();
  });

  function managerName(id: string | null): string | null {
    return MANAGERS.find(manager => manager.id === id)?.fullName ?? null;
  }
});

function page<T>(items: readonly T[]): PagedResult<T> {
  return { items, total: items.length, page: 1, pageSize: 200, totalPages: 1 };
}

function department(
  id: string,
  code: string,
  name: string,
  managerId: string | null,
  managerName: string | null,
  isActive: boolean,
  userCount: number
): DepartmentDto & { userCount: number } {
  return {
    id,
    code,
    name,
    managerId,
    managerName,
    isActive,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    userCount,
  };
}

function toListItem(item: DepartmentDto & { userCount: number }): DepartmentListItem {
  return {
    id: item.id,
    code: item.code,
    name: item.name,
    managerId: item.managerId,
    managerName: item.managerName,
    isActive: item.isActive,
    userCount: item.userCount,
  };
}

function user(
  id: string,
  userName: string,
  fullName: string,
  role: number,
  departmentId: string,
  departmentName: string,
  isActive: boolean
): UserListItem {
  return {
    id,
    userName,
    email: `${userName}@acme.co`,
    fullName,
    employeeCode: `${userName.toUpperCase()}-1000`,
    role,
    departmentId,
    departmentName,
    isActive,
  };
}
