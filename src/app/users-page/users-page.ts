import { Component, computed, inject, signal } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { MatIconModule } from '@angular/material/icon';
import { Role } from '../models/nav-item';
import { AuthService } from '../services/auth.service';
import { controlValue, matchesSearch, uniqueStrings } from '../utils/search';

type UserStatus = 'Active' | 'Inactive';

interface ManagedUser {
  readonly username: string;
  readonly fullName: string;
  readonly email: string;
  readonly employeeCode: string;
  readonly role: Role;
  readonly department: string;
  readonly status: UserStatus;
}

const USERS: readonly ManagedUser[] = [
  {
    username: 'alice',
    fullName: 'Alice Morgan',
    email: 'alice@acme.co',
    employeeCode: 'E-1001',
    role: 'AdminIT',
    department: 'IT',
    status: 'Active',
  },
  {
    username: 'ben',
    fullName: 'Ben Carter',
    email: 'ben@acme.co',
    employeeCode: 'E-1002',
    role: 'Manager',
    department: 'Engineering',
    status: 'Active',
  },
  {
    username: 'chloe',
    fullName: 'Chloe Davis',
    email: 'chloe@acme.co',
    employeeCode: 'E-1003',
    role: 'Employee',
    department: 'Engineering',
    status: 'Active',
  },
  {
    username: 'diego',
    fullName: 'Diego Ramirez',
    email: 'diego@acme.co',
    employeeCode: 'E-1004',
    role: 'Employee',
    department: 'Design',
    status: 'Active',
  },
  {
    username: 'ella',
    fullName: 'Ella Nguyen',
    email: 'ella@acme.co',
    employeeCode: 'E-1005',
    role: 'Manager',
    department: 'Operations',
    status: 'Active',
  },
  {
    username: 'felix',
    fullName: 'Felix Wong',
    email: 'felix@acme.co',
    employeeCode: 'E-1006',
    role: 'Employee',
    department: 'Sales',
    status: 'Active',
  },
  {
    username: 'gina',
    fullName: 'Gina Patel',
    email: 'gina@acme.co',
    employeeCode: 'E-1007',
    role: 'Employee',
    department: 'Marketing',
    status: 'Active',
  },
  {
    username: 'hugo',
    fullName: 'Hugo Schmidt',
    email: 'hugo@acme.co',
    employeeCode: 'E-1008',
    role: 'Employee',
    department: 'Finance',
    status: 'Inactive',
  },
  {
    username: 'ivy',
    fullName: 'Ivy Tanaka',
    email: 'ivy@acme.co',
    employeeCode: 'E-1009',
    role: 'Employee',
    department: 'Engineering',
    status: 'Active',
  },
  {
    username: 'jonas',
    fullName: 'Jonas Berg',
    email: 'jonas@acme.co',
    employeeCode: 'E-1010',
    role: 'Manager',
    department: 'IT',
    status: 'Active',
  },
];

const ROLES: readonly Role[] = ['AdminIT', 'Manager', 'Employee'];
const STATUSES: readonly UserStatus[] = ['Active', 'Inactive'];

@Component({
  selector: 'app-users-page',
  imports: [A11yModule, MatIconModule],
  templateUrl: './users-page.html',
  styleUrl: './users-page.css',
})
export class UsersPage {
  private readonly auth = inject(AuthService);

  protected readonly user = this.auth.currentUser;
  protected readonly canManage = computed(() => this.user().role === 'AdminIT');
  protected readonly users = signal<readonly ManagedUser[]>(USERS);
  protected readonly globalSearch = signal('');
  protected readonly userSearch = signal('');
  protected readonly roleFilter = signal<Role | ''>('');
  protected readonly departmentFilter = signal('');
  protected readonly statusFilter = signal<UserStatus | ''>('');
  protected readonly openActionUsername = signal<string | null>(null);
  protected readonly isAddDialogOpen = signal(false);
  protected readonly usernameInput = signal('');
  protected readonly fullNameInput = signal('');
  protected readonly emailInput = signal('');
  protected readonly employeeCodeInput = signal('');
  protected readonly roleInput = signal<Role>('Employee');
  protected readonly departmentInput = signal('Engineering');
  protected readonly formError = signal('');
  protected readonly statusMessage = signal('');

