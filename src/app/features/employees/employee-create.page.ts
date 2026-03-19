import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeeInput } from '../../core/models/employee.model';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-employee-create-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './employee-form.page.html',
  styleUrl: './employees.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeCreatePage {
  private readonly fb = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);

  protected readonly isEditMode = false;
  protected readonly title = 'Add Employee';
  protected readonly pageLoading = signal(false);
  protected readonly submitLabel = signal('Create Employee');
  protected readonly errorMessage = signal('');
  protected readonly imagePreview = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    department: ['', [Validators.required]],
    position: ['', [Validators.required]],
    salary: [0, [Validators.required, Validators.min(1)]],
    picture: ['']
  });

  protected onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
      this.imagePreview.set(null);
      this.form.controls.picture.setValue('');
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('Only image files are allowed.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.errorMessage.set('Please use an image less than 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      this.imagePreview.set(result || null);
      this.form.controls.picture.setValue(result);
      this.errorMessage.set('');
    };
    reader.readAsDataURL(file);
  }

  protected submit(): void {
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitLabel.set('Saving...');
    const payload = this.form.getRawValue() as EmployeeInput;

    this.employeeService.addEmployee(payload).subscribe({
      next: () => {
        this.submitLabel.set('Create Employee');
        this.router.navigateByUrl('/employees');
      },
      error: (error: unknown) => {
        this.submitLabel.set('Create Employee');
        this.errorMessage.set(this.getReadableError(error));
      }
    });
  }

  private getReadableError(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return String(error.message);
    }
    return 'Unable to create employee right now. Please try again.';
  }
}
