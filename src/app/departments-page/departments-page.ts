import { UserMenu } from '../user-menu/user-menu';
import { Component, computed, inject, signal } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { LoadingSkeleton } from '../loading-skeleton/loading-skeleton';
import { DepartmentsService } from '../services/departments.service';
import { UsersService } from '../services/users.service';
import { controlValue, matchesSearch } from '../utils/search';
import { DepartmentDto, DepartmentListItem, UserListItem } from '../models/api.model';
import { userRoleValue } from '../models/enums';

interface Department {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly managerId: string | null;
  readonly manager: string;
  readonly active: boolean;
  readonly users: number;
}

@Component({
  selector: 'app-departments-page',
  imports: [A11yModule, LoadingSkeleton, MatIconModule, UserMenu],
  templateUrl: './departments-page.html',
  styleUrl: './departments-page.css',
})
export class DepartmentsPage {
  private readonly auth = inject(AuthService);
  private readonly departmentsApi = inject(DepartmentsService);
  private readonly usersApi = inject(UsersService);
  protected readonly theme = inject(ThemeService);

  protected readonly user = this.auth.profile;
  protected readonly canView = computed(() => this.user().role === 'AdminIT' || this.user().role === 'Manager');
  protected readonly canManage = computed(() => this.user().role === 'AdminIT');
  protected readonly globalSearch = signal('');
  protected readonly departments = signal<readonly Department[]>([]);
  protected readonly managers = signal<readonly UserListItem[]>([]);
  protected readonly isAddDialogOpen = signal(false);
  protected readonly codeInput = signal('');
  protected readonly nameInput = signal('');
  protected readonly managerInput = signal('');
  protected readonly formError = signal('');
  protected readonly statusMessage = signal('');
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly filteredDepartments = computed(() =>
    this.departments().filter(department =>
      matchesSearch(this.globalSearch(), [
        department.code,
        department.name,
        department.manager,
        department.active ? 'Active' : 'Inactive',
        department.users,
      ])
    )
  );

  constructor() {
    if (this.canView()) {
      this.loadManagers();
      this.loadDepartments();
    } else {
      this.isLoading.set(false);
    }
  }

  protected updateGlobalSearch(event: Event): void {
    this.globalSearch.set(controlValue(event));
  }

  protected toggleDepartment(department: Department): void {
    if (!this.canManage()) {
      return;
    }

    this.departmentsApi
      .update(department.id, {
        name: department.name,
        managerId: department.managerId,
        isActive: !department.active,
      })
      .subscribe({
        next: updated => {
          this.departments.update(departments =>
            departments.map(current =>
              current.id === department.id ? toDepartment(updated, current.users) : current
            )
          );
          this.statusMessage.set(`${department.name} ${department.active ? 'disabled' : 'enabled'}`);
        },
        error: () => this.errorMessage.set(`Unable to update ${department.name}.`),
      });
  }

  protected openAddDialog(): void {
    if (!this.canManage()) {
      return;
    }

    this.formError.set('');
    this.codeInput.set('');
    this.nameInput.set('');
    this.managerInput.set('');
    this.isAddDialogOpen.set(true);
  }

  protected closeAddDialog(): void {
    this.isAddDialogOpen.set(false);
  }

  protected updateCode(event: Event): void {
    this.codeInput.set(controlValue(event).toUpperCase());
  }

  protected updateName(event: Event): void {
    this.nameInput.set(controlValue(event));
  }

  protected updateManager(event: Event): void {
    this.managerInput.set(controlValue(event));
  }

  protected addDepartment(): void {
    const code = this.codeInput().trim().toUpperCase();
    const name = this.nameInput().trim();
    const manager = this.resolveManagerId(this.managerInput().trim());

    if (!code || !name) {
      this.formError.set('Enter a code and department name.');
      return;
    }

    if (this.managerInput().trim() && !manager) {
      this.formError.set('Choose a valid manager name from existing users.');
      return;
    }

    this.departmentsApi
      .create({
        code,
        name,
        managerId: manager,
      })
      .subscribe({
        next: created => {
          this.departments.update(departments => [...departments, toDepartment(created, 0)]);
          this.statusMessage.set(`${name} added`);
          this.closeAddDialog();
        },
        error: () => {
          this.formError.set('Unable to create the department.');
        },
      });
  }

  private loadDepartments(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.departmentsApi.list({ page: 1, pageSize: 200 }).subscribe({
      next: result => {
        this.departments.set(result.items.map(item => toDepartment(item, item.userCount)));
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load departments.');
        this.isLoading.set(false);
      },
    });
  }

  private loadManagers(): void {
    this.usersApi
      .list({ role: userRoleValue('Manager'), page: 1, pageSize: 200 })
      .subscribe(result => this.managers.set(result.items.filter(user => user.isActive)));
  }

  private resolveManagerId(managerName: string): string | null {
    if (!managerName) {
      return null;
    }
    return (
      this.managers().find(manager => (manager.fullName ?? '').trim() === managerName)?.id ?? null
    );
  }
}

function toDepartment(item: Pick<DepartmentDto, 'id' | 'code' | 'name' | 'managerId' | 'managerName' | 'isActive'>, users: number): Department {
  return {
    id: item.id,
    code: item.code ?? '-',
    name: item.name ?? '-',
    managerId: item.managerId,
    manager: item.managerName ?? '-',
    active: item.isActive,
    users,
  };
}
