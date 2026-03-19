import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CardElevateDirective } from '../../shared/directives/card-elevate.directive';

@Component({
  selector: 'app-signup-page',
  imports: [ReactiveFormsModule, RouterLink, CardElevateDirective],
  templateUrl: './signup.page.html',
  styleUrl: './auth.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly errorMessage = signal('');
  protected readonly isSubmitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  protected submit(): void {
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, email, password, confirmPassword } = this.form.getRawValue();
    if (password !== confirmPassword) {
      this.errorMessage.set('Password and confirm password must match.');
      return;
    }

    this.isSubmitting.set(true);
    this.authService.signup({ username, email, password }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigateByUrl('/employees');
      },
      error: (error: unknown) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(this.getReadableError(error));
      }
    });
  }

  private getReadableError(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return String(error.message);
    }
    return 'Signup failed. Please check your data and try again.';
  }
}
