import { Service, computed, signal } from '@angular/core';
import { Role } from '../models/nav-item';

export interface MockUser {
  readonly username: string;
  readonly password: string;
  readonly displayName: string;
  readonly firstName: string;
  readonly initials: string;
  readonly department: string;
  readonly role: Role;
}

export const MOCK_USERS: readonly MockUser[] = [
  {
    username: 'alice',
    password: 'password',
    displayName: 'Alice Morgan',
    firstName: 'Alice',
    initials: 'AM',
    department: 'IT',
    role: 'AdminIT',
  },
  {
    username: 'ben',
    password: 'password',
    displayName: 'Ben Carter',
    firstName: 'Ben',
    initials: 'BC',
    department: 'Operations',
    role: 'Manager',
  },
  {
    username: 'chloe',
    password: 'password',
    displayName: 'Chloe Davis',
    firstName: 'Chloe',
    initials: 'CD',
    department: 'Engineering',
    role: 'Employee',
  },
];

@Service()
export class AuthService {
  private readonly currentUserState = signal<MockUser>(MOCK_USERS[2]);

  readonly currentUser = computed(() => this.currentUserState());
  readonly role = computed(() => this.currentUser().role);

  login(username: string, password: string): boolean {
    const normalizedUsername = username.trim().toLowerCase();
    const user = MOCK_USERS.find(
      profile => profile.username === normalizedUsername && profile.password === password
    );

    if (!user) {
      return false;
    }

    this.currentUserState.set(user);
    return true;
  }

  selectMockUser(username: string): void {
    const user = MOCK_USERS.find(profile => profile.username === username);

    if (user) {
      this.currentUserState.set(user);
    }
  }
}
