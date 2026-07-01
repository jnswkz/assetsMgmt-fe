import { Component, computed, inject, signal } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { controlValue, matchesSearch } from '../utils/search';

interface Department {
  readonly code: string;
  readonly name: string;
  readonly manager: string;
  readonly active: boolean;
  readonly users: number;
}

const DEPARTMENTS: readonly Department[] = [
  { code: 'ENG', name: 'Engineering', manager: 'Ben Carter', active: true, users: 24 },
  { code: 'DSGN', name: 'Design', manager: 'Ben Carter', active: true, users: 8 },
  { code: 'OPS', name: 'Operations', manager: 'Ella Nguyen', active: true, users: 12 },
  { code: 'SALES', name: 'Sales', manager: 'Ella Nguyen', active: true, users: 18 },
  { code: 'MKT', name: 'Marketing', manager: 'Ella Nguyen', active: true, users: 9 },
  { code: 'FIN', name: 'Finance', manager: 'Jonas Berg', active: true, users: 6 },
  { code: 'IT', name: 'IT', manager: 'Jonas Berg', active: true, users: 5 },
  { code: 'HR', name: 'Human Resources', manager: 'Jonas Berg', active: false, users: 4 },
];

@Component({
  selector: 'app-departments-page',
  imports: [A11yModule, MatIconModule],
  templateUrl: './departments-page.html',
  styleUrl: './departments-page.css',
})
export class DepartmentsPage {
  private readonly auth = inject(AuthService);

  protected readonly user = this.auth.currentUser;
  protected readonly canView = computed(() => this.user().role === 'AdminIT' || this.user().role === 'Manager');
  protected readonly canManage = computed(() => this.user().role === 'AdminIT');
  protected readonly globalSearch = signal('');
  protected readonly departments = signal<readonly Department[]>(DEPARTMENTS);
  protected readonly isAddDialogOpen = signal(false);
  protected readonly codeInput = signal('');
  protected readonly nameInput = signal('');
  protected readonly managerInput = signal('');
  protected readonly usersInput = signal('0');
  protected readonly formError = signal('');
  protected readonly statusMessage = signal('');
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

  protected updateGlobalSearch(event: Event): void {
    this.globalSearch.set(controlValue(event));
  }

  protected toggleDepartment(department: Department): void {
    if (!this.canManage()) {
      return;
    }

    this.departments.update(departments =>
      departments.map(current =>
        current.code === department.code ? { ...current, active: !current.active } : current
      )
    );
    this.statusMessage.set(`${department.name} ${department.active ? 'disabled' : 'enabled'}`);
  }

  protected openAddDialog(): void {
    if (!this.canManage()) {
      return;
    }

    this.formError.set('');
    this.codeInput.set('');
    this.nameInput.set('');
    this.managerInput.set('');
    this.usersInput.set('0');
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

  protected updateUsers(event: Event): void {
    this.usersInput.set(controlValue(event));
  }

  protected addDepartment(): void {
    const code = this.codeInput().trim().toUpperCase();
    const name = this.nameInput().trim();
    const manager = this.managerInput().trim();
    const users = Number(this.usersInput());

    if (!code || !name || !manager || !Number.isInteger(users) || users < 0) {
      this.formError.set('Enter a code, name, manager, and a non-negative user count.');
      return;
    }

    if (this.departments().some(department => department.code === code)) {
      this.formError.set('Department code already exists.');
      return;
    }

    this.departments.update(departments => [
      ...departments,
      {
        code,
        name,
        manager,
        active: true,
        users,
      },
    ]);
    this.statusMessage.set(`${name} added`);
    this.closeAddDialog();
  }
}
