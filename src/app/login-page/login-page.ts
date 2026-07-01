import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, MOCK_USERS } from '../services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly mockUsers = MOCK_USERS;
  protected readonly errorMessage = signal('');
  protected readonly loginForm = new FormGroup({
    username: new FormControl(this.auth.currentUser().username, { nonNullable: true }),
    password: new FormControl('password', { nonNullable: true }),
  });

  protected selectMockUser(username: string): void {
    this.auth.selectMockUser(username);
    this.loginForm.controls.username.setValue(username);
    this.loginForm.controls.password.setValue('password');
    this.errorMessage.set('');
  }

  protected onSubmit(): void {
    const { username, password } = this.loginForm.getRawValue();

    if (!this.auth.login(username, password)) {
      this.errorMessage.set('Use one of the mock profiles with password "password".');
      return;
    }

    this.errorMessage.set('');
    void this.router.navigateByUrl('/dashboard');
  }
}
