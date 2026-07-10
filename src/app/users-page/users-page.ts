import { UserMenu } from '../user-menu/user-menu';
import { Component, computed, inject, signal } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { MatIconModule } from '@angular/material/icon';
import { FilterSelect } from '../filter-select/filter-select';
import { Role } from '../models/nav-item';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { LoadingSkeleton } from '../loading-skeleton/loading-skeleton';
import { DepartmentsService } from '../services/departments.service';
import { UsersService } from '../services/users.service';
import { controlValue, matchesSearch, uniqueStrings } from '../utils/search';
import { DepartmentListItem, UserDto, UserListItem } from '../models/api.model';
import { userRoleLabel, userRoleValue } from '../models/enums';

type UserStatus = 'Active' | 'Inactive';

interface ManagedUser {
  readonly id: string;
  readonly username: string;
  readonly fullName: string;
  readonly email: string;
  readonly employeeCode: string;
  readonly role: Role;
  readonly departmentId: string | null;
  readonly department: string;
  readonly status: UserStatus;
}

const ROLES: readonly Role[] = ['AdminIT', 'Manager', 'Employee'];
const STATUSES: readonly UserStatus[] = ['Active', 'Inactive'];

@Component({
  selector: 'app-users-page',
  imports: [A11yModule, FilterSelect, LoadingSkeleton, MatIconModule, UserMenu],
  templateUrl: './users-page.html',
  styleUrl: './users-page.css',
})
export class UsersPage {
  private readonly auth = inject(AuthService);
  private readonly usersApi = inject(UsersService);
  private readonly departmentsApi = inject(DepartmentsService);
  protected readonly theme = inject(ThemeService);

  protected readonly user = this.auth.profile;
  protected readonly canManage = computed(() => this.user().role === 'AdminIT');
  protected readonly users = signal<readonly ManagedUser[]>([]);
  protected readonly departments = signal<readonly DepartmentListItem[]>([]);
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
  protected readonly passwordInput = signal('');
  protected readonly roleInput = signal<Role>('Employee');
  protected readonly departmentInput = signal('');
  protected readonly formError = signal('');
  protected readonly statusMessage = signal('');
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');

  protected readonly roleOptions = ROLES;
  protected readonly departmentOptions = computed(() =>
    uniqueStrings(this.users().map(profile => profile.department))
  );
  protected readonly departmentChoices = computed(() => this.departments());
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

  constructor() {
    if (this.canManage()) {
      this.loadDepartments();
      this.loadUsers();
    } else {
      this.isLoading.set(false);
    }
  }

  protected updateGlobalSearch(event: Event): void {
    this.globalSearch.set(controlValue(event));
  }

  protected updateUserSearch(event: Event): void {
    this.userSearch.set(controlValue(event));
  }

  protected updateRoleFilter(event: Event): void {
    this.roleFilter.set(this.toRole(controlValue(event)));
  }

  protected setRoleFilter(value: string): void {
    this.roleFilter.set(this.toRole(value));
  }

  protected updateDepartmentFilter(event: Event): void {
    this.departmentFilter.set(controlValue(event));
  }

  protected updateStatusFilter(event: Event): void {
    this.statusFilter.set(this.toStatus(controlValue(event)));
  }

  protected setStatusFilter(value: string): void {
    this.statusFilter.set(this.toStatus(value));
  }

  protected toggleActionMenu(username: string): void {
    this.openActionUsername.update(current => (current === username ? null : username));
  }

  protected closeActionMenu(): void {
    this.openActionUsername.set(null);
  }

  protected toggleUserStatus(profile: ManagedUser): void {
    const status: UserStatus = profile.status === 'Active' ? 'Inactive' : 'Active';
    const request =
      status === 'Inactive'
        ? this.usersApi.offboard(profile.id)
        : this.usersApi.update(profile.id, {
            email: profile.email,
            fullName: profile.fullName,
            role: userRoleValue(profile.role),
            departmentId: profile.departmentId,
            isActive: true,
          });

    request.subscribe({
      next: updated => {
        this.users.update(users =>
          users.map(current => (current.id === profile.id ? toManagedUser(updated) : current))
        );
        this.statusMessage.set(
          status === 'Inactive' ? `${profile.fullName} offboarded` : `${profile.fullName} active`
        );
        this.closeActionMenu();
      },
      error: () => this.errorMessage.set(`Unable to update ${profile.fullName}.`),
    });
  }

  protected openAddDialog(): void {
    this.formError.set('');
    this.usernameInput.set('');
    this.fullNameInput.set('');
    this.emailInput.set('');
    this.employeeCodeInput.set('');
    this.passwordInput.set('');
    this.roleInput.set('Employee');
    this.departmentInput.set(this.departments()[0]?.id ?? '');
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

  protected updatePassword(event: Event): void {
    this.passwordInput.set(controlValue(event));
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
    const password = this.passwordInput();
    const role = this.roleInput();
    const departmentId = this.departmentInput() || null;
    const department = this.departments().find(item => item.id === departmentId)?.name ?? '';

    if (!username || !fullName || !email || !employeeCode || !password || !departmentId) {
      this.formError.set('Enter a username, full name, email, password, employee code, and department.');
      return;
    }

    if (!email.includes('@')) {
      this.formError.set('Enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      this.formError.set('Password must be at least 8 characters.');
      return;
    }

    this.usersApi
      .create({
        userName: username,
        email,
        password,
        fullName,
        employeeCode,
        role: userRoleValue(role),
        departmentId,
      })
      .subscribe({
        next: created => {
          this.users.update(users => [...users, toManagedUser(created)]);
          this.statusMessage.set(`${fullName} added`);
          this.closeAddDialog();
        },
        error: () => {
          this.formError.set('Unable to create the user.');
        },
      });
  }

  private loadUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.usersApi.list({ page: 1, pageSize: 200 }).subscribe({
      next: result => {
        this.users.set(result.items.map(toManagedUser));
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load users.');
        this.isLoading.set(false);
      },
    });
  }

  private loadDepartments(): void {
    this.departmentsApi
      .list({ page: 1, pageSize: 200 })
      .subscribe(result => this.departments.set(result.items));
  }

  private toRole(value: string): Role | '' {
    return ROLES.find(role => role === value) ?? '';
  }

  private toStatus(value: string): UserStatus | '' {
    return STATUSES.find(status => status === value) ?? '';
  }
}

function toManagedUser(item: UserListItem | UserDto): ManagedUser {
  return {
    id: item.id,
    username: item.userName ?? '-',
    fullName: item.fullName ?? '-',
    email: item.email ?? '-',
    employeeCode: item.employeeCode ?? '-',
    role: userRoleLabel(item.role),
    departmentId: item.departmentId,
    department: item.departmentName ?? '-',
    status: item.isActive ? 'Active' : 'Inactive',
  };
}
