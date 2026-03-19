import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CardElevateDirective } from '../../shared/directives/card-elevate.directive';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink, CardElevateDirective],
  templateUrl: './login.page.html',
  styleUrl: './auth.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly errorMessage = signal('');
  protected readonly isSubmitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  protected submit(): void {
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.authService.login(this.form.getRawValue()).subscribe({
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
    return 'Login failed. Please verify your credentials and try again.';
  }
}
