import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly errorMessage = signal('');
  protected readonly isSubmitting = signal(false);
  protected readonly loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected onSubmit(): void {
    if (this.loginForm.invalid || this.isSubmitting()) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.getRawValue();
    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.auth.login(username, password).subscribe({
      next: success => {
        this.isSubmitting.set(false);
        if (success) {
          void this.router.navigateByUrl(this.auth.role() === 'Employee' ? '/assets/mine' : '/dashboard');
        } else {
          this.errorMessage.set('Invalid username or password.');
        }
      },
      error: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set('Unable to reach the server. Please try again.');
      },
    });
  }
}