  protected readonly roleOptions = ROLES;
  protected readonly departmentOptions = computed(() => uniqueStrings(this.users().map(profile => profile.department)));
  protected readonly filteredUsers = computed(() => {
    const globalSearch = this.globalSearch();
    const userSearch = this.userSearch();
    const roleFilter = this.roleFilter();
    const departmentFilter = this.departmentFilter();
    const statusFilter = this.statusFilter();

    return this.users().filter(profile => {
      const fields = [
        profile.username,
        profile.fullName,
        profile.email,
        profile.employeeCode,
        profile.role,
        profile.department,
        profile.status,
      ];

      return (
        matchesSearch(globalSearch, fields) &&
        matchesSearch(userSearch, fields) &&
        (roleFilter === '' || profile.role === roleFilter) &&
        (departmentFilter === '' || profile.department === departmentFilter) &&
        (statusFilter === '' || profile.status === statusFilter)
      );
    });
  });

  protected updateGlobalSearch(event: Event): void {
    this.globalSearch.set(controlValue(event));
  }

  protected updateUserSearch(event: Event): void {
    this.userSearch.set(controlValue(event));
  }

  protected updateRoleFilter(event: Event): void {
    this.roleFilter.set(this.toRole(controlValue(event)));
  }

  protected updateDepartmentFilter(event: Event): void {
    this.departmentFilter.set(controlValue(event));
  }

  protected updateStatusFilter(event: Event): void {
    this.statusFilter.set(this.toStatus(controlValue(event)));
  }

  protected toggleActionMenu(username: string): void {
    this.openActionUsername.update(current => (current === username ? null : username));
  }

  protected closeActionMenu(): void {
    this.openActionUsername.set(null);
  }

  protected toggleUserStatus(profile: ManagedUser): void {
    const status: UserStatus = profile.status === 'Active' ? 'Inactive' : 'Active';

    this.users.update(users =>
      users.map(current => (current.username === profile.username ? { ...current, status } : current))
    );
    this.statusMessage.set(`${profile.fullName} ${status.toLowerCase()}`);
    this.closeActionMenu();
  }

  protected openAddDialog(): void {
    this.formError.set('');
    this.usernameInput.set('');
    this.fullNameInput.set('');
    this.emailInput.set('');
    this.employeeCodeInput.set('');
    this.roleInput.set('Employee');
    this.departmentInput.set('Engineering');
    this.isAddDialogOpen.set(true);
    this.closeActionMenu();
  }

  protected closeAddDialog(): void {
    this.isAddDialogOpen.set(false);
  }

  protected updateUsername(event: Event): void {
    this.usernameInput.set(controlValue(event).trim().toLowerCase());
  }

  protected updateFullName(event: Event): void {
    this.fullNameInput.set(controlValue(event));
  }

  protected updateEmail(event: Event): void {
    this.emailInput.set(controlValue(event).trim().toLowerCase());
  }

  protected updateEmployeeCode(event: Event): void {
    this.employeeCodeInput.set(controlValue(event).trim().toUpperCase());
  }

  protected updateRoleInput(event: Event): void {
    const role = this.toRole(controlValue(event));
    this.roleInput.set(role || 'Employee');
  }

  protected updateDepartmentInput(event: Event): void {
    this.departmentInput.set(controlValue(event));
  }

  protected addUser(): void {
    const username = this.usernameInput().trim().toLowerCase();
    const fullName = this.fullNameInput().trim();
    const email = this.emailInput().trim().toLowerCase();
    const employeeCode = this.employeeCodeInput().trim().toUpperCase();
    const role = this.roleInput();
    const department = this.departmentInput().trim();

    if (!username || !fullName || !email || !employeeCode || !department) {
      this.formError.set('Enter a username, full name, email, employee code, and department.');
      return;
    }

    if (!email.includes('@')) {
      this.formError.set('Enter a valid email address.');
      return;
    }

    if (this.users().some(profile => profile.username === username)) {
      this.formError.set('Username already exists.');
      return;
    }

    if (this.users().some(profile => profile.employeeCode === employeeCode)) {
      this.formError.set('Employee code already exists.');
      return;
    }

    this.users.update(users => [
      ...users,
      {
        username,
        fullName,
        email,
        employeeCode,
        role,
        department,
        status: 'Active',
      },
    ]);
    this.statusMessage.set(`${fullName} added`);
    this.closeAddDialog();
  }

  private toRole(value: string): Role | '' {
    return ROLES.find(role => role === value) ?? '';
  }

  private toStatus(value: string): UserStatus | '' {
    return STATUSES.find(status => status === value) ?? '';
  }
}
